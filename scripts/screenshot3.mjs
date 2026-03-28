import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// ページ読み込み
await page.goto('http://localhost:3003/lessons/u1-l01', { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(2000);

await page.screenshot({ path: 'docs/screenshots/lesson_tutorial.png', fullPage: false });
console.log('tutorial done');

// スキップ
const btns = await page.$$('button');
for (const btn of btns) {
  const text = await btn.evaluate(el => el.textContent?.trim());
  if (text && text.includes('スキップ')) { await btn.click(); break; }
}
await sleep(1500);
await page.keyboard.press('a');
await sleep(500);

await page.screenshot({ path: 'docs/screenshots/lesson_typing3.png', fullPage: false });
console.log('typing done');

await browser.close();
