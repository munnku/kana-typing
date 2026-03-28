import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// ポート3003でレッスン画面へ
await page.goto('http://localhost:3003/lessons/u1-l01', { waitUntil: 'networkidle0' });
console.log('URL:', page.url());
await sleep(500);

// スキップボタンをクリック
const btns = await page.$$('button');
for (const btn of btns) {
  const text = await btn.evaluate(el => el.textContent?.trim());
  console.log('btn:', text?.substring(0,20));
  if (text && text.includes('スキップ')) { await btn.click(); console.log('skipped'); break; }
}
await sleep(1000);

await page.screenshot({ path: 'docs/screenshots/lesson_typing2.png', fullPage: false });
console.log('done');
await browser.close();
