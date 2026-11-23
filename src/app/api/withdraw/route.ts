import { NextRequest, NextResponse } from 'next/server';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { licenseKeysFor, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = 'support@kojalytics.com';
const CONTRACTS: Record<string, string> = { monthly: 'Koja-Apps · Monatlich', lifetime: 'Koja-Apps · Dauerhaft', unknown: 'Koja-Apps (Vertrag nicht angegeben)' };
const CONTRACTS_EN: Record<string, string> = { monthly: 'Koja apps · Monthly', lifetime: 'Koja apps · One-time purchase', unknown: 'Koja apps (contract not specified)' };

// What the customer reads: German, or English when the form sends lang "en" (/en/withdrawal). Support always gets German.
const de = {
  missing: 'Bitte gib deinen Namen und die E-Mail-Adresse deines Kaufs ein.',
  tooManyIp: 'Von deinem Anschluss kamen gerade zu viele Widerrufe. Bitte versuche es in einer Stunde erneut oder schreib an support@kojalytics.com.',
  tooManyAddress: 'Dein Widerruf ist bereits bei uns eingegangen. Bei Fragen schreib an support@kojalytics.com.',
  unavailable: 'Der Widerruf ist gerade nicht verfügbar. Bitte schreib an support@kojalytics.com.',
  failed: 'Das hat nicht geklappt. Bitte versuche es erneut oder schreib an support@kojalytics.com.',
  locale: 'de-DE',
  subject: 'Eingangsbestätigung deines Widerrufs',
  receipt: (name: string, when: string, contract: string) => [
    `Hallo ${name},`,
    '',
    `wir haben deinen Widerruf am ${when} Uhr erhalten.`,
    `Vertrag: ${contract}`,
    '',
    'Wir prüfen ihn und melden uns innerhalb von drei Werktagen bei dir. Steht dir das Widerrufsrecht zu, erstatten wir dir alle Zahlungen spätestens 14 Tage nach Eingang des Widerrufs, mit demselben Zahlungsmittel, mit dem du bezahlt hast.',
    '',
    'Bitte bewahre diese E-Mail auf.',
    'Kojalytics · https://www.kojalytics.com',
  ],
};
const en: typeof de = {
  missing: 'Please enter your name and the email address you used for your purchase.',
  tooManyIp: 'Too many withdrawals have just come from your connection. Please try again in an hour or write to support@kojalytics.com.',
  tooManyAddress: 'We have already received your withdrawal. If you have any questions, write to support@kojalytics.com.',
  unavailable: 'Withdrawal is not available right now. Please write to support@kojalytics.com.',
  failed: "That didn't work. Please try again or write to support@kojalytics.com.",
  locale: 'en-GB',
  subject: 'Acknowledgement of receipt of your withdrawal',
  receipt: (name, when, contract) => [
    `Hello ${name},`,
    '',
    `We received your withdrawal on ${when} (Berlin time).`,
    `Contract: ${contract}`,
    '',
    'We will review it and get back to you within three working days. If you are entitled to withdraw, we will refund all payments to you no later than 14 days after we received your withdrawal, using the same means of payment you paid with.',
    '',
    'Please keep this email.',
    'Kojalytics · https://www.kojalytics.com/en',
  ],
};

// Best effort against misuse (per server instance): at most 3 declarations per address and 5 per IP address and hour.
const tooManyForAddress = limiter(3);
const tooManyFromIp = limiter(5);

// Widerrufsfunktion (§ 356a BGB): records the withdrawal, confirms receipt to the address entered and sends a
// copy to support, who checks it (e.g. whether the right already expired under § 356 (5) BGB) and refunds.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const english = body?.lang === 'en';
  const t = english ? en : de;
  const raw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = raw.toLowerCase();
  // Only name characters: the name is repeated in an email to the address entered.
  const name = typeof body?.name === 'string' ? body.name.replace(/[^\p{L}\p{M} '-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  const contract = CONTRACTS[body?.contract] ?? CONTRACTS.unknown;
  const reference = typeof body?.reference === 'string' ? body.reference.trim().slice(0, 120) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: t.missing }, { status: 400 });
  }
  // A bot gets the answer of a real withdrawal, but no email goes to support or to the stranger it entered.
  const bot = botReason(body);
  if (bot) {
    console.warn(`Withdraw: ignored a bot entry (${bot})`);
    return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), emailSent: true });
  }
  const ip = clientIp(request.headers);
  if (ip && tooManyFromIp(ip)) {
    return NextResponse.json({ error: t.tooManyIp }, { status: 429 });
  }
  if (tooManyForAddress(email)) {
    return NextResponse.json({ error: t.tooManyAddress }, { status: 429 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: t.unavailable }, { status: 503 });
  }

  const receivedAt = new Date();
  const when = receivedAt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'long', timeStyle: 'short' });
  // The keys of this customer, looked up for you: after the refund, deactivate them in Koja Keys (search the last group).
  const keys = await licenseKeysFor(raw);
  try {
    await sendEmail(
      SUPPORT,
      `Widerruf eingegangen: ${email}`,
      [
        `Eingang: ${when}`,
        `Name: ${name}`,
        `E-Mail: ${raw}`,
        `Vertrag: ${contract}`,
        `Vom Kunden angegeben: ${reference || '–'}`,
        // Only for the English form: so support answers in English.
        ...(english ? ['Sprache: Englisch (über /en/withdrawal)'] : []),
        '',
        'Lizenzschlüssel zu dieser E-Mail-Adresse (nach der Erstattung in Koja Keys deaktivieren, nach der Endung suchen):',
        ...(keys.length ? keys.map((k) => `- ${k}`) : ['- keiner gefunden']),
      ].join('\n')
    );
  } catch (e) {
    console.error('Withdraw: support copy failed', e);
    return NextResponse.json({ error: t.failed }, { status: 500 });
  }
  let emailSent = false;
  try {
    const customerWhen = english
      ? receivedAt.toLocaleString(t.locale, { timeZone: 'Europe/Berlin', dateStyle: 'long', timeStyle: 'short' })
      : when;
    const customerContract = english ? (CONTRACTS_EN[body?.contract] ?? CONTRACTS_EN.unknown) : contract;
    await sendEmail(raw, t.subject, t.receipt(name, customerWhen, customerContract).join('\n'));
    emailSent = true;
  } catch (e) {
    console.error('Withdraw: receipt email failed', e);
  }
  return NextResponse.json({ ok: true, receivedAt: receivedAt.toISOString(), emailSent });
}
