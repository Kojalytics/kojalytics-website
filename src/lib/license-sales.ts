import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { decryptKey, encryptKey, generateKey, hashKey, normalizeKey } from '@/lib/license';
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, LAUNCHER_DOWNLOAD_URL, PLANS } from '@/lib/pricing';

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
  // A 100 % discount code makes the order free: Stripe then reports no_payment_required instead of paid.
  if (session.metadata?.product !== LICENSE_PRODUCT || (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required')) return null;
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
        await sendLicenseEmail(issued.email, issued.key, issued.subscription, session.amount_total, session.metadata?.koja_code);
      } catch (e) {
        console.error('License email failed', e);
        await db.from('koja_licenses').update({ emailed_at: null }).eq('stripe_session_id', session.id);
      }
    }
  }
  return issued;
}

const euro = (cents: number) => (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

async function sendLicenseEmail(to: string, key: string, subscription: boolean, paidCents: number | null, code?: string) {
  const plan = subscription ? PLANS.monthly : PLANS.lifetime;
  // With a discount code: the amount actually paid (for the subscription: the first month).
  const discounted = paidCents !== null && paidCents !== plan.cents ? ` Mit Rabattcode${code ? ` ${code}` : ''} bezahlt: ${euro(paidCents)}${subscription ? ' für den ersten Abrechnungszeitraum' : ''}.` : '';
  const text = [
    'Danke für deinen Kauf!',
    '',
    `Dein Kojalytics-Lizenzschlüssel: ${key}`,
    '',
    'So aktivierst du ihn:',
    '1. Lade den Kojalytics Launcher:',
    `   Mac: https://www.kojalytics.com${DOWNLOAD_PATH}`,
    `   Windows: https://www.kojalytics.com${DOWNLOAD_PATH_WINDOWS}`,
    '2. Mac: Öffne die Datei und ziehe den Launcher in den Ordner „Programme“. Windows: Öffne die Datei und folge dem Installations-Assistenten.',
    '3. Starte den Launcher und gehe zu Einstellungen › Lizenz.',
    '4. Füge den Schlüssel ein und klicke auf „Aktivieren“.',
    '5. Installiere deine Koja-Apps direkt im Launcher.',
    '',
    subscription
      ? `Dein Monatsabo gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Geräten (Mac oder Windows-PC). Kündigen kannst du jederzeit online: https://www.kojalytics.com/kuendigen`
      : `Deine dauerhafte Lizenz gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Geräten (Mac oder Windows-PC).`,
    '',
    // Contract confirmation (§ 312f BGB).
    'Deine Bestellung',
    (subscription
      ? `Koja-Apps · Monatlich: alle 13 Koja-Apps für Mac und Windows, ${PLANS.monthly.label} pro Monat inkl. MwSt., monatlich kündbar.`
      : `Koja-Apps · Dauerhaft: alle 13 Koja-Apps für Mac und Windows, einmalig ${PLANS.lifetime.label} inkl. MwSt., ohne Ablaufdatum.`) + discounted,
    'Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha), die mit Updates laufend weiterentwickelt werden.',
    '',
    'Es gelten unsere AGB mit Widerrufsbelehrung: https://www.kojalytics.com/agb',
    'Widerruf erklären: https://www.kojalytics.com/widerrufen',
    'Anbieter: Kojalytics, Farzad Khojazada, Am Diggen 40i, 21077 Hamburg, support@kojalytics.com',
    '',
    'Bitte bewahre diese E-Mail gut auf.',
    '',
    'Fragen? Antworte einfach auf diese E-Mail.',
    'Kojalytics · https://www.kojalytics.com',
  ].join('\n');
  await sendEmail(to, 'Dein Kojalytics-Lizenzschlüssel', text);
}

/** `scheduledAt` (ISO timestamp): Resend holds the e-mail and sends it then instead of now. */
export async function sendEmail(to: string, subject: string, text: string, { scheduledAt }: { scheduledAt?: string } = {}) {
  const from = process.env.LICENSE_EMAIL_FROM || 'Kojalytics <license@kojalytics.com>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, ...(scheduledAt && { scheduled_at: scheduledAt }) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
