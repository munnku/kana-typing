import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3010/lessons/u0-l01', { waitUntil: 'domcontentloaded', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'docs/screenshots/tutorial_s1.png' });

async function clickNext() {
  const btns = await page.$$('button');
  for (const btn of btns) {
    const txt = await page.evaluate(el => el.textContent?.trim(), btn);
    if (txt && (txt.includes('次へ') || txt.includes('レッスン開始'))) {
      await btn.click();
      return true;
    }
  }
  return false;
}

await clickNext();
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'docs/screenshots/tutorial_s2.png' });

await clickNext();
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'docs/screenshots/tutorial_s3.png' });

await clickNext();
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'docs/screenshots/tutorial_s4.png' });

await browser.close();
console.log('done');
