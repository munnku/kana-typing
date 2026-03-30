import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'docs/screenshots/tutorial_slide_unit1_s1.png' });

// Click 次へ
const btns = await page.$$('button');
for (const btn of btns) {
  const txt = await page.evaluate(el => el.textContent?.trim(), btn);
  if (txt && txt.includes('次へ')) { await btn.click(); break; }
}
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'docs/screenshots/tutorial_slide_unit1_s2.png' });
await browser.close();
console.log('done');
