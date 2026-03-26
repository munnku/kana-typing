import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const OUT = 'C:\\temp\\';

// Launch non-headless so the browser actually connects and compiles pages
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1280, height: 900 },
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1280,900',
    '--window-position=0,0',
  ]
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function setTheme(theme, fontSize = 'md') {
  await page.evaluate((t, fs) => {
    localStorage.setItem('typing_app_settings', JSON.stringify({
      showKeyboard: true, showFingerGuide: true, soundEnabled: false,
      fontSize: fs, theme: t, romajiGuide: 'always'
    }));
  }, theme, fontSize);
}

async function waitForAppLoad(timeout = 15000) {
  try {
    await page.waitForFunction(() => {
      // Wait until the 404 error is gone
      const err = document.querySelector('.next-error-h1');
      if (err) return false;
      // Wait for real content in main
      const main = document.querySelector('main');
      return main && main.innerText.trim().length > 10;
    }, { timeout });
  } catch(e) {
    console.log('  waitForAppLoad timeout - continuing');
  }
  await wait(500);
}

async function gotoAndWait(url) {
  console.log(`  Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForAppLoad();
}

// ===== LIGHT MODE =====
console.log('Setting up light mode...');
// First visit to bootstrap
await page.goto('http://localhost:3000/settings', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(4000); // Wait for JS to load and hydrate

// Set light theme
await setTheme('light');

// Screenshot settings (light)
await page.screenshot({ path: OUT + 'settings_light_pp.png' });
console.log('settings_light done');

// Navigate to home - use Next.js Link click
await page.click('a[href="/"]');
await wait(4000);
await page.screenshot({ path: OUT + 'home_light_pp.png' });
console.log('home_light done');

// Navigate to lessons
await page.click('a[href="/lessons"]');
await wait(4000);
await page.screenshot({ path: OUT + 'lessons_light_pp.png' });
console.log('lessons_light done');

// Navigate to a specific lesson via URL
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(5000);
await page.screenshot({ path: OUT + 'lesson_detail_light_pp.png' });
console.log('lesson_detail_light done');

// ===== DARK MODE =====
console.log('Switching to dark mode...');
await page.goto('http://localhost:3000/settings', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(4000);

await setTheme('dark');
await page.evaluate(() => {
  document.documentElement.classList.add('dark');
});
await page.screenshot({ path: OUT + 'settings_dark_pp.png' });
console.log('settings_dark done');

// Navigate home (dark)
await page.click('a[href="/"]');
await wait(4000);
await page.screenshot({ path: OUT + 'home_dark_pp.png' });
console.log('home_dark done');

// Navigate lessons (dark)
await page.click('a[href="/lessons"]');
await wait(4000);
await page.screenshot({ path: OUT + 'lessons_dark_pp.png' });
console.log('lessons_dark done');

// Lesson detail (dark)
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(5000);
await page.screenshot({ path: OUT + 'lesson_detail_dark_pp.png' });
console.log('lesson_detail_dark done');

// ===== FONT SIZE LARGE =====
console.log('Testing font size large...');
await page.goto('http://localhost:3000/settings', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(4000);
await setTheme('light', 'lg');
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
  document.documentElement.classList.add('text-size-lg');
});
await page.goto('http://localhost:3000/lessons/u1-l01', { waitUntil: 'domcontentloaded', timeout: 30000 });
await wait(5000);
await page.screenshot({ path: OUT + 'lesson_detail_fontlg_pp.png' });
console.log('lesson_detail_fontlg done');

await browser.close();
console.log('All screenshots done!');
