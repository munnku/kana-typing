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
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.evaluate(() => {
  localStorage.setItem('typing_app_settings', JSON.stringify({
    showKeyboard: true, showFingerGuide: true, soundEnabled: false,
    fontSize: 'md', theme: 'dark', romajiGuide: 'always'
  }));
  document.documentElement.classList.add('dark');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

// Skip tutorial with Enter
await page.keyboard.press('Enter');
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: OUT + 'lesson_after_tutorial.png' });
console.log('lesson after tutorial done');

// Type a char to start
await page.keyboard.press('a');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: OUT + 'lesson_typing.png' });
console.log('lesson typing done');

// Test page - check key input works
await page.goto('http://localhost:3000/test', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.keyboard.press('Enter');
await new Promise(r => setTimeout(r, 1500));
// Try typing
for (const key of ['a', 'i', 'u']) {
  await page.keyboard.press(key);
  await new Promise(r => setTimeout(r, 200));
}
await page.screenshot({ path: OUT + 'test_typing2.png' });
console.log('test typing2 done');

await browser.close();
