// Renders the demo loops (scripts/app-demos/demo.html, scenes in src/content/demos.json) to
// public/apps/<slug>/demo.mp4 plus a poster frame demo.jpg.
// Usage: node scripts/app-demos/render.mjs [slug]
// Needs Google Chrome, network for the fonts and ffmpeg (on PATH or FFMPEG=/path/to/ffmpeg).
// Chrome runs headless with its own throwaway profile and is driven over the DevTools protocol,
// one screenshot per frame, so the animation is frame-exact.

import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FPS = 30;
const PORT = 9347;
const only = process.argv[2];
const demos = JSON.parse(readFileSync(path.join(root, "src/content/demos.json"), "utf8"));

const work = mkdtempSync(path.join(tmpdir(), "app-demos-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--allow-file-access-from-files",
  `--user-data-dir=${path.join(work, "profile")}`, `--remote-debugging-port=${PORT}`, "about:blank",
], { stdio: "ignore" });

async function pageTarget() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await pageTarget());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
const waiters = [];
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method) {
    for (const w of waiters.splice(0)) w(msg);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  for (const slug of Object.keys(demos.apps)) {
    if (only && slug !== only) continue;
    const loaded = new Promise((r) =>
      waiters.push(function wait(m) {
        if (m.method === "Page.loadEventFired") r();
        else waiters.push(wait);
      }),
    );
    await send("Page.navigate", { url: `file://${path.join(here, "demo.html")}?app=${slug}` });
    await loaded;
    const seconds = await evaluate("window.ready");
    const frames = Math.round(seconds * FPS);
    const dir = mkdtempSync(path.join(work, `${slug}-`));
    for (let f = 0; f < frames; f++) {
      await evaluate(`render(${f / FPS})`);
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(path.join(dir, `${String(f).padStart(4, "0")}.png`), Buffer.from(data, "base64"));
    }
    const out = path.join(root, "public/apps", slug);
    execFileSync(FFMPEG, [
      "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(dir, "%04d.png"),
      "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
      path.join(out, "demo.mp4"),
    ]);
    await sharp(path.join(dir, "0000.png")).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, "demo.jpg"));
    const kb = Math.round(readFileSync(path.join(out, "demo.mp4")).length / 1024);
    console.log(`${slug}: ${frames} frames, ${seconds.toFixed(1)} s, ${kb} KB`);
    rmSync(dir, { recursive: true, force: true });
  }
} finally {
  ws.close();
  await new Promise((r) => { chrome.once("exit", r); chrome.kill(); });
  rmSync(work, { recursive: true, force: true, maxRetries: 5 });
}
