# Monolith Pro: User Flow & Sitemap
> Stitch で作成したUIの遷移図
> 作成日: 2026-03-24

---

## 1. 認証・エントリー

- **SCREEN_33** ログイン画面（エントリーポイント）
  - 「Start as Guest」→ SCREEN_7 ダッシュボード
  - 「Continue with Google」/「Sign In」→ SCREEN_7 ダッシュボード

---

## 2. メインナビゲーション

- **SCREEN_7** Refined Dashboard（ホーム）
  - 「Practiceを再開する」→ SCREEN_14 練習セッション（最後の未完了レッスン）
  - サイドバー: Lessons / Statistics / Settings に遷移

- **SCREEN_27** Japanese Typing Curriculum（レッスン一覧）
  - レッスン選択 → SCREEN_14 練習セッション

- **SCREEN_32** Statistics（統計・成績）

- **SCREEN_5** Settings（設定）
  - テーマ（Dark/Light）
  - テキストサイズ
  - オーディオ（マスター/個別）
  - 入力方式

---

## 3. 学習フロー（練習）

- **SCREEN_14** Final Perfected Practice Session v4（タイピング画面）
  - 集中モード（最小限UI）
  - 完了 → SCREEN_26 レッスンフィードバック

- **SCREEN_26** Lesson Feedback（結果画面）
  - 「Next Lesson」→ SCREEN_14 次のレッスン
  - 「Try Again」→ SCREEN_14 同じレッスン再挑戦
  - 「Back to Lessons」→ SCREEN_27 レッスン一覧

---

## 4. 競技フロー（タイムドテスト）

- **SCREEN_3** Test Selection（テスト選択）
  - 1分 / 2分 / 3分 から選択
  - 「Start Test」→ SCREEN_23 タイムドテスト

- **SCREEN_23** Timed Test Session（タイムドテスト画面）
  - タイマーが 00:00 → 自動で SCREEN_24 テスト結果へ

- **SCREEN_24** Refined Test Results（テスト結果）
  - 「Try Again」→ SCREEN_23 テスト再挑戦
  - 「Back to Menu」→ SCREEN_3 テスト選択

---

## 画面一覧

| ID | 画面名 |
|----|--------|
| SCREEN_3 | Test Selection |
| SCREEN_5 | Settings |
| SCREEN_7 | Refined Dashboard |
| SCREEN_14 | Practice Session (v4) |
| SCREEN_23 | Timed Test Session |
| SCREEN_24 | Refined Test Results |
| SCREEN_26 | Lesson Feedback |
| SCREEN_27 | Japanese Typing Curriculum |
| SCREEN_32 | Statistics |
| SCREEN_33 | Login Screen |
