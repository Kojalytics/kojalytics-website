// Renders the 13 app card pictures (scripts/app-cards/card.html) to public/apps/<slug>/karte.webp.
// Usage: node scripts/app-cards/render.mjs [slug]   (needs Google Chrome and network for the fonts)
// Slugs, names and colours come from src/lib/apps.ts, so the pictures follow the app list.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const only = process.argv[2];

const apps = [...readFileSync(path.join(root, "src/lib/apps.ts"), "utf8").matchAll(/slug: "([\w-]+)", name: "(\w+)",.*?color: "#(\w{6})"/g)].map(
  ([, slug, name, color]) => ({ slug, name, color }),
);

const profile = mkdtempSync(path.join(tmpdir(), "app-cards-"));
try {
  for (const app of apps) {
    if (only && app.slug !== only) continue;
    const png = path.join(profile, `${app.slug}.png`);
    const url = `file://${path.join(here, "card.html")}?app=${app.slug}&c=${app.color}&name=${app.name}`;
    // A fresh profile per run, so this never touches (or blocks) the user's own Chrome.
    execFileSync(CHROME, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`,
      "--window-size=960,600", "--force-device-scale-factor=1.5", "--virtual-time-budget=8000",
      `--screenshot=${png}`, url,
    ], { stdio: "ignore", timeout: 60_000 });
    const out = path.join(root, "public/apps", app.slug, "karte.webp");
    const info = await sharp(png).resize(1440, 900).webp({ quality: 78, effort: 6 }).toFile(out);
    console.log(`${app.slug}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
  }
} finally {
  rmSync(profile, { recursive: true, force: true });
}
