import { NextRequest, NextResponse } from 'next/server';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { licenseKeysFor, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = 'support@kojalytics.com';
const CONTRACTS: Record<string, string> = { monthly: 'Koja-Apps · Monatlich', lifetime: 'Koja-Apps · Dauerhaft', unknown: 'Koja-Apps (Vertrag nicht angegeben)' };

// Best effort against misuse (per server instance): at most 3 declarations per address and 5 per IP address and hour.
const tooManyForAddress = limiter(3);
const tooManyFromIp = limiter(5);

// Widerrufsfunktion (§ 356a BGB): records the withdrawal, confirms receipt to the address entered and sends a
// copy to support, who checks it (e.g. whether the right already expired under § 356 (5) BGB) and refunds.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const raw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = raw.toLowerCase();
  // Only name characters: the name is repeated in an e-mail to the address entered.
  const name = typeof body?.name === 'string' ? body.name.replace(/[^\p{L}\p{M} '-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  const contract = CONTRACTS[body?.contract] ?? CONTRACTS.unknown;
  const reference = typeof body?.reference === 'string' ? body.reference.trim().slice(0, 120) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: 'Bitte gib deinen Namen und die E-Mail-Adresse deines Kaufs ein.' }, { status: 400 });
  }
  // A bot gets the answer of a real withdrawal, but no e-mail goes to support or to the stranger it entered.
  const bot = botReason(body);
  if (bot) {
    console.warn(`Withdraw: ignored a bot entry (${bot})`);
    return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), emailSent: true });
  }
  const ip = clientIp(request.headers);
  if (ip && tooManyFromIp(ip)) {
    return NextResponse.json({ error: 'Von deinem Anschluss kamen gerade zu viele Widerrufe. Bitte versuche es in einer Stunde erneut oder schreib an support@kojalytics.com.' }, { status: 429 });
  }
  if (tooManyForAddress(email)) {
    return NextResponse.json({ error: 'Dein Widerruf ist bereits bei uns eingegangen. Bei Fragen schreib an support@kojalytics.com.' }, { status: 429 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Der Widerruf ist gerade nicht verfügbar. Bitte schreib an support@kojalytics.com.' }, { status: 503 });
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
        '',
        'Lizenzschlüssel zu dieser E-Mail-Adresse (nach der Erstattung in Koja Keys deaktivieren, nach der Endung suchen):',
        ...(keys.length ? keys.map((k) => `- ${k}`) : ['- keiner gefunden']),
      ].join('\n')
    );
  } catch (e) {
    console.error('Withdraw: support copy failed', e);
    return NextResponse.json({ error: 'Das hat nicht geklappt. Bitte versuche es erneut oder schreib an support@kojalytics.com.' }, { status: 500 });
  }
  let emailSent = false;
  try {
    await sendEmail(
      raw,
      'Eingangsbestätigung deines Widerrufs',
      [
        `Hallo ${name},`,
        '',
        `wir haben deinen Widerruf am ${when} Uhr erhalten.`,
        `Vertrag: ${contract}`,
        '',
        'Wir prüfen ihn und melden uns innerhalb von drei Werktagen bei dir. Steht dir das Widerrufsrecht zu, erstatten wir dir alle Zahlungen spätestens 14 Tage nach Eingang des Widerrufs, mit demselben Zahlungsmittel, mit dem du bezahlt hast.',
        '',
        'Bitte bewahre diese E-Mail auf.',
        'Kojalytics · https://www.kojalytics.com',
      ].join('\n')
    );
    emailSent = true;
  } catch (e) {
    console.error('Withdraw: receipt email failed', e);
  }
  return NextResponse.json({ ok: true, receivedAt: receivedAt.toISOString(), emailSent });
}
