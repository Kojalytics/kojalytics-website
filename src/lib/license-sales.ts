import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { decryptKey, encryptKey, generateKey, hashKey, normalizeKey } from '@/lib/license';
import { LAUNCHER_DOWNLOAD_URL } from '@/lib/pricing';
import { licenseEmail } from '@/lib/license-email';

export { LAUNCHER_DOWNLOAD_URL };
export const LICENSE_PRODUCT = 'koja_license';
export const LICENSE_DEVICES = 3;

const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type IssuedLicense = { key: string; email: string | null; subscription: boolean };

/**
 * The licence keys of a customer, for the support copy of a cancellation or withdrawal, so they can be found in
 * Koja Keys at once: found via the subscriptions' checkout sessions and via the e-mail address stored with the key.
 * One line per key: its last group (search it in Koja Keys), active or deactivated, and when it was bought.
 * Never throws: a failed lookup must not stop the cancellation.
 */
export async function licenseKeysFor(email: string, stripe?: Stripe, subscriptionIds: string[] = []): Promise<string[]> {
  try {
    const db = admin();
    const sessionIds: string[] = [];
    if (stripe) {
      for (const id of subscriptionIds) {
        const sessions = await stripe.checkout.sessions.list({ subscription: id, limit: 5 });
        sessionIds.push(...sessions.data.map((s) => s.id));
      }
    }
    const columns = 'id, key_hint, revoked_at, created_at';
    const [bySession, byEmail] = await Promise.all([
      sessionIds.length ? db.from('koja_licenses').select(columns).in('stripe_session_id', sessionIds) : Promise.resolve({ data: [] }),
      // ilike without wildcards: the address case-insensitively ("_" and "%" escaped).
      db.from('koja_licenses').select(columns).ilike('email', email.replace(/[\\%_]/g, (c) => `\\${c}`)),
    ]);
    const rows = new Map<string, { key_hint: string; revoked_at: string | null; created_at: string }>();
    for (const r of [...(bySession.data ?? []), ...(byEmail.data ?? [])]) rows.set(r.id, r);
    return [...rows.values()].map(
      (r) =>
        `Schlüssel endet auf ${r.key_hint} (${r.revoked_at ? 'schon deaktiviert' : 'aktiv'}, erstellt am ${new Date(r.created_at).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })})`,
    );
  } catch (e) {
    console.error('Licence lookup failed', e);
    return [];
  }
}

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
  return issueLicense({
    ref: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    note: `Stripe ${session.id}`,
    subscription: session.mode === 'subscription',
    paidCents: session.amount_total,
    code: session.metadata?.koja_code,
    name: session.customer_details?.name,
    date: new Date(session.created * 1000),
  });
}

export type LicenseOrder = {
  /**
   * One key per order reference: the Stripe checkout session id, or "ds24:<order id>" for Digistore24. Stored in
   * stripe_session_id, whose unique index keeps a repeated call from creating a second key.
   */
  ref: string;
  email: string | null;
  note: string;
  subscription: boolean;
  /** For the licence e-mail: what the buyer paid (null if unknown), the discount code and the buyer's name. */
  paidCents: number | null;
  code?: string;
  name?: string | null;
  date: Date;
};

/** The license of `order`: created on first call, the same one on every later call. Emails it once when Resend is configured. */
export async function issueLicense(order: LicenseOrder): Promise<IssuedLicense> {
  const secret = process.env.LICENSE_SIGNING_PRIVATE_KEY;
  if (!secret) throw new Error('LICENSE_SIGNING_PRIVATE_KEY is not set');
  const db = admin();

  const existing = await db.from('koja_licenses').select('key_encrypted, email, emailed_at').eq('stripe_session_id', order.ref).maybeSingle();
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
        email: order.email,
        note: order.note,
        max_devices: LICENSE_DEVICES,
        stripe_session_id: order.ref,
      })
      .select('key_encrypted, email, emailed_at')
      .single();
    if (inserted.error?.code === '23505') {
      // Two calls for the same order raced (e.g. Stripe webhook and success page): the other one created it.
      const again = await db.from('koja_licenses').select('key_encrypted, email, emailed_at').eq('stripe_session_id', order.ref).single();
      if (again.error) throw again.error;
      row = again.data;
    } else if (inserted.error) {
      throw inserted.error;
    } else {
      row = inserted.data;
    }
  }

  const issued = { key: decryptKey(row.key_encrypted, secret), email: row.email, subscription: order.subscription };
  if (!row.emailed_at && issued.email && process.env.RESEND_API_KEY) {
    // Claim the email first so a parallel call doesn't send it twice.
    const claimed = await db
      .from('koja_licenses')
      .update({ emailed_at: new Date().toISOString() })
      .eq('stripe_session_id', order.ref)
      .is('emailed_at', null)
      .select('id');
    if (claimed.data?.length) {
      try {
        const { html, text } = licenseEmail({
          key: issued.key,
          subscription: issued.subscription,
          paidCents: order.paidCents,
          code: order.code,
          name: order.name,
          email: issued.email,
          date: order.date,
          devices: LICENSE_DEVICES,
        });
        await sendEmail(issued.email, 'Dein Kojalytics-Lizenzschlüssel', text, { html });
      } catch (e) {
        console.error('License email failed', e);
        await db.from('koja_licenses').update({ emailed_at: null }).eq('stripe_session_id', order.ref);
      }
    }
  }
  return issued;
}

/**
 * `scheduledAt` (ISO timestamp): Resend holds the e-mail and sends it then instead of now.
 * `html`: sent alongside `text`; mail apps show the HTML and fall back to the text.
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  { scheduledAt, html }: { scheduledAt?: string; html?: string } = {},
) {
  const from = process.env.LICENSE_EMAIL_FROM || 'Kojalytics <license@kojalytics.com>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, ...(html && { html }), ...(scheduledAt && { scheduled_at: scheduledAt }) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
