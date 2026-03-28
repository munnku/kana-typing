import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

await page.goto('http://localhost:3003/lessons/u1-l01', { waitUntil: 'networkidle0' });
await sleep(500);

// スキップボタンをクリック
const btns = await page.$$('button');
for (const btn of btns) {
  const text = await btn.evaluate(el => el.textContent);
  if (text && text.includes('スキップ')) { await btn.click(); break; }
}
await sleep(800);
await page.keyboard.press('Enter');
await sleep(1000);

await page.screenshot({ path: 'docs/screenshots/lesson_typing.png', fullPage: false });
console.log('lesson_typing done');
await browser.close();
