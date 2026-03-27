import puppeteer from 'puppeteer';

const OUT = 'C:\\Users\\siri2\\Documents\\Claude\\Typing-app\\docs\\screenshots\\';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1280, height: 900 },
  args: ['--no-sandbox', '--window-size=1280,900']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function setDark() {
  await page.evaluate(() => {
    localStorage.setItem('typing_app_settings', JSON.stringify({
      showKeyboard: true, showFingerGuide: true, soundEnabled: false,
      fontSize: 'md', theme: 'dark', romajiGuide: 'always'
    }));
    document.documentElement.classList.add('dark');
  });
}

// === レッスン画面（チュートリアルをボタンクリックでスキップ） ===
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 15000 });
await setDark();
await page.reload({ waitUntil: 'domcontentloaded' });
await wait(3000);

// チュートリアルのスキップボタンをクリック
try {
  await page.waitForSelector('button', { timeout: 3000 });
  const buttons = await page.$$('button');
  // スキップボタンを探す
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && text.includes('スキップ')) {
      await btn.click();
      console.log('skip button clicked');
      break;
    }
  }
} catch(e) {
  console.log('no skip button found, trying Enter');
  await page.keyboard.press('Enter');
}
await wait(1500);
await page.screenshot({ path: OUT + 'lesson_idle.png' });
console.log('lesson_idle done');

// Type to start
await page.keyboard.press('a');
await wait(500);
await page.screenshot({ path: OUT + 'lesson_active.png' });
console.log('lesson_active done');

// === テスト idle ===
await page.goto('http://localhost:3000/test', { waitUntil: 'domcontentloaded', timeout: 15000 });
await setDark();
await page.reload({ waitUntil: 'domcontentloaded' });
await wait(2500);
await page.screenshot({ path: OUT + 'test_idle_new.png' });
console.log('test_idle_new done');

// テスト開始
await page.keyboard.press('Enter');
await wait(1500);
await page.screenshot({ path: OUT + 'test_active_new.png' });
console.log('test_active_new done');

// 数文字打つ
for (const key of ['s', 'o', 'n', 'o', 'k', 'o']) {
  await page.keyboard.press(key);
  await wait(150);
}
await wait(500);
await page.screenshot({ path: OUT + 'test_typing_new.png' });
console.log('test_typing_new done');

// === ダッシュボード ===
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(3000);
await page.screenshot({ path: OUT + 'dashboard_new.png' });
console.log('dashboard_new done');

// === 統計ページ ===
await page.goto('http://localhost:3000/stats', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(3000);
await page.screenshot({ path: OUT + 'stats_new.png' });
console.log('stats_new done');

// === バッジページ ===
await page.goto('http://localhost:3000/badges', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(2500);
await page.screenshot({ path: OUT + 'badges_new.png' });
console.log('badges_new done');

await browser.close();
console.log('All done!');
