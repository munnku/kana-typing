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

async function setDark() {
  await page.evaluate(() => {
    localStorage.setItem('typing_app_settings', JSON.stringify({
      showKeyboard: true, showFingerGuide: true, soundEnabled: false,
      fontSize: 'md', theme: 'dark', romajiGuide: 'always'
    }));
    document.documentElement.classList.add('dark');
  });
}

// Dashboard
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await setDark();
await page.reload({ waitUntil: 'domcontentloaded' });
await wait(3000);
await page.screenshot({ path: OUT + 'dashboard_1440.png' });
console.log('dashboard done');

// Lessons list
await page.goto('http://localhost:3000/lessons', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(2500);
await page.screenshot({ path: OUT + 'lessons_1440.png' });
console.log('lessons done');

// Test idle
await page.goto('http://localhost:3000/test', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(2500);
await page.screenshot({ path: OUT + 'test_idle_1440.png' });
console.log('test idle done');

// Lesson active (skip tutorial)
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(3000);
// click skip button
const buttons = await page.$$('button');
for (const btn of buttons) {
  const text = await btn.evaluate(el => el.textContent);
  if (text && text.includes('スキップ')) { await btn.click(); break; }
}
await wait(1000);
await page.screenshot({ path: OUT + 'lesson_idle_1440.png' });
console.log('lesson idle done');

// Start typing
await page.keyboard.press('a');
await wait(800);
await page.screenshot({ path: OUT + 'lesson_active_1440.png' });
console.log('lesson active done');

// Results page mock - go to a results page
// (need data so just capture stats)
await page.goto('http://localhost:3000/stats', { waitUntil: 'domcontentloaded', timeout: 15000 });
await wait(3000);
await page.screenshot({ path: OUT + 'stats_1440.png' });
console.log('stats done');

await browser.close();
console.log('All done!');
