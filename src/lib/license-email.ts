import { APPS, type AppGroup } from '@/lib/apps';
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, PLANS, planText } from '@/lib/pricing';
import { href, type Lang } from '@/lib/i18n';

/**
 * The license email a buyer gets after checkout: an HTML version in the look of the site and the same content as
 * plain text. No images, web fonts or tracking pixels, so it shows complete at once, even with images blocked.
 * Table layout with inline styles, because Outlook and Gmail ignore most other CSS.
 * In German, or in English for orders from the English pages (`lang: 'en'`).
 */

const SITE = 'https://www.kojalytics.com';

const INK = '#0e0e10';
const MUTED = '#5a5a60';
const FAINT = '#6a6a70';
const LINE = '#e3e3e1';
const LINE_STRONG = '#c9c9c6';
const SURFACE = '#f6f6f5';
const GREEN = '#15803d';
const ON_INK = '#a1a1a8';

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Courier New',monospace";

const HUD = `font-family:${MONO};font-size:11px;line-height:1.4;letter-spacing:1.4px;text-transform:uppercase;color:${FAINT};`;
const TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';

export type LicenseEmailData = {
  key: string;
  subscription: boolean;
  /** What the buyer actually paid (for the subscription: the first period), null if unknown. */
  paidCents: number | null;
  code?: string;
  /** Name from the checkout, for the greeting. */
  name?: string | null;
  email: string;
  date: Date;
  devices: number;
  /** The language of the email; German without it. */
  lang?: Lang;
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const euro = (cents: number, lang: Lang = 'de') =>
  lang === 'de'
    ? (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
    : '€' + (cents / 100).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d: Date, lang: Lang = 'de') =>
  lang === 'de'
    ? d.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' })
    : d.toLocaleDateString('en-GB', { timeZone: 'Europe/Berlin', day: 'numeric', month: 'long', year: 'numeric' });

/** "FARZAD KHOJAZADA" (as typed on a card) → "Farzad". */
function firstName(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0];
  if (!first) return null;
  return first === first.toUpperCase() ? first[0] + first.slice(1).toLowerCase() : first;
}

const link = (href: string, label: string) => `<a href="${href}" style="color:${INK};text-decoration:underline;">${label}</a>`;

function button(href: string, label: string) {
  return `<table ${TABLE} width="100%"><tr><td align="center" bgcolor="${INK}" style="background-color:${INK};">
<a href="${href}" style="display:block;padding:14px 12px;font-family:${SANS};font-size:15px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;">${label}</a>
</td></tr></table>`;
}

function step(n: number, title: string, body: string, extra = '') {
  return `<tr><td class="px" style="padding:26px 32px 0 32px;">
<table ${TABLE} width="100%"><tr>
<td valign="top" width="46" style="width:46px;">
<table ${TABLE}><tr><td width="32" height="32" align="center" valign="middle" bgcolor="${INK}" style="width:32px;height:32px;background-color:${INK};font-family:${MONO};font-size:13px;font-weight:700;color:#ffffff;">${String(n).padStart(2, '0')}</td></tr></table>
</td>
<td valign="top" style="padding-top:5px;">
<p style="margin:0;font-size:17px;line-height:1.3;font-weight:700;color:${INK};">${title}</p>
<p style="margin:6px 0 0 0;font-size:15px;line-height:1.6;color:${MUTED};">${body}</p>
${extra}
</td>
</tr></table>
</td></tr>`;
}

function row(label: string, value: string, strong = false) {
  return `<tr>
<td valign="top" style="padding:11px 12px 11px 0;border-bottom:1px solid ${LINE};font-size:14px;line-height:1.5;color:${MUTED};">${label}</td>
<td valign="top" align="right" style="padding:11px 0;border-bottom:1px solid ${LINE};font-size:14px;line-height:1.5;color:${INK};${strong ? 'font-weight:700;' : ''}">${value}</td>
</tr>`;
}

const B = (s: string) => `<b style="color:${INK};">${s}</b>`;

/** The email's subject line. */
export const licenseEmailSubject = (lang: Lang = 'de') => (lang === 'de' ? 'Dein Kojalytics-Lizenzschlüssel' : 'Your Kojalytics license key');

const de = {
  preheader: 'Dein Lizenzschlüssel und die Einrichtung in vier Schritten.',
  purchasedOn: 'Kauf vom',
  paid: 'Zahlung erfolgreich',
  thanks: (name: string | null) => (name ? `Danke, ${name}!` : 'Danke für deinen Kauf!'),
  readyHtml: 'Deine 13&nbsp;Koja&#8209;Apps sind bereit.',
  readyText: 'Deine 13 Koja-Apps sind bereit.',
  intro: 'Hier ist dein Lizenzschlüssel. In vier Schritten bist du startklar, am Mac genauso wie unter Windows.',
  keyLabel: 'Dein Lizenzschlüssel',
  keyNote: (n: number) => `Gilt für bis zu ${n} Geräte (Mac oder Windows-PC). Bitte gut aufbewahren.`,
  setupHud: 'Einrichtung &middot; 4 Schritte',
  setupTitle: 'So startest du',
  step1: ['Kojalytics Launcher laden', 'Über den Launcher installierst und aktualisierst du alle Koja-Apps.'],
  forMac: 'Für Mac laden',
  forWindows: 'Für Windows laden',
  step2: [
    'Installieren',
    `${B('Mac:')} Öffne die Datei und ziehe den Launcher in den Ordner „Programme“.<br>${B('Windows:')} Öffne die Datei und folge dem Installations-Assistenten.`,
  ],
  windowsHelp: (guide: string) =>
    `${B('Windows fragt nach?')} Das ist bei neuen Programmen normal. Bei „Der Computer wurde durch Windows geschützt“ klickst du auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“. ${link(guide, 'Anleitung mit allen Schritten')}`,
  step3: ['Schlüssel aktivieren', `Starte den Launcher, öffne ${B('Einstellungen › Lizenz')}, füge deinen Schlüssel ein und klicke auf ${B('„Aktivieren“')}.`],
  sketchPath: 'Einstellungen &rsaquo; Lizenz',
  sketchField: 'Lizenzschlüssel',
  sketchButton: 'Aktivieren',
  step4: ['Apps installieren', 'Wähle im Launcher die Koja-Apps, die du brauchst, und installiere sie. Updates bekommst du ebenfalls über den Launcher.'],
  planHud: (sub: boolean): string => (sub ? 'Dein Abo' : 'Deine Lizenz'),
  includedTitle: 'Das steckt drin',
  group: (group: AppGroup) => group as string,
  perks: (sub: boolean, n: number) =>
    sub
      ? ['Alle 13 Koja-Apps', 'Alle Updates inklusive', `Auf bis zu ${n} Geräten (Mac oder Windows-PC)`, 'Jederzeit online kündbar']
      : ['Alle 13 Koja-Apps, ohne Ablaufdatum', 'Updates über den Kojalytics Launcher', `Auf bis zu ${n} Geräten (Mac oder Windows-PC)`, 'Einmal bezahlt, keine Verlängerung'],
  orderHud: 'Deine Bestellung',
  product: 'Produkt',
  productName: (sub: boolean) => `Koja-Apps &middot; ${sub ? 'Monatlich' : 'Einmalkauf'}`,
  productNote: (sub: boolean) => `Alle 13 Koja-Apps für Mac und Windows${sub ? ', monatlich kündbar' : ', einmal bezahlt, kein Abo'}`,
  price: 'Preis',
  priceValue: (sub: boolean, price: string) => (sub ? `${price} pro Monat` : `${price} einmalig`),
  code: 'Rabattcode',
  paidRow: (firstMonth: boolean): string => (firstMonth ? 'Bezahlt (erster Monat)' : 'Bezahlt'),
  date: 'Kaufdatum',
  email: 'E-Mail',
  priceNote: (sub: boolean, monthly: string) =>
    `Alle Preise inkl. MwSt.${sub ? ` Danach ${monthly} pro Monat.` : ''} Die Koja-Apps werden laufend weiterentwickelt. Updates und neue Funktionen bekommst du automatisch und kostenlos.`,
  questions: `${B('Fragen?')} Antworte einfach auf diese E-Mail oder schreib an ${link('mailto:support@kojalytics.com', 'support@kojalytics.com')}. Wir helfen dir persönlich weiter.`,
  legal: (sub: boolean) =>
    `Es gelten unsere ${link(`${SITE}/agb`, 'AGB mit Widerrufsbelehrung')}. ${link(`${SITE}/widerrufen`, 'Widerruf erklären')}${sub ? ` &middot; ${link(`${SITE}/kuendigen`, 'Abo kündigen')}` : ''}. Bitte bewahre diese E-Mail gut auf.`,
  address: 'Kojalytics &middot; Farzad Khojazada &middot; Am Diggen 40i &middot; 21077 Hamburg',
  text: {
    key: (key: string) => `Dein Kojalytics-Lizenzschlüssel: ${key}`,
    start: 'So startest du:',
    step1: '1. Lade den Kojalytics Launcher:',
    step2: '2. Mac: Öffne die Datei und ziehe den Launcher in den Ordner „Programme“. Windows: Öffne die Datei und folge dem Installations-Assistenten.',
    windows: (guide: string) => `   Windows fragt nach? Klicke auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“. Anleitung: ${guide}`,
    step3: '3. Starte den Launcher, öffne Einstellungen › Lizenz, füge den Schlüssel ein und klicke auf „Aktivieren“.',
    step4: '4. Installiere deine Koja-Apps direkt im Launcher.',
    order: 'Deine Bestellung',
    plan: (sub: boolean, label: string) =>
      sub
        ? `Koja-Apps · Monatlich: alle 13 Koja-Apps für Mac und Windows, ${label} pro Monat inkl. MwSt., monatlich kündbar.`
        : `Koja-Apps · Dauerhaft: alle 13 Koja-Apps für Mac und Windows, einmalig ${label} inkl. MwSt., ohne Ablaufdatum.`,
    discounted: (code: string | undefined, paid: string, sub: boolean) =>
      ` Mit Rabattcode${code ? ` ${code}` : ''} bezahlt: ${paid}${sub ? ' für den ersten Abrechnungszeitraum' : ''}.`,
    date: (date: string) => `Kaufdatum: ${date}`,
    updates: 'Die Koja-Apps werden laufend weiterentwickelt. Updates und neue Funktionen bekommst du automatisch und kostenlos.',
    terms: `Es gelten unsere AGB mit Widerrufsbelehrung: ${SITE}/agb`,
    withdraw: `Widerruf erklären: ${SITE}/widerrufen`,
    cancel: `Abo kündigen: ${SITE}/kuendigen`,
    provider: 'Anbieter: Kojalytics, Farzad Khojazada, Am Diggen 40i, 21077 Hamburg, support@kojalytics.com',
    keep: 'Bitte bewahre diese E-Mail gut auf.',
    questions: 'Fragen? Antworte einfach auf diese E-Mail.',
  },
};

const EN_GROUPS: Record<AppGroup, string> = { 'Foto & Design': 'Photo & Design', 'Video & Audio': 'Video & Audio', 'Büro & Technik': 'Office & Engineering' };

const en: typeof de = {
  preheader: 'Your license key and setup in four steps.',
  purchasedOn: 'Purchased on',
  paid: 'Payment successful',
  thanks: (name: string | null) => (name ? `Thank you, ${name}!` : 'Thank you for your purchase!'),
  readyHtml: 'Your 13&nbsp;Koja apps are ready.',
  readyText: 'Your 13 Koja apps are ready.',
  intro: "Here's your license key. Four steps and you're ready to go, on a Mac just as on Windows.",
  keyLabel: 'Your license key',
  keyNote: (n: number) => `Valid on up to ${n} devices (Mac or Windows PC). Please keep it safe.`,
  setupHud: 'Setup &middot; 4 steps',
  setupTitle: 'How to get started',
  step1: ['Download the Kojalytics Launcher', 'The launcher installs and updates all Koja apps.'],
  forMac: 'Download for Mac',
  forWindows: 'Download for Windows',
  step2: [
    'Install',
    `${B('Mac:')} Open the file and drag the launcher into the Applications folder.<br>${B('Windows:')} Open the file and follow the setup wizard.`,
  ],
  windowsHelp: (guide: string) =>
    `${B('Windows asks for confirmation?')} That's normal for new programs. If you see “Windows protected your PC”, click “More info” and then “Run anyway”. ${link(guide, 'Step-by-step guide')}`,
  step3: ['Activate your key', `Open the launcher, go to ${B('Settings › License')}, paste your key and click ${B('“Activate”')}.`],
  sketchPath: 'Settings &rsaquo; License',
  sketchField: 'License key',
  sketchButton: 'Activate',
  step4: ['Install the apps', 'In the launcher, choose the Koja apps you need and install them. Updates also come through the launcher.'],
  planHud: (sub: boolean) => (sub ? 'Your subscription' : 'Your license'),
  includedTitle: "What's included",
  group: (group: AppGroup) => EN_GROUPS[group],
  perks: (sub: boolean, n: number) =>
    sub
      ? ['All 13 Koja apps', 'All updates included', `On up to ${n} devices (Mac or Windows PC)`, 'Cancel online at any time']
      : ['All 13 Koja apps, no expiry date', 'Updates through the Kojalytics Launcher', `On up to ${n} devices (Mac or Windows PC)`, 'Paid once, no renewal'],
  orderHud: 'Your order',
  product: 'Product',
  productName: (sub: boolean) => `Koja apps &middot; ${sub ? 'Monthly' : 'One-time purchase'}`,
  productNote: (sub: boolean) => `All 13 Koja apps for Mac and Windows${sub ? ', cancel any month' : ', paid once, no subscription'}`,
  price: 'Price',
  priceValue: (sub: boolean, price: string) => (sub ? `${price} a month` : `${price} one-time`),
  code: 'Discount code',
  paidRow: (firstMonth: boolean) => (firstMonth ? 'Paid (first month)' : 'Paid'),
  date: 'Purchase date',
  email: 'Email',
  priceNote: (sub: boolean, monthly: string) =>
    `All prices incl. VAT.${sub ? ` Then ${monthly} a month.` : ''} The Koja apps are under continuous development. You get updates and new features automatically and free of charge.`,
  questions: `${B('Questions?')} Just reply to this email or write to ${link('mailto:support@kojalytics.com', 'support@kojalytics.com')}. We'll help you personally.`,
  legal: (sub: boolean) =>
    `Our ${link(`${SITE}${href('en', '/agb')}`, 'terms and conditions with the withdrawal policy')} apply. ${link(`${SITE}${href('en', '/widerrufen')}`, 'Withdraw from your purchase')}${sub ? ` &middot; ${link(`${SITE}${href('en', '/kuendigen')}`, 'Cancel your subscription')}` : ''}. Please keep this email.`,
  address: 'Kojalytics &middot; Farzad Khojazada &middot; Am Diggen 40i &middot; 21077 Hamburg &middot; Germany',
  text: {
    key: (key: string) => `Your Kojalytics license key: ${key}`,
    start: 'How to get started:',
    step1: '1. Download the Kojalytics Launcher:',
    step2: '2. Mac: Open the file and drag the launcher into the Applications folder. Windows: Open the file and follow the setup wizard.',
    windows: (guide: string) => `   Windows asks for confirmation? Click “More info” and then “Run anyway”. Guide: ${guide}`,
    step3: '3. Open the launcher, go to Settings › License, paste the key and click “Activate”.',
    step4: '4. Install your Koja apps right in the launcher.',
    order: 'Your order',
    plan: (sub: boolean, label: string) =>
      sub
        ? `Koja apps · Monthly: all 13 Koja apps for Mac and Windows, ${label} a month incl. VAT, cancel any month.`
        : `Koja apps · One-time purchase: all 13 Koja apps for Mac and Windows, ${label} one-time incl. VAT, no expiry date.`,
    discounted: (code: string | undefined, paid: string, sub: boolean) =>
      ` Paid with discount code${code ? ` ${code}` : ''}: ${paid}${sub ? ' for the first billing period' : ''}.`,
    date: (date: string) => `Purchase date: ${date}`,
    updates: 'The Koja apps are under continuous development. You get updates and new features automatically and free of charge.',
    terms: `Our terms and conditions with the withdrawal policy apply: ${SITE}${href('en', '/agb')}`,
    withdraw: `Withdraw from your purchase: ${SITE}${href('en', '/widerrufen')}`,
    cancel: `Cancel your subscription: ${SITE}${href('en', '/kuendigen')}`,
    provider: 'Provider: Kojalytics, Farzad Khojazada, Am Diggen 40i, 21077 Hamburg, Germany, support@kojalytics.com',
    keep: 'Please keep this email.',
    questions: 'Questions? Just reply to this email.',
  },
};

export function licenseEmail(d: LicenseEmailData): { html: string; text: string } {
  const lang = d.lang ?? 'de';
  const t = lang === 'de' ? de : en;
  const guide = `${SITE}${href(lang, '/support/windows-installation')}`;
  const plan = d.subscription ? PLANS.monthly : PLANS.lifetime;
  const planLabel = planText(d.subscription ? 'monthly' : 'lifetime', lang).label;
  const discounted = d.paidCents !== null && d.paidCents !== plan.cents;
  const name = firstName(d.name);
  const key = esc(d.key);
  // The key in the launcher sketch: the start is enough to recognise it.
  const keyStart = esc(d.key.split('-').slice(0, 3).join('-')) + '-…';

  const groups = [...new Set(APPS.map((a) => a.group))].map((group) => ({ group, apps: APPS.filter((a) => a.group === group) }));
  const perks = t.perks(d.subscription, d.devices);

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${licenseEmailSubject(lang)}</title>
<style>
body{margin:0;padding:0;-webkit-text-size-adjust:100%;}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
@media (max-width:540px){
.px{padding-left:20px!important;padding-right:20px!important;}
.h1{font-size:26px!important;}
.key{font-size:15px!important;letter-spacing:0!important;}
.keybox{padding:18px 16px 16px 16px!important;}
.stack{display:block!important;width:100%!important;padding-left:0!important;padding-right:0!important;}
.stack-gap{padding-bottom:10px!important;}
.field{display:block!important;width:auto!important;margin-bottom:10px!important;}
.hide-sm{display:none!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${SURFACE};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${t.preheader}</div>
<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="background-color:${SURFACE};">
<tr><td align="center" style="padding:28px 12px 32px 12px;">

<table ${TABLE} width="600" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${LINE};font-family:${SANS};color:${INK};">

<tr><td class="px" style="padding:20px 32px;border-bottom:1px solid ${LINE};">
<table ${TABLE} width="100%"><tr>
<td valign="middle" width="32" style="width:32px;">
<table ${TABLE}><tr><td width="32" height="32" align="center" valign="middle" bgcolor="${INK}" style="width:32px;height:32px;background-color:${INK};font-family:${SANS};font-size:19px;font-weight:800;color:#ffffff;">K</td></tr></table>
</td>
<td valign="middle" style="padding-left:10px;font-size:19px;font-weight:800;letter-spacing:-0.3px;color:${INK};">Kojalytics</td>
<td valign="middle" align="right" style="${HUD}">${t.purchasedOn}<br><span style="font-family:${SANS};font-size:14px;letter-spacing:0;text-transform:none;font-weight:700;color:${INK};">${day(d.date, lang)}</span></td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:38px 32px 0 32px;">
<p style="margin:0 0 14px 0;${HUD}color:${GREEN};font-weight:700;"><span style="font-family:${SANS};">&#9679;</span>&nbsp; ${t.paid}</p>
<h1 class="h1" style="margin:0;font-size:31px;line-height:1.15;font-weight:800;letter-spacing:-0.6px;color:${INK};">${t.thanks(name ? esc(name) : null)} ${t.readyHtml}</h1>
<p style="margin:14px 0 0 0;font-size:16px;line-height:1.6;color:${MUTED};">${t.intro}</p>
</td></tr>

<tr><td class="px" style="padding:26px 32px 0 32px;">
<table ${TABLE} width="100%" bgcolor="${INK}" style="background-color:${INK};"><tr>
<td width="4" bgcolor="${GREEN}" style="width:4px;background-color:${GREEN};font-size:0;line-height:0;">&nbsp;</td>
<td class="keybox" style="padding:22px 24px 20px 22px;">
<p style="margin:0 0 10px 0;${HUD}color:${ON_INK};">${t.keyLabel}</p>
<p class="key" style="margin:0;font-family:${MONO};font-size:21px;line-height:1.4;font-weight:700;letter-spacing:1px;color:#ffffff;overflow-wrap:break-word;-webkit-user-select:all;user-select:all;">${key}</p>
<p style="margin:12px 0 0 0;font-size:13px;line-height:1.5;color:${ON_INK};">${t.keyNote(d.devices)}</p>
</td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:40px 32px 0 32px;">
<p style="margin:0;${HUD}">${t.setupHud}</p>
<h2 style="margin:6px 0 0 0;font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.3px;color:${INK};">${t.setupTitle}</h2>
</td></tr>

${step(
  1,
  t.step1[0],
  t.step1[1],
  `<table ${TABLE} width="100%" style="margin-top:14px;"><tr>
<td class="stack stack-gap" width="50%" valign="top" style="padding-right:6px;">${button(SITE + DOWNLOAD_PATH, t.forMac)}</td>
<td class="stack" width="50%" valign="top" style="padding-left:6px;">${button(SITE + DOWNLOAD_PATH_WINDOWS, t.forWindows)}</td>
</tr></table>`,
)}

${step(
  2,
  t.step2[0],
  t.step2[1],
  `<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="margin-top:14px;background-color:${SURFACE};"><tr>
<td style="padding:14px 16px;font-size:14px;line-height:1.6;color:${MUTED};">${t.windowsHelp(guide)}</td>
</tr></table>`,
)}

${step(
  3,
  t.step3[0],
  t.step3[1],
  `<table ${TABLE} width="100%" style="margin-top:14px;border:1px solid ${LINE_STRONG};"><tr>
<td bgcolor="${SURFACE}" style="padding:9px 14px;background-color:${SURFACE};border-bottom:1px solid ${LINE};${HUD}">${t.sketchPath}</td>
</tr><tr>
<td style="padding:16px 14px;">
<p style="margin:0 0 6px 0;font-size:12px;line-height:1.4;color:${MUTED};">${t.sketchField}</p>
<table ${TABLE} width="100%"><tr>
<td class="field" style="padding:10px 12px;border:1px solid ${LINE_STRONG};font-family:${MONO};font-size:13px;line-height:1.3;color:${INK};white-space:nowrap;">${keyStart}</td>
<td class="hide-sm" width="10" style="width:10px;"></td>
<td class="stack" width="1" align="center" bgcolor="${GREEN}" style="padding:10px 16px;background-color:${GREEN};font-size:13px;line-height:1.3;font-weight:700;color:#ffffff;white-space:nowrap;">${t.sketchButton}</td>
</tr></table>
</td>
</tr></table>`,
)}

${step(4, t.step4[0], t.step4[1])}

<tr><td class="px" style="padding:44px 32px 0 32px;">
<p style="margin:0;${HUD}">${t.planHud(d.subscription)}</p>
<h2 style="margin:6px 0 14px 0;font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.3px;color:${INK};">${t.includedTitle}</h2>
<table ${TABLE} width="100%" style="border:1px solid ${LINE};">
${groups
  .map(
    ({ group, apps }, i) => `<tr><td style="padding:14px 16px;${i < groups.length - 1 ? `border-bottom:1px solid ${LINE};` : ''}">
<p style="margin:0 0 6px 0;${HUD}">${esc(t.group(group))}</p>
<p style="margin:0;font-size:14px;line-height:1.9;color:${INK};">${apps
      .map((a) => `<span style="white-space:nowrap;"><span style="color:${a.color};">&#9632;</span>&nbsp;${esc(a.name)}</span>`)
      .join(' &nbsp; ')}</p>
</td></tr>`,
  )
  .join('\n')}
</table>
<table ${TABLE} width="100%" style="margin-top:14px;">
${perks.map((p) => `<tr><td valign="top" width="22" style="width:22px;padding:3px 0;font-size:14px;line-height:1.5;font-weight:700;color:${GREEN};">&#10003;</td><td valign="top" style="padding:3px 0;font-size:14px;line-height:1.5;color:${INK};">${p}</td></tr>`).join('\n')}
</table>
</td></tr>

<tr><td class="px" style="padding:44px 32px 0 32px;">
<p style="margin:0 0 10px 0;${HUD}">${t.orderHud}</p>
<table ${TABLE} width="100%" style="border-top:2px solid ${INK};">
${row(t.product, `${t.productName(d.subscription)}<br><span style="font-size:13px;color:${MUTED};">${t.productNote(d.subscription)}</span>`)}
${row(t.price, t.priceValue(d.subscription, euro(plan.cents, lang)))}
${d.code ? row(t.code, `<span style="font-family:${MONO};letter-spacing:0.5px;">${esc(d.code)}</span>`) : ''}
${d.paidCents !== null ? row(t.paidRow(d.subscription && discounted), euro(d.paidCents, lang), true) : ''}
${row(t.date, day(d.date, lang))}
${row(t.email, `<span style="word-break:break-all;">${esc(d.email)}</span>`)}
</table>
<p style="margin:12px 0 0 0;font-size:13px;line-height:1.6;color:${MUTED};">${t.priceNote(d.subscription, planLabel)}</p>
</td></tr>

<tr><td class="px" style="padding:36px 32px 34px 32px;">
<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="background-color:${SURFACE};"><tr>
<td style="padding:18px 20px;font-size:15px;line-height:1.6;color:${MUTED};">${t.questions}</td>
</tr></table>
<p style="margin:20px 0 0 0;font-size:13px;line-height:1.7;color:${MUTED};">${t.legal(d.subscription)}</p>
</td></tr>

</table>

<table ${TABLE} width="600" style="width:100%;max-width:600px;"><tr>
<td align="center" style="padding:20px 12px 0 12px;font-family:${SANS};font-size:12px;line-height:1.7;color:${FAINT};">${t.address}<br><a href="${SITE}" style="color:${FAINT};text-decoration:underline;">kojalytics.com</a></td>
</tr></table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    `${t.thanks(name)} ${t.readyText}`,
    '',
    t.text.key(d.key),
    t.keyNote(d.devices),
    '',
    t.text.start,
    t.text.step1,
    `   Mac: ${SITE}${DOWNLOAD_PATH}`,
    `   Windows: ${SITE}${DOWNLOAD_PATH_WINDOWS}`,
    t.text.step2,
    t.text.windows(guide),
    t.text.step3,
    t.text.step4,
    '',
    // Contract confirmation (§ 312f BGB).
    t.text.order,
    t.text.plan(d.subscription, planLabel) +
      (discounted && d.paidCents !== null ? t.text.discounted(d.code, euro(d.paidCents, lang), d.subscription) : ''),
    t.text.date(day(d.date, lang)),
    t.text.updates,
    '',
    t.text.terms,
    t.text.withdraw,
    ...(d.subscription ? [t.text.cancel] : []),
    t.text.provider,
    '',
    t.text.keep,
    t.text.questions,
    `Kojalytics · ${SITE}`,
  ].join('\n');

  return { html, text };
}
