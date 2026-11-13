// Renders the site icons from scripts/brand/icon.html: src/app/icon.png (512), src/app/apple-icon.png (180) and
// src/app/favicon.ico (16/32/48, the file Google and browsers ask for first).
// Usage: node scripts/brand/icons.mjs   (needs Google Chrome and network for the font)

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const profile = mkdtempSync(path.join(tmpdir(), "kj-icon-"));
try {
  const png = path.join(profile, "icon.png");
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`,
    "--window-size=512,512", "--virtual-time-budget=6000", `--screenshot=${png}`, `file://${path.join(here, "icon.html")}`,
  ], { stdio: "ignore", timeout: 60_000 });

  await sharp(png).resize(512, 512).png().toFile(path.join(root, "src/app/icon.png"));
  await sharp(png).resize(180, 180).png().toFile(path.join(root, "src/app/apple-icon.png"));

  // ICO with embedded PNGs (supported by all current browsers and by Google).
  const sizes = [16, 32, 48];
  // RGBA PNGs: Next.js (and some browsers) reject ICO entries without an alpha channel.
  const images = await Promise.all(sizes.map((s) => sharp(png).resize(s, s).ensureAlpha().png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(s, e);
    header.writeUInt8(s, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(images[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += images[i].length;
  });
  writeFileSync(path.join(root, "src/app/favicon.ico"), Buffer.concat([header, ...images]));
  console.log("icon.png, apple-icon.png, favicon.ico written");
} finally {
  rmSync(profile, { recursive: true, force: true });
}
