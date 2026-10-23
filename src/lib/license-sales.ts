import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { decryptKey, encryptKey, generateKey, hashKey, normalizeKey } from '@/lib/license';
import { LAUNCHER_DOWNLOAD_URL } from '@/lib/pricing';

export { LAUNCHER_DOWNLOAD_URL };
export const LICENSE_PRODUCT = 'koja_license';
export const LICENSE_DEVICES = 3;

const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type IssuedLicense = { key: string; email: string | null; subscription: boolean };

/**
 * A cancelled subscription ends: the key bought with its first checkout stops activating.
 * Returns how many keys were revoked.
 */
export async function revokeLicenseForSubscription(stripe: Stripe, subscriptionId: string): Promise<number> {
  const sessions = await stripe.checkout.sessions.list({ subscription: subscriptionId, limit: 5 });
  const ids = sessions.data.filter((s) => s.metadata?.product === LICENSE_PRODUCT).map((s) => s.id);
  if (!ids.length) return 0;
  const { data, error } = await admin()
    .from('koja_licenses')
    .update({ revoked_at: new Date().toISOString() })
    .in('stripe_session_id', ids)
    .is('revoked_at', null)
    .select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

/**
 * The license bought in `session`: created on first call (webhook or success page, whichever
 * comes first), the same one on every later call. Emails it once when Resend is configured.
 * Returns null for a session that isn't a paid license purchase.
 */
export async function issueLicenseForSession(session: Stripe.Checkout.Session): Promise<IssuedLicense | null> {
  if (session.metadata?.product !== LICENSE_PRODUCT || session.payment_status !== 'paid') return null;
  const secret = process.env.LICENSE_SIGNING_PRIVATE_KEY;
  if (!secret) throw new Error('LICENSE_SIGNING_PRIVATE_KEY is not set');
  const db = admin();
  const email = session.customer_details?.email ?? session.customer_email ?? null;

  const existing = await db.from('koja_licenses').select('key_encrypted, email, emailed_at').eq('stripe_session_id', session.id).maybeSingle();
  if (existing.error) throw existing.error;
  let row = existing.data;
  if (!row) {
    const key = generateKey();
    const body = normalizeKey(key)!;
    const inserted = await db
      .from('koja_licenses')
      .insert({
        key_hash: hashKey(body),
        key_hint: body.slice(-5),
        key_encrypted: encryptKey(key, secret),
        email,
        note: `Stripe ${session.id}`,
        max_devices: LICENSE_DEVICES,
        stripe_session_id: session.id,
      })
      .select('key_encrypted, email, emailed_at')
      .single();
    if (inserted.error?.code === '23505') {
      // The webhook and the success page raced: the other one created it.
      const again = await db.from('koja_licenses').select('key_encrypted, email, emailed_at').eq('stripe_session_id', session.id).single();
      if (again.error) throw again.error;
      row = again.data;
    } else if (inserted.error) {
      throw inserted.error;
    } else {
      row = inserted.data;
    }
  }

  const issued = { key: decryptKey(row.key_encrypted, secret), email: row.email, subscription: session.mode === 'subscription' };
  if (!row.emailed_at && issued.email && process.env.RESEND_API_KEY) {
    // Claim the email first so a parallel call doesn't send it twice.
    const claimed = await db
      .from('koja_licenses')
      .update({ emailed_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id)
      .is('emailed_at', null)
      .select('id');
    if (claimed.data?.length) {
      try {
        await sendLicenseEmail(issued.email, issued.key, issued.subscription);
      } catch (e) {
        console.error('License email failed', e);
        await db.from('koja_licenses').update({ emailed_at: null }).eq('stripe_session_id', session.id);
      }
    }
  }
  return issued;
}

async function sendLicenseEmail(to: string, key: string, subscription: boolean) {
  const text = [
    'Thanks for your purchase!',
    '',
    `Your Kojalytics license key: ${key}`,
    '',
    'How to activate it:',
    `1. Download the Kojalytics Launcher for Mac: ${LAUNCHER_DOWNLOAD_URL}`,
    '2. Open the file and drag the Launcher into your Applications folder.',
    '3. Start the Launcher and go to Settings › License.',
    '4. Paste the key and click "Activate".',
    '5. Install your Koja apps right in the Launcher.',
    '',
    subscription
      ? `Your monthly plan covers all Koja apps on up to ${LICENSE_DEVICES} Macs. Cancel any time in one click: https://www.kojalytics.com/cancel`
      : `Your lifetime license covers all Koja apps on up to ${LICENSE_DEVICES} Macs.`,
    'Please keep this email.',
    '',
    'Questions? Just reply to this email.',
    'Kojalytics · https://www.kojalytics.com',
  ].join('\n');
  await sendEmail(to, 'Your Kojalytics license key', text);
}

export async function sendEmail(to: string, subject: string, text: string) {
  const from = process.env.LICENSE_EMAIL_FROM || 'Kojalytics <license@kojalytics.com>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
