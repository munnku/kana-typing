# タイピングアプリ 開発ロードマップ
作成日: 2026-03-24

---

## 全体の開発フロー（目標）

```
要件定義 → 設計 → 実装 → テスト → 改善 → finish
                          ↑__________↓（サイクル）
```

現状: **プロトタイプ完成済み** → 次は「実装→テスト→改善」のサイクルを回す段階

---

## Phase 1: UI刷新（プロ品質のデザインへ）

### 方針
- **Google Stitch** でUIデザインを自動生成 → Claude Codeで実装
- または **Figma** テンプレート + MCP連携で忠実再現
- スタイル: モダンミニマリズム + ゲーミフィケーション（Duolingo風）
- カラー: オフホワイト背景 / インディゴアクセント

### 具体的な手順（Stitchルート・無料）
1. [stitch.withgoogle.com](https://stitch.withgoogle.com) にアクセス（Googleアカウントでログイン）
2. 「Web」を選んでタイピングアプリのUIを生成
3. 各画面（ダッシュボード、レッスン、結果、バッジ）を生成・調整
4. 「Copy as code」でコードをコピー → `docs/` に保存
5. Claude Codeに実装させる

### 具体的な手順（Figmaルート・月3,000円）
1. Figma有料プランに加入
2. Figmaデスクトップアプリ → ローカルMCPサーバーを有効化
3. `claude mcp add figma --sse http://127.0.0.1:3845/sse` でMCP接続
4. Figma Communityで `landing page` `SaaS` などのテンプレートを探す
5. デザインリンクをClaude Codeに渡して実装

### 使うパッケージ
```bash
npm install lucide-react          # アイコン
npx shadcn@latest init            # UIコンポーネント基盤
npx shadcn@latest add button card badge progress
```

---

## Phase 2: セキュリティ対策

### WebアプリのよくあるセキュリティリスクとTypingアプリでの対策

| リスク | 内容 | Typingアプリでの対策 |
|--------|------|---------------------|
| XSS（クロスサイトスクリプティング） | ユーザー入力をそのままHTMLに表示 | Reactは基本的に自動エスケープ。`dangerouslySetInnerHTML` を使わない |
| localStorage への過信 | データを安易に信用・使用 | バリデーションを追加（型チェック） |
| 依存パッケージの脆弱性 | npmパッケージに含まれる既知の脆弱性 | `npm audit` を定期的に実行 |
| 無制限のAPIコール | 将来的にAPIを使う場合 | レートリミット・入力サニタイズ |
| 情報の過剰露出 | エラーメッセージに内部情報が含まれる | エラー内容をユーザーに見せすぎない |

### 今すぐできること
```bash
npm audit          # 脆弱性チェック
npm audit fix      # 自動修正可能なものを修正
```

### 今後調査・対応すること
- Content Security Policy (CSP) ヘッダーの設定
- Vercelへのデプロイ時のHTTPSの確認
- 将来的にユーザー認証を追加する場合 → NextAuth.js の採用

---

## Phase 3: テスト自動化

### テストの種類（初心者向け解説）

| 種類 | 何をテストするか | ツール |
|------|-----------------|--------|
| **ユニットテスト** | 関数・ロジック単体（例: KPM計算が正しいか） | Vitest / Jest |
| **コンポーネントテスト** | UIコンポーネントが正しく表示されるか | Testing Library |
| **E2Eテスト（統合テスト）** | ブラウザ上での実際の操作をシミュレート | Playwright（すでにセットアップ済み） |

### このプロジェクトに入れたいテスト

#### 優先度高
- `useTypingEngine.ts` のロジックテスト（ユニットテスト）
  - 正しいキー入力で文字が進むか
  - 間違いの場合にエラー状態になるか
  - KPM・正確率の計算が正しいか
- `storage.ts` のテスト
  - 保存・読み込みが正しく動くか

#### 優先度中
- 各ページのスモークテスト（ページが正常に表示されるか）
- Playwrightでレッスン開始→完了の流れをE2Eテスト

### テスト導入手順
```bash
# Vitestのセットアップ
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# vitest.config.ts を作成してClaude Codeに設定させる
# package.jsonに "test": "vitest" を追加
```

---

## Phase 4: 実装→テスト→改善 サイクル

### 自動化フロー（目指す状態）

```
1. Claude Codeが実装
2. npm run test → テスト実行（自動）
3. Playwright → E2Eテスト実行（自動）
4. npm run build → ビルドエラーチェック（自動）
5. 問題があればClaude Codeが修正
6. 繰り返し
```

### 今すぐ始められる改善サイクル
```bash
npm run dev    # 開発サーバー起動
npm run build  # ビルドチェック
npm run lint   # ESLintチェック
```

---

## 優先順位まとめ

| 優先度 | タスク | 工数目安 |
|--------|--------|---------|
| ★★★ | Phase 1: UI刷新（Stitchで設計→実装） | 数日 |
| ★★★ | Phase 3: Vitestでユニットテスト追加 | 1日 |
| ★★☆ | Phase 2: npm audit + CSP設定 | 半日 |
| ★★☆ | Phase 4: 自動テストサイクル確立 | 1〜2日 |
| ★☆☆ | Figma MCP連携（有料プラン必要） | オプション |

---

## 参考ノート（Obsidian）
- `ノート/コンテンツ制作/stitch_beginner_guide.md` — Google Stitchの使い方
- `ノート/Claude Code/figma_claude_code_website_guide.md` — Figma MCPでUI実装
- `ノート/Claude Code/claude_code_nano_banana_premium_website_guide.md` — 高品質サイト構築
- `docs/ui-research.md` — UIトレンド調査メモ
