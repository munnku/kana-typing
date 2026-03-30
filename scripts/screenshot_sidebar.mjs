import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

await page.goto('http://localhost:3003/', { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(2000);

// サイドバー全体
await page.screenshot({ path: 'docs/screenshots/sidebar.png', fullPage: false, clip: { x: 0, y: 0, width: 100, height: 200 } });
console.log('sidebar done');

await browser.close();
