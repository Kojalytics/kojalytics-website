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
  // Title lines in ink, the last one in blue; a third line moves the block up.
  const top = 196 - (title.length - 2) * 24;
  const bottom = top + (title.length - 1) * 64;
  const body =
    title
      .map((t, i) => `
    <text x="68" y="${top + i * 64}" font-family="${SANS}" font-size="56" font-weight="800" fill="${INK}" letter-spacing="-1.5">${i === title.length - 1 ? `<tspan fill="#2a66d8">${esc(t)}</tspan>` : esc(t)}</text>`)
      .join("") +
    `
    <text x="68" y="${bottom + 52}" font-family="${SANS}" font-size="25" fill="${MUTED}">${esc(sub)}</text>`;
  const icons = ["photo-koja", "light-koja", "vector-koja", "design-koja", "word-koja", "grid-koja", "deck-koja", "pdf-koja"];
  const iconBufs = await Promise.all(icons.map((s) => sharp(P(`apps/${s}/icon.webp`)).resize(50, 50).png().toBuffer()));
  const w1 = await windowShot(sharp, P(shots[0]), 560);
  const w2 = await windowShot(sharp, P(shots[1]), 330);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([
      { input: w1, left: 590, top: 130 },
      { input: w2, left: 500, top: 330 },
      ...iconBufs.map((b, i) => ({ input: b, left: 68 + i * 58, top: bottom + 100 })),
      { input: frameSvg({ ...bar, body }), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86 })
    .toFile(P(out));
}

await og("og/software.jpg", ["13 Apps für Mac", "und Windows,", "19,99 € im Monat"], "Foto, Video, Office, PDF und CAD.", ["apps/photo-koja/hero.webp", "apps/grid-koja/hero.webp"], { index: "01", label: "Koja-Apps für Mac und Windows", meta: "13 Apps · macOS · Windows" });
await og("og/kojalytics.jpg", ["Software-Studio", "aus Hamburg"], "Apps für Kunden, Mac und Windows.", ["apps/design-koja/hero.webp", "apps/word-koja/hero.webp"], { index: "01", label: "Kojalytics", meta: "iOS · Web · KI · macOS · Windows" });
console.log("ok");
