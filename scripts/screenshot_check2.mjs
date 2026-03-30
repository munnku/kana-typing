import puppeteer from 'puppeteer';

const ports = [3010, 3000, 3001, 3002, 3003];
let browser;
try {
  browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  for (const port of ports) {
    try {
      await page.goto(`http://localhost:${port}/lessons/u0-l01`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      console.log('Connected on port', port);
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'docs/screenshots/tutorial_new.png' });
      console.log('Screenshot taken');
      break;
    } catch (e) {
      console.log('Port', port, 'failed');
    }
  }
} finally {
  if (browser) await browser.close();
}
