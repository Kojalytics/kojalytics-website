// Shared look of the share images: the site's "instrument" style (white paper, hairline rail,
// crosshairs, mono label bar, square windows). Used by overview.mjs and pages.mjs.
export const W = 1200;
export const H = 630;
export const SANS = "Helvetica Neue, Helvetica, Arial";
export const MONO = "Menlo, SF Mono, monospace";
export const INK = "#0e0e10";
export const MUTED = "#5a5a60";
const HAIR = "#e3e3e1";
const STRONG = "#c9c9c6";
const FAINT = "#8a8a90";
export const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** A screenshot in a square hairline window with traffic lights. */
export async function windowShot(sharp, file, width, ratio = 1.6) {
  const img = await sharp(file).resize({ width, height: Math.round(width / ratio), fit: "cover", position: "top" }).toBuffer({ resolveWithObject: true });
  const h = img.info.height + 22;
  const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${h - 1}" fill="#efefed" stroke="${STRONG}"/>
    <line x1="0" y1="21.5" x2="${width}" y2="21.5" stroke="${STRONG}"/>
    <circle cx="13" cy="11" r="4.5" fill="#ff5f57"/><circle cx="28" cy="11" r="4.5" fill="#febc2e"/><circle cx="43" cy="11" r="4.5" fill="#28c840"/></svg>`);
  return sharp(frame).composite([{ input: img.data, top: 22, left: 1 }]).png().toBuffer();
}

/** Rail frame, label bar ("01 / LABEL ... META"), crosshairs and the Kojalytics mark as one SVG overlay. */
export function frameSvg({ index, label, meta, body = "" }) {
  const plus = (x, y) => `<line x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}" stroke="${FAINT}"/><line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}" stroke="${FAINT}"/>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <line x1="40.5" y1="0" x2="40.5" y2="${H}" stroke="${HAIR}"/><line x1="${W - 40.5}" y1="0" x2="${W - 40.5}" y2="${H}" stroke="${HAIR}"/>
    <line x1="40" y1="40.5" x2="${W - 40}" y2="40.5" stroke="${HAIR}"/><line x1="40" y1="84.5" x2="${W - 40}" y2="84.5" stroke="${HAIR}"/>
    <line x1="40" y1="${H - 40.5}" x2="${W - 40}" y2="${H - 40.5}" stroke="${HAIR}"/>
    ${plus(40.5, 40.5)}${plus(W - 40.5, 40.5)}${plus(40.5, H - 40.5)}${plus(W - 40.5, H - 40.5)}
    <text x="68" y="67" font-family="${MONO}" font-size="14" letter-spacing="2.4" fill="${FAINT}">${esc(index)}  /  <tspan fill="${INK}">${esc(label.toUpperCase())}</tspan></text>
    <text x="${W - 68}" y="67" text-anchor="end" font-family="${MONO}" font-size="14" letter-spacing="2.4" fill="${MUTED}">${esc(meta.toUpperCase())}</text>
    <rect x="68" y="${H - 86}" width="26" height="26" fill="${INK}"/>
    <text x="75" y="${H - 66}" font-family="${SANS}" font-size="17" font-weight="800" fill="#fff">K</text>
    <text x="104" y="${H - 66}" font-family="${SANS}" font-size="20" font-weight="800" fill="${INK}">Kojalytics</text>
    ${body}</svg>`);
}
