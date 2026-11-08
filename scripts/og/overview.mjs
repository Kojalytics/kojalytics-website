// Share images (1200x630 JPG) for /software and the home page, with the row of app icons.
// Usage: node scripts/og/overview.mjs
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(repo, "package.json"));
const sharp = require("sharp");
const P = (p) => path.join(repo, "public", p);

async function windowShot(file, width) {
  const img = await sharp(P(file)).resize({ width }).toBuffer({ resolveWithObject: true });
  const h = img.info.height + 28;
  const chrome = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">
    <defs><clipPath id="r"><rect width="${width}" height="${h}" rx="14"/></clipPath></defs>
    <g clip-path="url(#r)"><rect width="${width}" height="${h}" fill="#ececeb"/>
    <circle cx="18" cy="14" r="6" fill="#ff5f57"/><circle cx="38" cy="14" r="6" fill="#febc2e"/><circle cx="58" cy="14" r="6" fill="#28c840"/></g></svg>`);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}"><rect width="${width}" height="${h}" rx="14" fill="#fff"/></svg>`);
  return sharp(chrome).composite([{ input: img.data, top: 28, left: 0 }, { input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function og(out, title, sub, shots) {
  const W = 1200, H = 630;
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="64" y="132" font-family="Helvetica Neue, Helvetica, Arial" font-size="54" font-weight="800" fill="#111113" letter-spacing="-1.5">${title[0]}</text>
    <text x="64" y="196" font-family="Helvetica Neue, Helvetica, Arial" font-size="54" font-weight="800" fill="#111113" letter-spacing="-1.5">${title[1]}</text>
    <text x="64" y="252" font-family="Helvetica Neue, Helvetica, Arial" font-size="26" fill="#57534e">${sub}</text>
    <rect x="64" y="560" width="32" height="32" rx="8" fill="#111113"/>
    <text x="72" y="584" font-family="Helvetica Neue, Helvetica, Arial" font-size="20" font-weight="800" fill="#fff">K</text>
    <text x="106" y="584" font-family="Helvetica Neue, Helvetica, Arial" font-size="22" font-weight="800" fill="#111113">Kojalytics</text></svg>`);
  const icons = ["photo-koja", "light-koja", "vector-koja", "film-koja", "word-koja", "grid-koja", "deck-koja", "pdf-koja"];
  const iconBufs = await Promise.all(icons.map((s) => sharp(P(`apps/${s}/icon.webp`)).resize(52, 52).png().toBuffer()));
  const w1 = await windowShot(shots[0], 640);
  const w2 = await windowShot(shots[1], 380);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#f5f5f4" } })
    .composite([
      { input: w1, left: 600, top: 120 },
      { input: w2, left: 470, top: 330 },
      { input: text, left: 0, top: 0 },
      ...iconBufs.map((b, i) => ({ input: b, left: 64 + i * 60, top: 300 })),
    ])
    .jpeg({ quality: 86 })
    .toFile(P(out));
}

await og("og/software.jpg", ["13 Mac-Apps für", "2,99 € im Monat"], "Foto, Video, Office, PDF und CAD.", ["apps/photo-koja/hero.webp", "apps/grid-koja/hero.webp"]);
await og("og/kojalytics.jpg", ["Software-Studio", "aus Deutschland"], "Apps für Kunden und für den Mac.", ["apps/design-koja/hero.webp", "apps/word-koja/hero.webp"]);
console.log("ok");
