// Share images (1200x630 JPG) for every app page and Ratgeber article.
// Usage: node scripts/og/pages.mjs (run again after changing an app icon or screenshot)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(repo, "package.json"));
const sharp = require("sharp");
const P = (p) => path.join(repo, "public", p);
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const FONT = "Helvetica Neue, Helvetica, Arial";

async function windowShot(file, width) {
  const img = await sharp(P(file)).resize({ width, height: Math.round(width / 1.6), fit: "cover", position: "top" }).toBuffer({ resolveWithObject: true });
  const h = img.info.height + 28;
  const chrome = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">
    <defs><clipPath id="r"><rect width="${width}" height="${h}" rx="14"/></clipPath></defs>
    <g clip-path="url(#r)"><rect width="${width}" height="${h}" fill="#ececeb"/>
    <circle cx="18" cy="14" r="6" fill="#ff5f57"/><circle cx="38" cy="14" r="6" fill="#febc2e"/><circle cx="58" cy="14" r="6" fill="#28c840"/></g></svg>`);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}"><rect width="${width}" height="${h}" rx="14" fill="#fff"/></svg>`);
  return sharp(chrome).composite([{ input: img.data, top: 28, left: 0 }, { input: mask, blend: "dest-in" }]).png().toBuffer();
}

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

async function render(out, { eyebrow, title, sub, icon, shot }) {
  const W = 1200, H = 630;
  const lines = wrap(title, 17).slice(0, 4);
  const size = lines.length > 3 ? 46 : 54;
  const top = 196;
  const titleSvg = lines.map((l, i) => `<text x="64" y="${top + i * (size + 8)}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="#111113" letter-spacing="-1.5">${esc(l)}</text>`).join("");
  const subY = top + lines.length * (size + 8) + 14;
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${icon ? 136 : 64}" y="${icon ? 112 : 112}" font-family="${FONT}" font-size="24" font-weight="700" fill="#57534e">${esc(eyebrow)}</text>
    ${titleSvg}
    <text x="64" y="${subY}" font-family="${FONT}" font-size="25" fill="#57534e">${esc(sub)}</text>
    <rect x="64" y="560" width="32" height="32" rx="8" fill="#111113"/>
    <text x="72" y="584" font-family="${FONT}" font-size="20" font-weight="800" fill="#fff">K</text>
    <text x="106" y="584" font-family="${FONT}" font-size="22" font-weight="800" fill="#111113">Kojalytics</text></svg>`);
  const layers = [];
  if (shot) layers.push({ input: await windowShot(shot, 640), left: 600, top: 150 });
  if (icon) layers.push({ input: await sharp(P(icon)).resize(56, 56).png().toBuffer(), left: 64, top: 76 });
  layers.push({ input: text, left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#f5f5f4" } }).composite(layers).jpeg({ quality: 84 }).toFile(P(out));
}

// FilmKoja's screenshots show stills from third-party films: no screenshot in its share images.
const NO_SHOT = new Set(["film-koja"]);
const appsDir = path.join(repo, "src/content/apps");
const names = Object.fromEntries(
  [...fs.readFileSync(path.join(repo, "src/lib/apps.ts"), "utf8").matchAll(/slug: "([a-z-]+)", name: "([A-Za-z]+)"/g)].map((m) => [m[1], m[2]])
);
fs.mkdirSync(P("og/apps"), { recursive: true });
fs.mkdirSync(P("og/ratgeber"), { recursive: true });
for (const f of fs.readdirSync(appsDir)) {
  const slug = f.replace(/\.json$/, "");
  const app = JSON.parse(fs.readFileSync(path.join(appsDir, f), "utf8"));
  await render(`og/apps/${slug}.jpg`, {
    eyebrow: names[slug],
    title: `${app.kind} für den Mac`,
    sub: "3 Tage kostenlos testen · 2,99 € im Monat",
    icon: `apps/${slug}/icon.webp`,
    shot: NO_SHOT.has(slug) ? null : `apps/${slug}/${app.screenshots[0].file}`,
  });
}
const artDir = path.join(repo, "src/content/ratgeber");
for (const f of fs.readdirSync(artDir).filter((f) => f.endsWith(".json"))) {
  const a = JSON.parse(fs.readFileSync(path.join(artDir, f), "utf8"));
  const appSlug = a.apps?.find((s) => !NO_SHOT.has(s));
  const appJson = appSlug && JSON.parse(fs.readFileSync(path.join(appsDir, `${appSlug}.json`), "utf8"));
  await render(`og/ratgeber/${a.slug}.jpg`, {
    eyebrow: "Ratgeber",
    title: a.navTitle,
    sub: `Aktualisiert: ${new Date(a.updated).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}`,
    shot: appJson ? `apps/${appSlug}/${appJson.screenshots[0].file}` : null,
  });
}
console.log("ok");
