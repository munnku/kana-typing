import puppeteer from 'puppeteer';
const ports = [3000, 3001, 3002, 3003, 3010];
let browser;
try {
  browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const port of ports) {
    try {
      await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'docs/screenshots/sidebar_bolt.png' });
      // Zoom into sidebar
      await page.screenshot({ path: 'docs/screenshots/sidebar_bolt_zoom.png', clip: { x: 0, y: 0, width: 100, height: 100 } });
      console.log('done on port', port);
      break;
    } catch { /* try next */ }
  }
} finally {
  if (browser) await browser.close();
}
