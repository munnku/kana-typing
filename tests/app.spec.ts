import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────
// ホーム画面
// ─────────────────────────────────────────────
test.describe('ホーム画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kinetic|かな|タイピング/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('ナビゲーションバーが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('レッスンへのリンクが存在する', async ({ page }) => {
    await page.goto('/');
    const lessonLink = page.locator('a[href="/lessons"]');
    await expect(lessonLink.first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// レッスン一覧画面
// ─────────────────────────────────────────────
test.describe('レッスン一覧', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/lessons');
    await expect(page.locator('main')).toBeVisible();
  });

  test('Unit 0 が表示される', async ({ page }) => {
    await page.goto('/lessons');
    await expect(page.getByText('ホームポジション')).toBeVisible();
  });

  test('最初のレッスンカードがクリックできる', async ({ page }) => {
    await page.goto('/lessons');
    const firstLesson = page.locator('a[href*="/lessons/u0"]').first();
    await expect(firstLesson).toBeVisible();
    await firstLesson.click();
    await expect(page).toHaveURL(/\/lessons\/u0/);
  });
});

// ─────────────────────────────────────────────
// レッスン実行画面
// ─────────────────────────────────────────────
test.describe('レッスン実行', () => {
  test('レッスン画面が表示される', async ({ page }) => {
    await page.goto('/lessons/u0-l01');
    await expect(page.locator('main')).toBeVisible();
  });

  test('タイピングテキストが表示される', async ({ page }) => {
    await page.goto('/lessons/u0-l01');
    // テキスト表示エリアが存在する
    await expect(page.locator('main')).toContainText(/[jf]/);
  });

  test('キー入力が受け付けられる', async ({ page }) => {
    await page.goto('/lessons/u0-l01');
    await page.waitForTimeout(1000);
    await page.keyboard.press('j');
    // エラーなく続行できる（クラッシュしない）
    await expect(page.locator('main')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// テスト画面
// ─────────────────────────────────────────────
test.describe('自由タイピングテスト', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/test');
    await expect(page.locator('main')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// バッジ画面
// ─────────────────────────────────────────────
test.describe('バッジ画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/badges');
    await expect(page.locator('main')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 設定画面
// ─────────────────────────────────────────────
test.describe('設定画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('main')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// ナビゲーション（画面遷移）
// ─────────────────────────────────────────────
test.describe('ナビゲーション', () => {
  test('ホーム → レッスン一覧 に遷移できる', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/lessons"]').first().click();
    await expect(page).toHaveURL('/lessons');
  });

  test('存在しないページで404が表示される', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
