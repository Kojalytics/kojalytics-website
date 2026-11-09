// Share images (1200x630 JPG) for /software and the home page, with the row of app icons.
// Usage: node scripts/og/overview.mjs
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(repo, "package.json"));
const sharp = require("sharp");
const P = (p) => path.join(repo, "public", p);
import { H, INK, MUTED, SANS, W, esc, frameSvg, windowShot } from "./style.mjs";

async function og(out, title, sub, shots, bar) {
  const body = `
    <text x="68" y="196" font-family="${SANS}" font-size="56" font-weight="800" fill="${INK}" letter-spacing="-1.5">${esc(title[0])}</text>
    <text x="68" y="260" font-family="${SANS}" font-size="56" font-weight="800" fill="${INK}" letter-spacing="-1.5"><tspan fill="#2a66d8">${esc(title[1])}</tspan></text>
    <text x="68" y="312" font-family="${SANS}" font-size="25" fill="${MUTED}">${esc(sub)}</text>`;
  const icons = ["photo-koja", "light-koja", "vector-koja", "design-koja", "word-koja", "grid-koja", "deck-koja", "pdf-koja"];
  const iconBufs = await Promise.all(icons.map((s) => sharp(P(`apps/${s}/icon.webp`)).resize(50, 50).png().toBuffer()));
  const w1 = await windowShot(sharp, P(shots[0]), 560);
  const w2 = await windowShot(sharp, P(shots[1]), 330);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([
      { input: w1, left: 590, top: 130 },
      { input: w2, left: 500, top: 330 },
      ...iconBufs.map((b, i) => ({ input: b, left: 68 + i * 58, top: 360 })),
      { input: frameSvg({ ...bar, body }), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86 })
    .toFile(P(out));
}

await og("og/software.jpg", ["13 Mac-Apps für", "2,99 € im Monat"], "Foto, Video, Office, PDF und CAD.", ["apps/photo-koja/hero.webp", "apps/grid-koja/hero.webp"], { index: "01", label: "Koja-Apps für den Mac", meta: "13 Apps · macOS" });
await og("og/kojalytics.jpg", ["Software-Studio", "aus Hamburg"], "Apps für Kunden und für den Mac.", ["apps/design-koja/hero.webp", "apps/word-koja/hero.webp"], { index: "01", label: "Kojalytics", meta: "iOS · Web · KI · macOS" });
console.log("ok");
