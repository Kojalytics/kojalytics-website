import { APPS } from '@/lib/apps';
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, PLANS } from '@/lib/pricing';

/**
 * The licence e-mail a buyer gets after checkout: an HTML version in the look of the site and the same content as
 * plain text. No images, web fonts or tracking pixels, so it shows complete at once, even with images blocked.
 * Table layout with inline styles, because Outlook and Gmail ignore most other CSS.
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
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const euro = (cents: number) => (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const day = (d: Date) => d.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' });

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

export function licenseEmail(d: LicenseEmailData): { html: string; text: string } {
  const plan = d.subscription ? PLANS.monthly : PLANS.lifetime;
  const discounted = d.paidCents !== null && d.paidCents !== plan.cents;
  const name = firstName(d.name);
  const key = esc(d.key);
  // The key in the launcher sketch: the start is enough to recognise it.
  const keyStart = esc(d.key.split('-').slice(0, 3).join('-')) + '-…';

  const groups = [...new Set(APPS.map((a) => a.group))].map((group) => ({ group, apps: APPS.filter((a) => a.group === group) }));
  const perks = d.subscription
    ? ['Alle 13 Koja-Apps', 'Alle Updates inklusive', `Auf bis zu ${d.devices} Geräten (Mac oder Windows-PC)`, 'Jederzeit online kündbar']
    : ['Alle 13 Koja-Apps, ohne Ablaufdatum', 'Updates über den Kojalytics Launcher', `Auf bis zu ${d.devices} Geräten (Mac oder Windows-PC)`, 'Einmal bezahlt, keine Verlängerung'];

  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Dein Kojalytics-Lizenzschlüssel</title>
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
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${SURFACE};">Dein Lizenzschlüssel und die Einrichtung in vier Schritten.${'&#8199;&#847;'.repeat(60)}</div>
<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="background-color:${SURFACE};">
<tr><td align="center" style="padding:28px 12px 32px 12px;">

<table ${TABLE} width="600" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${LINE};font-family:${SANS};color:${INK};">

<tr><td class="px" style="padding:20px 32px;border-bottom:1px solid ${LINE};">
<table ${TABLE} width="100%"><tr>
<td valign="middle" width="32" style="width:32px;">
<table ${TABLE}><tr><td width="32" height="32" align="center" valign="middle" bgcolor="${INK}" style="width:32px;height:32px;background-color:${INK};font-family:${SANS};font-size:19px;font-weight:800;color:#ffffff;">K</td></tr></table>
</td>
<td valign="middle" style="padding-left:10px;font-size:19px;font-weight:800;letter-spacing:-0.3px;color:${INK};">Kojalytics</td>
<td valign="middle" align="right" style="${HUD}">Kauf vom<br><span style="font-family:${SANS};font-size:14px;letter-spacing:0;text-transform:none;font-weight:700;color:${INK};">${day(d.date)}</span></td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:38px 32px 0 32px;">
<p style="margin:0 0 14px 0;${HUD}color:${GREEN};font-weight:700;"><span style="font-family:${SANS};">&#9679;</span>&nbsp; Zahlung erfolgreich</p>
<h1 class="h1" style="margin:0;font-size:31px;line-height:1.15;font-weight:800;letter-spacing:-0.6px;color:${INK};">${name ? `Danke, ${esc(name)}!` : 'Danke für deinen Kauf!'} Deine 13&nbsp;Koja&#8209;Apps sind bereit.</h1>
<p style="margin:14px 0 0 0;font-size:16px;line-height:1.6;color:${MUTED};">Hier ist dein Lizenzschlüssel. In vier Schritten bist du startklar, am Mac genauso wie unter Windows.</p>
</td></tr>

<tr><td class="px" style="padding:26px 32px 0 32px;">
<table ${TABLE} width="100%" bgcolor="${INK}" style="background-color:${INK};"><tr>
<td width="4" bgcolor="${GREEN}" style="width:4px;background-color:${GREEN};font-size:0;line-height:0;">&nbsp;</td>
<td class="keybox" style="padding:22px 24px 20px 22px;">
<p style="margin:0 0 10px 0;${HUD}color:${ON_INK};">Dein Lizenzschlüssel</p>
<p class="key" style="margin:0;font-family:${MONO};font-size:21px;line-height:1.4;font-weight:700;letter-spacing:1px;color:#ffffff;overflow-wrap:break-word;-webkit-user-select:all;user-select:all;">${key}</p>
<p style="margin:12px 0 0 0;font-size:13px;line-height:1.5;color:${ON_INK};">Gilt für bis zu ${d.devices} Geräte (Mac oder Windows-PC). Bitte gut aufbewahren.</p>
</td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:40px 32px 0 32px;">
<p style="margin:0;${HUD}">Einrichtung &middot; 4 Schritte</p>
<h2 style="margin:6px 0 0 0;font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.3px;color:${INK};">So startest du</h2>
</td></tr>

${step(
  1,
  'Kojalytics Launcher laden',
  'Über den Launcher installierst und aktualisierst du alle Koja-Apps.',
  `<table ${TABLE} width="100%" style="margin-top:14px;"><tr>
<td class="stack stack-gap" width="50%" valign="top" style="padding-right:6px;">${button(SITE + DOWNLOAD_PATH, 'Für Mac laden')}</td>
<td class="stack" width="50%" valign="top" style="padding-left:6px;">${button(SITE + DOWNLOAD_PATH_WINDOWS, 'Für Windows laden')}</td>
</tr></table>`,
)}

${step(
  2,
  'Installieren',
  `<b style="color:${INK};">Mac:</b> Öffne die Datei und ziehe den Launcher in den Ordner „Programme“.<br><b style="color:${INK};">Windows:</b> Öffne die Datei und folge dem Installations-Assistenten.`,
  `<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="margin-top:14px;background-color:${SURFACE};"><tr>
<td style="padding:14px 16px;font-size:14px;line-height:1.6;color:${MUTED};"><b style="color:${INK};">Windows fragt nach?</b> Das ist bei neuen Programmen normal. Bei „Der Computer wurde durch Windows geschützt“ klickst du auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“. ${link(`${SITE}/support/windows-installation`, 'Anleitung mit allen Schritten')}</td>
</tr></table>`,
)}

${step(
  3,
  'Schlüssel aktivieren',
  `Starte den Launcher, öffne <b style="color:${INK};">Einstellungen › Lizenz</b>, füge deinen Schlüssel ein und klicke auf <b style="color:${INK};">„Aktivieren“</b>.`,
  `<table ${TABLE} width="100%" style="margin-top:14px;border:1px solid ${LINE_STRONG};"><tr>
<td bgcolor="${SURFACE}" style="padding:9px 14px;background-color:${SURFACE};border-bottom:1px solid ${LINE};${HUD}">Einstellungen &rsaquo; Lizenz</td>
</tr><tr>
<td style="padding:16px 14px;">
<p style="margin:0 0 6px 0;font-size:12px;line-height:1.4;color:${MUTED};">Lizenzschlüssel</p>
<table ${TABLE} width="100%"><tr>
<td class="field" style="padding:10px 12px;border:1px solid ${LINE_STRONG};font-family:${MONO};font-size:13px;line-height:1.3;color:${INK};white-space:nowrap;">${keyStart}</td>
<td class="hide-sm" width="10" style="width:10px;"></td>
<td class="stack" width="1" align="center" bgcolor="${GREEN}" style="padding:10px 16px;background-color:${GREEN};font-size:13px;line-height:1.3;font-weight:700;color:#ffffff;white-space:nowrap;">Aktivieren</td>
</tr></table>
</td>
</tr></table>`,
)}

${step(4, 'Apps installieren', 'Wähle im Launcher die Koja-Apps, die du brauchst, und installiere sie. Updates bekommst du ebenfalls über den Launcher.')}

<tr><td class="px" style="padding:44px 32px 0 32px;">
<p style="margin:0;${HUD}">${d.subscription ? 'Dein Abo' : 'Deine Lizenz'}</p>
<h2 style="margin:6px 0 14px 0;font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.3px;color:${INK};">Das steckt drin</h2>
<table ${TABLE} width="100%" style="border:1px solid ${LINE};">
${groups
  .map(
    ({ group, apps }, i) => `<tr><td style="padding:14px 16px;${i < groups.length - 1 ? `border-bottom:1px solid ${LINE};` : ''}">
<p style="margin:0 0 6px 0;${HUD}">${esc(group)}</p>
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
<p style="margin:0 0 10px 0;${HUD}">Deine Bestellung</p>
<table ${TABLE} width="100%" style="border-top:2px solid ${INK};">
${row('Produkt', `Koja-Apps &middot; ${d.subscription ? 'Monatlich' : 'Dauerhaft'}<br><span style="font-size:13px;color:${MUTED};">Alle 13 Koja-Apps für Mac und Windows${d.subscription ? ', monatlich kündbar' : ', ohne Ablaufdatum'}</span>`)}
${row('Preis', d.subscription ? `${euro(plan.cents)} pro Monat` : `${euro(plan.cents)} einmalig`)}
${d.code ? row('Rabattcode', `<span style="font-family:${MONO};letter-spacing:0.5px;">${esc(d.code)}</span>`) : ''}
${d.paidCents !== null ? row(d.subscription && discounted ? 'Bezahlt (erster Monat)' : 'Bezahlt', euro(d.paidCents), true) : ''}
${row('Kaufdatum', day(d.date))}
${row('E-Mail', `<span style="word-break:break-all;">${esc(d.email)}</span>`)}
</table>
<p style="margin:12px 0 0 0;font-size:13px;line-height:1.6;color:${MUTED};">Alle Preise inkl. MwSt.${d.subscription ? ` Danach ${plan.label} pro Monat.` : ''} Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha), die mit Updates laufend weiterentwickelt werden.</p>
</td></tr>

<tr><td class="px" style="padding:36px 32px 34px 32px;">
<table ${TABLE} width="100%" bgcolor="${SURFACE}" style="background-color:${SURFACE};"><tr>
<td style="padding:18px 20px;font-size:15px;line-height:1.6;color:${MUTED};"><b style="color:${INK};">Fragen?</b> Antworte einfach auf diese E-Mail oder schreib an ${link('mailto:support@kojalytics.com', 'support@kojalytics.com')}. Wir helfen dir persönlich weiter.</td>
</tr></table>
<p style="margin:20px 0 0 0;font-size:13px;line-height:1.7;color:${MUTED};">Es gelten unsere ${link(`${SITE}/agb`, 'AGB mit Widerrufsbelehrung')}. ${link(`${SITE}/widerrufen`, 'Widerruf erklären')}${d.subscription ? ` &middot; ${link(`${SITE}/kuendigen`, 'Abo kündigen')}` : ''}. Bitte bewahre diese E-Mail gut auf.</p>
</td></tr>

</table>

<table ${TABLE} width="600" style="width:100%;max-width:600px;"><tr>
<td align="center" style="padding:20px 12px 0 12px;font-family:${SANS};font-size:12px;line-height:1.7;color:${FAINT};">Kojalytics &middot; Farzad Khojazada &middot; Am Diggen 40i &middot; 21077 Hamburg<br><a href="${SITE}" style="color:${FAINT};text-decoration:underline;">kojalytics.com</a></td>
</tr></table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    name ? `Danke, ${name}! Deine 13 Koja-Apps sind bereit.` : 'Danke für deinen Kauf! Deine 13 Koja-Apps sind bereit.',
    '',
    `Dein Kojalytics-Lizenzschlüssel: ${d.key}`,
    `Gilt für bis zu ${d.devices} Geräte (Mac oder Windows-PC). Bitte gut aufbewahren.`,
    '',
    'So startest du:',
    '1. Lade den Kojalytics Launcher:',
    `   Mac: ${SITE}${DOWNLOAD_PATH}`,
    `   Windows: ${SITE}${DOWNLOAD_PATH_WINDOWS}`,
    '2. Mac: Öffne die Datei und ziehe den Launcher in den Ordner „Programme“. Windows: Öffne die Datei und folge dem Installations-Assistenten.',
    `   Windows fragt nach? Klicke auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“. Anleitung: ${SITE}/support/windows-installation`,
    '3. Starte den Launcher, öffne Einstellungen › Lizenz, füge den Schlüssel ein und klicke auf „Aktivieren“.',
    '4. Installiere deine Koja-Apps direkt im Launcher.',
    '',
    // Contract confirmation (§ 312f BGB).
    'Deine Bestellung',
    (d.subscription
      ? `Koja-Apps · Monatlich: alle 13 Koja-Apps für Mac und Windows, ${plan.label} pro Monat inkl. MwSt., monatlich kündbar.`
      : `Koja-Apps · Dauerhaft: alle 13 Koja-Apps für Mac und Windows, einmalig ${plan.label} inkl. MwSt., ohne Ablaufdatum.`) +
      (discounted && d.paidCents !== null
        ? ` Mit Rabattcode${d.code ? ` ${d.code}` : ''} bezahlt: ${euro(d.paidCents)}${d.subscription ? ' für den ersten Abrechnungszeitraum' : ''}.`
        : ''),
    `Kaufdatum: ${day(d.date)}`,
    'Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha), die mit Updates laufend weiterentwickelt werden.',
    '',
    `Es gelten unsere AGB mit Widerrufsbelehrung: ${SITE}/agb`,
    `Widerruf erklären: ${SITE}/widerrufen`,
    ...(d.subscription ? [`Abo kündigen: ${SITE}/kuendigen`] : []),
    'Anbieter: Kojalytics, Farzad Khojazada, Am Diggen 40i, 21077 Hamburg, support@kojalytics.com',
    '',
    'Bitte bewahre diese E-Mail gut auf.',
    'Fragen? Antworte einfach auf diese E-Mail.',
    `Kojalytics · ${SITE}`,
  ].join('\n');

  return { html, text };
}
