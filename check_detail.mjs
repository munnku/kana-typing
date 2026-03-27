import puppeteer from 'puppeteer';

const OUT = 'C:\\Users\\siri2\\Documents\\Claude\\Typing-app\\docs\\screenshots\\';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1440, height: 900 },
  args: ['--no-sandbox', '--window-size=1440,900']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// Set dark theme first
await page.goto('http://localhost:3000/lessons/u3-l01', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.evaluate(() => {
  localStorage.setItem('typing_app_settings', JSON.stringify({
    showKeyboard: true, showFingerGuide: true, soundEnabled: false,
    fontSize: 'md', theme: 'dark', romajiGuide: 'always'
  }));
  document.documentElement.classList.add('dark');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await wait(3000);

// Skip tutorial if present
const buttons = await page.$$('button');
for (const btn of buttons) {
  const text = await btn.evaluate(el => el.textContent);
  if (text && text.includes('スキップ')) { await btn.click(); break; }
}
await wait(1000);

// Type to make it active
await page.keyboard.press('s');
await wait(800);
await page.screenshot({ path: OUT + 'lesson_active_fullwidth.png' });
console.log('lesson active fullwidth done');

// Test active
await page.goto('http://localhost:3000/test', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(2000);
await page.keyboard.press('Enter');
await wait(1500);
for (const k of ['s','o','n','o']) {
  await page.keyboard.press(k);
  await wait(100);
}
await page.screenshot({ path: OUT + 'test_active_fullwidth.png' });
console.log('test active fullwidth done');

await browser.close();
