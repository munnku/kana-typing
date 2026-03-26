# かなタイピング — プロジェクト定常情報

## プロジェクト概要
日本語ひらがなタイピング練習アプリ。Next.js 14 App Router + TypeScript + Tailwind CSS。

## 技術スタック
- **フレームワーク**: Next.js 14.2 (App Router)
- **言語**: TypeScript 5
- **スタイル**: Tailwind CSS 3.4（`darkMode: 'class'` 設定済み）
- **ライブラリ**: clsx, recharts, tailwind-merge
- **開発ツール**: Playwright（スクリーンショット検証用）

## 起動
```bash
npm run dev   # 開発サーバー（通常 localhost:3000、空いてなければ 3001, 3002 に移行）
npm run build # ビルド
npm run lint  # ESLint
```

## ディレクトリ構成
```
src/
  app/
    page.tsx              # ホーム（ダッシュボード）
    layout.tsx            # ルートレイアウト（ThemeProvider 含む）
    lessons/
      page.tsx            # レッスン一覧
      [id]/page.tsx       # レッスン実行画面
    results/[id]/page.tsx # レッスン結果画面
    test/page.tsx         # 自由タイピングテスト
    badges/page.tsx       # バッジ一覧
    settings/page.tsx     # 設定画面
  components/
    shared/
      Navbar.tsx          # ナビゲーションバー
      ThemeProvider.tsx   # テーマ・フォントサイズ初期化（localStorage → <html> クラス）
    dashboard/
      LessonCard.tsx      # レッスンカード（ロック・完了状態表示）
      UnitSection.tsx     # ユニットセクション
    lesson/
      InputCapture.tsx    # キーボード入力（window.addEventListener 使用）
    keyboard/
      HandDiagram.tsx     # 手の図（SVG、指ハイライト）
  data/
    lessons.ts            # 全レッスン定義（unit-0 〜 unit-19）
    keyboardLayout.ts     # キー→指マッピング、FINGER_COLORS
    romajiMap.ts          # かな→ローマ字変換テーブル
  hooks/
    useTypingEngine.ts    # タイピングロジック
    useTimer.ts           # タイマー
  lib/
    storage.ts            # localStorage 読み書き
    constants.ts          # 定数（BADGE_DEFINITIONS, DEFAULT_SETTINGS, STAR_THRESHOLDS 等）
    badges.ts             # バッジ評価ロジック
    metrics.ts            # KPM・正確率計算
  types/
    index.ts              # 全型定義
```

## ユニット一覧（unit-0 〜 unit-19）
| ID | タイトル |
|----|----------|
| unit-0 | Unit 0: ホームポジション |
| unit-1 | Unit 1: あ行 |
| unit-2 | Unit 2: か行 |
| unit-3 | Unit 3: さ行 |
| unit-4 | Unit 4: た行 |
| unit-5 | Unit 5: な行 |
| unit-6 | Unit 6: は行 |
| unit-7 | Unit 7: ま行 |
| unit-8 | Unit 8: や行・わ行・ん |
| unit-9 | Unit 9: ら行 |
| unit-10 | Unit 10: が行 |
| unit-11 | Unit 11: ざ行 |
| unit-12 | Unit 12: だ行 |
| unit-13 | Unit 13: ば行 |
| unit-14 | Unit 14: ぱ行 |
| unit-15 | Unit 15: きゃ行・しゃ行 |
| unit-16 | Unit 16: ちゃ行・にゃ行 |
| unit-17 | Unit 17: ひゃ・みゃ・りゃ行 |
| unit-18 | Unit 18: ぎゃ・じゃ・びゃ・ぴゃ行 |
| unit-19 | Unit 19: 記号 |
| unit-20 | Unit 20: 総合練習 |

> **注意**: `src/app/page.tsx` と `src/app/lessons/page.tsx` の両方に `UNIT_TITLES` 定数がある。変更時は両方更新すること。

## ダークモード
- Tailwind `darkMode: 'class'` → `<html>` に `dark` クラスで切替
- `ThemeProvider` が localStorage から設定を読んで起動時に適用
- フォントサイズも同様（`html.text-size-sm/md/lg` → globals.css）
- テーマは `light` / `dark` の2択（`blue` は廃止済み）

## localStorage キー
```
typing_app_progress  // UserProgress（XP, レベル, レッスン進捗, バッジ等）
typing_app_settings  // AppSettings（テーマ, フォントサイズ等）
typing_app_test_results
```

## 主要な型（src/types/index.ts）
- `Lesson` — レッスン定義
- `DisplayChar` — 表示用文字（state: pending/correct/error/corrected）
- `UserProgress` — localStorage 保存データ
- `AppSettings` — 設定（showKeyboard, showFingerGuide, fontSize, theme, romajiGuide）
- `SessionResult` — レッスン完了結果

## 開発方針・自動化フロー

### 目標
アプリ開発の全工程を Claude Code が自律的に進められる状態にする。

### 開発サイクル
```
要件定義（ユーザー）
    ↓
設計（Claude Code）
    ↓
実装（Claude Code）
    ↓         ←──────────────┐
テスト（自動）                │
    ↓                        │
改善（Claude Code）───────────┘
    ↓
finish
```

**特に「実装 → テスト → 改善」のサイクルを自律的に回すこと。**

### 現在の状態
プロトタイプ完成済み。以下が未整備：
- **UI**: プロ品質のデザイン（Figma MCP を活用）
- **セキュリティ**: Webアプリの脆弱性対策
- **テスト**: Playwright による E2E テスト自動化

### 実装後の必須チェック
実装が完了したら必ず以下を順番に実行すること：
```bash
npm run lint        # ESLint チェック
npx tsc --noEmit    # 型チェック
npm run build       # ビルドチェック
```
エラーが出たら自己修正してから完了とすること。

### ツール構成
- **UIデザイン**: Figma（Education プラン）+ Figma MCP
- **E2Eテスト**: Playwright（インストール済み）
- **アイコン**: lucide-react

### UI改善ルール
- デザイン見本は `stitch/stitch/` 内の各画面の `screen.png` を参照すること
- コードを直接書き換えてUI改善を行ってよい（ユーザーの事前承認不要）

### UIレビュー・改善サイクル（実装完了後に必ず実行）
実装が完了したら以下のサイクルを「完璧」と判断できるまで繰り返すこと：

```
1. lint + typecheck + build チェック
2. npx playwright test でE2Eテスト
3. screenshot.mjs でスクリーンショット撮影
4. stitch/stitch/*/screen.png と比較してギャップを特定
5. ギャップがあれば修正 → 1に戻る
6. 完璧と判断したら node scripts/notify-done.mjs で完了音を鳴らす
```

スクリーンショット撮影コマンド:
```bash
node screenshot.mjs
```
撮影した画像は `docs/screenshots/` に保存される。

---

## 既知の設計上の注意点
- `InputCapture` は `window.addEventListener('keydown')` を使用（div focus ではない）
  - 理由: ボタンクリック後に focus が失われてキー入力が止まる問題の対策
- SVG の描画順（HandDiagram）: 後から描いた要素が前面に来る（z-index 不要）
  - 左手: `LEFT_FINGERS` 配列で thumb を index の前に置き、index が thumb の上になるようにする
- `[...new Set([...])]` は TS ターゲット設定によりビルドエラーになる場合がある → `.filter()` で代替
- `src/app/layout.tsx` の `suppressHydrationWarning` を `<html>` に設定すること（テーマクラス動的変更のため）

---

## 🤖 Claude Code への引き継ぎメモ (Handover Context)
前任の Antigravity エージェントがユーザー就寝中に作業を行い、以下の進捗・ルールを設定しました。

### 新たに設定された厳格なルール (MUST DO):
1. **UI改善のサイクル**:
   UI実装後、必ず **`node screenshot.mjs` 等を用いてブラウザのスクリーンショットを撮り**、それを確認・評価してから次のステップ（改善または確定）に進むこと。この「実装→スクショ確認→改善」のサイクルは**毎回必ず**回すこと。
2. **ロジック変更のサイクル**:
   ロジック改修後、必ず自動テスト（および必要なら手動の動作確認プレビュー表示）を実施し、**バグがあれば直るまで徹底的に修正する**こと。壊れたまま放置しないこと。
3. **パフォーマンス対応**:
   Next.jsの初回ロードの遅延（特に開発サーバー）に対し、`loading.tsx` (Skeleton)の実装や、React Suspense、ダイナミックインポート(`next/dynamic`)で最適化を行いました。
4. **テストフィードバック画面**:
   `src/app/test/page.tsx` のUIを、`results/[id]/page.tsx` (レッスン用) と同じデザイン方針に統一しました。

これらを引き継ぎ、ユーザー起床後のさらなる指示（または更なるUI調整）に対応してください。
