import { NextRequest, NextResponse } from 'next/server';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { sendEmail } from '@/lib/license-sales';
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, PLANS, TRIAL_DAYS, planText } from '@/lib/pricing';
import { SITE_URL } from '@/lib/site';
import { href, type Lang } from '@/lib/i18n';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY = 86_400_000;
const SUPPORT = 'support@kojalytics.com';

// Best effort against misuse (per server instance): at most 5 requests per IP address and hour, 3 per address and day.
const tooManyFromIp = limiter(5);
const tooManyForAddress = limiter(3, DAY);

const downloads = ['Mac:', `${SITE_URL}${DOWNLOAD_PATH}`, '', 'Windows:', `${SITE_URL}${DOWNLOAD_PATH_WINDOWS}`, ''];

const de = {
  links: [
    ...downloads,
    `Alle Apps im Überblick: ${SITE_URL}/software`,
    '',
    `${TRIAL_DAYS} Tage kostenlos testen, ohne Zahlungsdaten. Danach ${PLANS.monthly.label} im Monat, jederzeit online kündbar, oder einmalig ${PLANS.lifetime.label}.`,
    '',
    `Windows warnt beim Installieren? So geht es weiter: ${SITE_URL}/support/windows-installation`,
  ],
  footer: [`Impressum: ${SITE_URL}/impressum`, `Kojalytics · ${SITE_URL}`],
  invalid: 'Bitte gib eine gültige E-Mail-Adresse ein.',
  tooManyFromIp: 'Von deinem Anschluss kamen gerade zu viele Anfragen. Bitte versuche es in einer Stunde erneut.',
  tooManyForAddress: 'An diese Adresse haben wir heute schon mehrmals den Link geschickt. Schau bitte in dein Postfach, auch in den Spam-Ordner.',
  unavailable: 'Der Versand ist gerade nicht möglich. Bitte versuche es später erneut.',
  failed: 'Das hat nicht geklappt. Bitte versuche es erneut.',
  hello: 'Hallo,',
  first: 'hier ist dein Link zu den Koja-Apps. Öffne diese E-Mail an deinem Computer und lade den Kojalytics Launcher:',
  remindNote: `Morgen schicken wir dir wie gewünscht eine Erinnerung. Willst du sie nicht mehr, schreib an ${SUPPORT}.`,
  requested: 'Du hast diese E-Mail auf kojalytics.com angefordert. Wenn du das nicht warst, ignoriere sie einfach.',
  subject: 'Dein Link zu den Koja-Apps',
  again: 'hier ist noch einmal dein Link zu den Koja-Apps. Öffne ihn an deinem Computer:',
  onlyReminder: 'Du hast diese Erinnerung gestern auf kojalytics.com angefordert. Es ist die einzige, danach schreiben wir dir nicht mehr.',
  reminderSubject: 'Erinnerung: Koja-Apps am Computer laden',
};

const en: typeof de = {
  links: [
    ...downloads,
    `All apps at a glance: ${SITE_URL}${href('en', '/')}`,
    '',
    `Try them free for ${TRIAL_DAYS} days, no payment details needed. After that ${planText('monthly', 'en').label} a month, cancel online at any time, or ${planText('lifetime', 'en').label} one-time.`,
    '',
    `Windows shows a warning when you install? Here's what to do: ${SITE_URL}${href('en', '/support/windows-installation')}`,
  ],
  footer: [`Imprint: ${SITE_URL}${href('en', '/impressum')}`, `Kojalytics · ${SITE_URL}`],
  invalid: 'Please enter a valid email address.',
  tooManyFromIp: 'Too many requests from your connection just now. Please try again in an hour.',
  tooManyForAddress: "We've already sent the link to this address several times today. Please check your inbox, including the spam folder.",
  unavailable: "We can't send emails right now. Please try again later.",
  failed: "That didn't work. Please try again.",
  hello: 'Hello,',
  first: "here's your link to the Koja apps. Open this email on your computer and download the Kojalytics Launcher:",
  remindNote: `As requested, we'll send you a reminder tomorrow. If you don't want it any more, write to ${SUPPORT}.`,
  requested: "You requested this email on kojalytics.com. If that wasn't you, just ignore it.",
  subject: 'Your link to the Koja apps',
  again: "here's your link to the Koja apps once more. Open it on your computer:",
  onlyReminder: "You requested this reminder yesterday on kojalytics.com. It's the only one; we won't email you again after this.",
  reminderSubject: 'Reminder: download the Koja apps on your computer',
};

// Phones and tablets cannot install the apps: the visitor sends the download links to their own address and opens
// them at the computer. Optionally one reminder 24 hours later, scheduled at Resend. Nothing is stored here.
// lang "en" (from the English pages): answers and emails in English.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const t = body?.lang === 'en' ? en : de;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const remind = body?.remind === true;
  if (email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ error: t.invalid }, { status: 400 });
  }
  // A bot gets the answer of a real request, but no email goes to the stranger it entered.
  const bot = botReason(body);
  if (bot) {
    console.warn(`Send link: ignored a bot entry (${bot})`);
    return NextResponse.json({ ok: true });
  }
  const ip = clientIp(request.headers);
  if (ip && tooManyFromIp(ip)) {
    return NextResponse.json({ error: t.tooManyFromIp }, { status: 429 });
  }
  if (tooManyForAddress(email.toLowerCase())) {
    return NextResponse.json({ error: t.tooManyForAddress }, { status: 429 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: t.unavailable }, { status: 503 });
  }

  const first = [
    t.hello,
    '',
    t.first,
    '',
    ...t.links,
    '',
    ...(remind ? [t.remindNote, ''] : []),
    t.requested,
    ...t.footer,
  ].join('\n');
  try {
    await sendEmail(email, t.subject, first);
  } catch (e) {
    console.error('Send link: email failed', e);
    return NextResponse.json({ error: t.failed }, { status: 502 });
  }

  if (remind) {
    const reminder = [t.hello, '', t.again, '', ...t.links, '', t.onlyReminder, ...t.footer].join('\n');
    try {
      await sendEmail(email, t.reminderSubject, reminder, { scheduledAt: new Date(Date.now() + DAY).toISOString() });
    } catch (e) {
      // The link itself went out: the visitor still gets a success answer.
      console.error('Send link: scheduling the reminder failed', e);
    }
  }
  return NextResponse.json({ ok: true });
}
