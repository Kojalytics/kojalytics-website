// usage: node frames.js stills t1 t2 ...   |  node frames.js video out.mp4 fps
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/video.html');
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const seek = (t) => p.evaluate((ms) => { document.getAnimations().forEach(a => { a.currentTime = ms; }); }, t * 1000);
  if (mode === 'stills') {
    for (const t of rest) { await seek(parseFloat(t)); await p.screenshot({ path: `${__dirname}/still_${t}.png` }); }
  } else {
    const [out, fps = '30', total = '47.5'] = rest;
    const n = Math.round(parseFloat(total) * parseInt(fps));
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await seek(i / parseInt(fps));
      const buf = await p.screenshot({ type: 'jpeg', quality: 96 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.error('frame', i, '/', n);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
