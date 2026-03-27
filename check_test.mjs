import puppeteer from 'puppeteer';

const OUT = 'C:\\Users\\siri2\\Documents\\Claude\\Typing-app\\docs\\screenshots\\';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1280, height: 900 },
  args: ['--no-sandbox', '--window-size=1280,900']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

// Set dark theme
await page.goto('http://localhost:3000/test', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.evaluate(() => {
  localStorage.setItem('typing_app_settings', JSON.stringify({
    showKeyboard: true, showFingerGuide: true, soundEnabled: false,
    fontSize: 'md', theme: 'dark', romajiGuide: 'always'
  }));
  document.documentElement.classList.add('dark');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

// idle state
await page.screenshot({ path: OUT + 'test_idle_check.png' });
console.log('idle done');

// Start test with Enter
await page.keyboard.press('Enter');
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: OUT + 'test_active_check.png' });
console.log('active done');

// Type some chars
for (const key of ['a','i','u','e','o','k','a']) {
  await page.keyboard.press(key);
  await new Promise(r => setTimeout(r, 100));
}
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: OUT + 'test_typing_check.png' });
console.log('typing done');

// Stats page
await page.goto('http://localhost:3000/stats', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: OUT + 'stats_check.png' });
console.log('stats done');

// Lesson page
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 4000));
await page.screenshot({ path: OUT + 'lesson_check.png' });
console.log('lesson done');

await browser.close();
