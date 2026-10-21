import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { decryptKey, encryptKey, generateKey, hashKey, normalizeKey } from '@/lib/license';

export const LICENSE_PRODUCT = 'koja_license';
export const LICENSE_PRICE_CENTS = 3995;
export const LICENSE_PRICE_LABEL = '39,95 €';
export const LICENSE_DEVICES = 3;
export const LAUNCHER_DOWNLOAD_URL =
  'https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.dmg';

const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type IssuedLicense = { key: string; email: string | null };

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

  const issued = { key: decryptKey(row.key_encrypted, secret), email: row.email };
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
        await sendLicenseEmail(issued.email, issued.key);
      } catch (e) {
        console.error('License email failed', e);
        await db.from('koja_licenses').update({ emailed_at: null }).eq('stripe_session_id', session.id);
      }
    }
  }
  return issued;
}

async function sendLicenseEmail(to: string, key: string) {
  const from = process.env.LICENSE_EMAIL_FROM || 'Kojalytics <license@kojalytics.com>';
  const text = [
    'Danke für deinen Kauf!',
    '',
    `Dein Kojalytics-Lizenzschlüssel: ${key}`,
    '',
    'So aktivierst du ihn:',
    `1. Lade den Kojalytics Launcher für den Mac herunter: ${LAUNCHER_DOWNLOAD_URL}`,
    '2. Öffne die Datei und ziehe den Launcher in den Programme-Ordner.',
    '3. Starte den Launcher und gehe zu Einstellungen › Lizenz.',
    '4. Füge den Schlüssel ein und klicke auf „Aktivieren“.',
    '5. Installiere deine Koja-Apps direkt im Launcher.',
    '',
    `Der Schlüssel gilt lebenslang für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Geräten.`,
    'Bewahre diese E-Mail gut auf.',
    '',
    'Fragen? Antworte einfach auf diese E-Mail.',
    'Kojalytics · https://www.kojalytics.com',
  ].join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject: 'Dein Kojalytics-Lizenzschlüssel', text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
