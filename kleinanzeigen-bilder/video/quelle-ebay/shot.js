const { chromium } = require('playwright');
const pages = require('./pages.json');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const n of pages) {
    await p.goto('file://' + __dirname + '/' + n + '.html'); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: __dirname + '/' + n + '.png', omitBackground: true });
  }
  await b.close();
})();
