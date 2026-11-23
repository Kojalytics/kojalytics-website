import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { LICENSE_PRODUCT, licenseKeysFor, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = 'support@kojalytics.com';
// Subscriptions that bill now or can bill again.
const LIVE = new Set(['active', 'trialing', 'past_due', 'unpaid']);

// What the customer reads: German, or English when the form sends lang "en" (/en/cancel). Support always gets German.
const de = {
  missing: 'Bitte gib deinen Namen und die E-Mail-Adresse deines Abos ein.',
  tooManyIp: 'Von deinem Anschluss kamen gerade zu viele Kündigungen. Bitte versuche es in einer Stunde erneut oder schreib an support@kojalytics.com.',
  tooManyAddress: 'Deine Kündigung ist bereits bei uns eingegangen. Bei Fragen schreib an support@kojalytics.com.',
  unavailable: 'Die Kündigung ist gerade nicht verfügbar. Bitte schreib an support@kojalytics.com.',
  failed: 'Das hat nicht geklappt. Bitte versuche es erneut oder schreib an support@kojalytics.com.',
  locale: 'de-DE',
  ordinary: 'ordentlich, zum nächstmöglichen Zeitpunkt',
  extraordinary: 'außerordentlich (aus wichtigem Grund)',
  subject: 'Eingangsbestätigung deiner Kündigung',
  greeting: (name: string) => `Hallo ${name},`,
  received: (when: string) => `wir haben deine Kündigung am ${when} Uhr erhalten.`,
  kind: (kind: string) => `Art der Kündigung: ${kind}`,
  ends: (dates: string) => `Dein Koja-Apps-Abo endet am ${dates}. Danach buchen wir nichts mehr ab. Bis dahin kannst du die Apps weiter nutzen.`,
  noneFound:
    'Zu dieser E-Mail-Adresse haben wir kein laufendes Koja-Apps-Abo gefunden. Falls du mit einer anderen Adresse bezahlt hast, antworte bitte auf diese E-Mail. Wir ordnen deine Kündigung dann zu.',
  extraordinaryNote: 'Deine außerordentliche Kündigung prüfen wir und melden uns, falls das Abo früher enden soll.',
  keep: 'Bitte bewahre diese E-Mail auf.',
  signature: 'Kojalytics · https://www.kojalytics.com',
};
const en: typeof de = {
  missing: 'Please enter your name and the email address of your subscription.',
  tooManyIp: 'Too many cancellations have just come from your connection. Please try again in an hour or write to support@kojalytics.com.',
  tooManyAddress: 'We have already received your cancellation. If you have any questions, write to support@kojalytics.com.',
  unavailable: 'Cancellation is not available right now. Please write to support@kojalytics.com.',
  failed: "That didn't work. Please try again or write to support@kojalytics.com.",
  locale: 'en-GB',
  ordinary: 'ordinary, at the earliest possible date',
  extraordinary: 'extraordinary (for good cause)',
  subject: 'Acknowledgement of receipt of your cancellation',
  greeting: (name) => `Hello ${name},`,
  received: (when) => `We received your cancellation on ${when} (Berlin time).`,
  kind: (kind) => `Type of cancellation: ${kind}`,
  ends: (dates) => `Your Koja apps subscription ends on ${dates}. After that, we will not charge you again. You can keep using the apps until then.`,
  noneFound:
    'We could not find an active Koja apps subscription for this email address. If you paid with a different address, please reply to this email and we will match your cancellation to it.',
  extraordinaryNote: 'We will review your extraordinary cancellation and let you know if the subscription is to end earlier.',
  keep: 'Please keep this email.',
  signature: 'Kojalytics · https://www.kojalytics.com/en',
};

// Best effort against misuse (per server instance): at most 3 declarations per address and 5 per IP address and hour.
const tooManyForAddress = limiter(3);
const tooManyFromIp = limiter(5);

const day = (seconds: number, locale = 'de-DE') =>
  new Date(seconds * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' });

// Kündigungsbutton (§ 312k BGB): ends every Koja subscription of this email address at the end of the paid
// period, confirms receipt to the address entered and sends a copy to support. The response is the same
// whether or not a subscription exists, so the form cannot be used to find out who is a customer.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const english = body?.lang === 'en';
  const t = english ? en : de;
  const raw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = raw.toLowerCase();
  // Only name characters: the name is repeated in an email to the address entered.
  const name = typeof body?.name === 'string' ? body.name.replace(/[^\p{L}\p{M} '-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  const extraordinary = body?.type === 'extraordinary';
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : '';
  const reference = typeof body?.reference === 'string' ? body.reference.trim().slice(0, 120) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: t.missing }, { status: 400 });
  }
  // A bot gets the answer of a real cancellation, but nothing is cancelled and no email goes to the stranger it entered.
  const bot = botReason(body);
  if (bot) {
    console.warn(`Cancel: ignored a bot entry (${bot})`);
    return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), emailSent: true });
  }
  const ip = clientIp(request.headers);
  if (ip && tooManyFromIp(ip)) {
    return NextResponse.json({ error: t.tooManyIp }, { status: 429 });
  }
  if (tooManyForAddress(email)) {
    return NextResponse.json({ error: t.tooManyAddress }, { status: 429 });
  }
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: t.unavailable }, { status: 503 });
  }

  const receivedAt = new Date();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Stripe compares email addresses case-sensitively: look up the address as typed and in lower case.
    const lists = await Promise.all([...new Set([raw, email])].map((e) => stripe.customers.list({ email: e, limit: 10 })));
    const customerIds = [...new Set(lists.flatMap((l) => l.data.map((c) => c.id)))];
    const ends: number[] = [];
    const cancelledSubs: string[] = [];
    for (const customer of customerIds) {
      const subs = await stripe.subscriptions.list({ customer, status: 'all', limit: 50 });
      for (const sub of subs.data) {
        if (sub.metadata?.product !== LICENSE_PRODUCT || !LIVE.has(sub.status)) continue;
        const current = sub.cancel_at_period_end
          ? sub
          : await stripe.subscriptions.update(sub.id, {
              cancel_at_period_end: true,
              metadata: { ...sub.metadata, cancelled_via: 'website', cancel_type: extraordinary ? 'extraordinary' : 'ordinary', cancel_reason: reason.slice(0, 450) },
            });
        ends.push(current.cancel_at ?? current.items.data[0]?.current_period_end ?? 0);
        cancelledSubs.push(sub.id);
      }
    }

    const when = receivedAt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'long', timeStyle: 'short' });
    const kind = extraordinary ? 'außerordentlich (aus wichtigem Grund)' : 'ordentlich, zum nächstmöglichen Zeitpunkt';
    const endDates = [...new Set(ends.filter(Boolean).map((s) => day(s)))].join(', ');
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      // The customer's copy in their language; for German these are `when`, `kind` and `endDates` as above.
      const customerWhen = english ? receivedAt.toLocaleString(t.locale, { timeZone: 'Europe/Berlin', dateStyle: 'long', timeStyle: 'short' }) : when;
      const customerKind = extraordinary ? t.extraordinary : t.ordinary;
      const customerEnds = english ? [...new Set(ends.filter(Boolean).map((s) => day(s, t.locale)))].join(', ') : endDates;
      const receipt = [
        t.greeting(name),
        '',
        t.received(customerWhen),
        t.kind(customerKind),
        '',
        ends.length ? t.ends(customerEnds) : t.noneFound,
        ...(extraordinary && ends.length ? [t.extraordinaryNote] : []),
        '',
        t.keep,
        t.signature,
      ].join('\n');
      try {
        await sendEmail(raw, t.subject, receipt);
        emailSent = true;
      } catch (e) {
        console.error('Cancel: receipt email failed', e);
      }
      // The keys of this customer, looked up for you: the subscription's key is deactivated automatically when the
      // subscription ends (Stripe webhook); others you can find in Koja Keys by their last group.
      const keys = await licenseKeysFor(raw, stripe, cancelledSubs);
      try {
        await sendEmail(
          SUPPORT,
          `Kündigung eingegangen: ${email}`,
          [
            `Eingang: ${when}`,
            `Name: ${name}`,
            `E-Mail: ${raw}`,
            `Art: ${kind}`,
            `Grund: ${reason || '–'}`,
            `Vom Kunden angegeben: ${reference || '–'}`,
            `Gefundene Abos: ${ends.length}${endDates ? ` (Ende ${endDates})` : ''}`,
            // Only for the English form: so support answers in English.
            ...(english ? ['Sprache: Englisch (über /en/cancel)'] : []),
            '',
            'Lizenzschlüssel zu dieser E-Mail-Adresse (in Koja Keys nach der Endung suchen):',
            ...(keys.length ? keys.map((k) => `- ${k}`) : ['- keiner gefunden']),
            ends.length ? 'Der Schlüssel des Abos wird zum Abo-Ende automatisch deaktiviert.' : '',
            '',
            `Bestätigung gesendet: ${emailSent ? 'ja' : 'nein'}`,
          ].join('\n')
        );
      } catch (e) {
        console.error('Cancel: support copy failed', e);
      }
    }
    return NextResponse.json({ ok: true, receivedAt: receivedAt.toISOString(), emailSent });
  } catch (err) {
    console.error('Cancel error:', err);
    return NextResponse.json({ error: t.failed }, { status: 500 });
  }
}
