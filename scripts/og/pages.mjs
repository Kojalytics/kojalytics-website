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
import { H, INK, MUTED, SANS, W, esc, frameSvg, windowShot } from "./style.mjs";

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

async function render(out, { eyebrow, title, sub, icon, shot, bar }) {
  const lines = wrap(title, 17).slice(0, 4);
  const size = lines.length > 3 ? 44 : 52;
  const top = icon ? 236 : 186;
  const titleSvg = lines.map((l, i) => `<text x="68" y="${top + i * (size + 8)}" font-family="${SANS}" font-size="${size}" font-weight="800" fill="${INK}" letter-spacing="-1.4">${esc(l)}</text>`).join("");
  const subY = top + (lines.length - 1) * (size + 8) + 52;
  const body = `${icon ? `<text x="136" y="160" font-family="${SANS}" font-size="24" font-weight="700" fill="${MUTED}">${esc(eyebrow)}</text>` : ""}
    ${titleSvg}
    <text x="68" y="${subY}" font-family="${SANS}" font-size="24" fill="${MUTED}">${esc(sub)}</text>`;
  const layers = [];
  if (shot) layers.push({ input: await windowShot(sharp, P(shot), 540), left: 600, top: 150 });
  if (icon) layers.push({ input: await sharp(P(icon)).resize(52, 52).png().toBuffer(), left: 68, top: 120 });
  layers.push({ input: frameSvg({ ...bar, body }), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } }).composite(layers).jpeg({ quality: 84 }).toFile(P(out));
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
    bar: { index: "01", label: names[slug], meta: "macOS · 3 Tage kostenlos" },
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
    bar: { index: "01", label: "Ratgeber", meta: `${a.readingMinutes} Min. Lesezeit` },
    title: a.navTitle,
    sub: `Aktualisiert: ${new Date(a.updated).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}`,
    shot: appJson ? `apps/${appSlug}/${appJson.screenshots[0].file}` : null,
  });
}
console.log("ok");
