import { NextRequest, NextResponse } from 'next/server';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { sendEmail } from '@/lib/license-sales';
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, PLANS, TRIAL_DAYS } from '@/lib/pricing';
import { SITE_URL } from '@/lib/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY = 86_400_000;
const SUPPORT = 'support@kojalytics.com';

// Best effort against misuse (per server instance): at most 5 requests per IP address and hour, 3 per address and day.
const tooManyFromIp = limiter(5);
const tooManyForAddress = limiter(3, DAY);

const links = [
  'Mac:',
  `${SITE_URL}${DOWNLOAD_PATH}`,
  '',
  'Windows:',
  `${SITE_URL}${DOWNLOAD_PATH_WINDOWS}`,
  '',
  `Alle Apps im Überblick: ${SITE_URL}/software`,
  '',
  `${TRIAL_DAYS} Tage kostenlos testen, ohne Zahlungsdaten. Danach ${PLANS.monthly.label} im Monat, jederzeit online kündbar, oder einmalig ${PLANS.lifetime.label}.`,
  '',
  `Windows warnt beim Installieren? So geht es weiter: ${SITE_URL}/support/windows-installation`,
];

const footer = [`Impressum: ${SITE_URL}/impressum`, `Kojalytics · ${SITE_URL}`];

// Phones and tablets cannot install the apps: the visitor sends the download links to their own address and opens
// them at the computer. Optionally one reminder 24 hours later, scheduled at Resend. Nothing is stored here.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const remind = body?.remind === true;
  if (email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 });
  }
  // A bot gets the answer of a real request, but no e-mail goes to the stranger it entered.
  const bot = botReason(body);
  if (bot) {
    console.warn(`Send link: ignored a bot entry (${bot})`);
    return NextResponse.json({ ok: true });
  }
  const ip = clientIp(request.headers);
  if (ip && tooManyFromIp(ip)) {
    return NextResponse.json({ error: 'Von deinem Anschluss kamen gerade zu viele Anfragen. Bitte versuche es in einer Stunde erneut.' }, { status: 429 });
  }
  if (tooManyForAddress(email.toLowerCase())) {
    return NextResponse.json({ error: 'An diese Adresse haben wir heute schon mehrmals den Link geschickt. Schau bitte in dein Postfach, auch in den Spam-Ordner.' }, { status: 429 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Der Versand ist gerade nicht möglich. Bitte versuche es später erneut.' }, { status: 503 });
  }

  const first = [
    'Hallo,',
    '',
    'hier ist dein Link zu den Koja-Apps. Öffne diese E-Mail an deinem Computer und lade den Kojalytics Launcher:',
    '',
    ...links,
    '',
    ...(remind ? [`Morgen schicken wir dir wie gewünscht eine Erinnerung. Willst du sie nicht mehr, schreib an ${SUPPORT}.`, ''] : []),
    'Du hast diese E-Mail auf kojalytics.com angefordert. Wenn du das nicht warst, ignoriere sie einfach.',
    ...footer,
  ].join('\n');
  try {
    await sendEmail(email, 'Dein Link zu den Koja-Apps', first);
  } catch (e) {
    console.error('Send link: email failed', e);
    return NextResponse.json({ error: 'Das hat nicht geklappt. Bitte versuche es erneut.' }, { status: 502 });
  }

  if (remind) {
    const reminder = [
      'Hallo,',
      '',
      'hier ist noch einmal dein Link zu den Koja-Apps. Öffne ihn an deinem Computer:',
      '',
      ...links,
      '',
      'Du hast diese Erinnerung gestern auf kojalytics.com angefordert. Es ist die einzige, danach schreiben wir dir nicht mehr.',
      ...footer,
    ].join('\n');
    try {
      await sendEmail(email, 'Erinnerung: Koja-Apps am Computer laden', reminder, { scheduledAt: new Date(Date.now() + DAY).toISOString() });
    } catch (e) {
      // The link itself went out: the visitor still gets a success answer.
      console.error('Send link: scheduling the reminder failed', e);
    }
  }
  return NextResponse.json({ ok: true });
}
