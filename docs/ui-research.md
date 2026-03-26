# UIデザイン調査メモ
調査日: 2026-03-21

---

## 1. 現在のトレンド概観（2025年）

- **進化したミニマリズム**: 白/オフホワイト背景、薄いボーダー、意図的な余白。84.6%のユーザーがクリーンなレイアウトを好む。
- **Bento Grid**: コンテンツをモジュール化したグリッドレイアウト。Apple・Notion・Vercel が採用。ダッシュボード系に特に有効。
- **Bold Typography**: 文字自体をビジュアル要素として扱う。Variable Fonts の活用。
- **Subtle Motion**: ピンポイントのマイクロインタラクション（ホバー、フォーカス時のみ）。
- **Light Glassmorphism**: `bg-white/60 backdrop-blur-md` で控えめに使うのが 2025 年のスタンダード。過剰使用は「古く見える」と嫌われる。

---

## 2. 参考サービス・サイト一覧

| サービス | 特徴 | 参考にすべき点 |
|---------|------|--------------|
| **Duolingo** | ゲーミフィケーション学習の王道。XP・ストリーク・バッジが強力 | レッスンカード、進捗表示、達成感の演出 |
| **Notion** | 超シンプル。余白と文字サイズの使い方が教科書的 | カード・セクション構成、カラーの抑え方 |
| **Linear** | 開発ツール。ダークでもライトでも洗練されたUI | アニメーションの滑らかさ、状態遷移 |
| **Unsplash** | 写真サイトだが、ホワイトベースのグリッドが美しい | カードの影の使い方、ホバーエフェクト |
| **Vercel Dashboard** | Bento Grid の代表例。情報密度と美しさの両立 | ダッシュボードのレイアウト |
| **Clerk** | 認証UIの参考。爽やかなライト系デザイン | フォーム・入力周りのデザイン |

---

## 3. 手法別まとめ

### 手法 1: モダンミニマリズム（★★★★★ 推奨）

**特徴:**
- 白〜オフホワイト背景（`#FAFAFA` / `#F8F9FA`）
- アクセントカラーを1色に絞る（インディゴ / スカイブルー / エメラルド）
- 余白を広くとり、カードは薄いボーダー＋微妙な影
- フォントは太さで階層を表現（Regular / Semibold / Bold）

**Tailwind + Next.js での実装アプローチ:**
```tsx
// カードの基本スタイル
className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"

// アクセントボタン
className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-semibold transition-colors"

// セクションタイトル
className="text-2xl font-bold text-gray-900"
```

**参考リンク:**
- Notion (notion.so)
- Clerk (clerk.com)

**人々の評判:**
- Reddit r/web_design: 「クリーンなミニマリズムは5年後も古く見えない」
- Zenn: 「shadcn/ui を使えば8割がた完成する」

---

### 手法 2: Bento Grid（★★★★☆ ダッシュボードに特に有効）

**特徴:**
- 不規則なグリッドで情報をモジュール化
- 各カードが独立したウィジェット
- サイズ差（大・中・小）で視覚的な重みづけ

**Tailwind + Next.js での実装アプローチ:**
```tsx
// Bento Grid コンテナ
className="grid grid-cols-3 gap-4 auto-rows-[180px]"

// 大きいカード（2列×2行）
className="col-span-2 row-span-2 bg-white rounded-2xl border border-gray-100 p-6"

// 小カード（1列×1行）
className="col-span-1 row-span-1 bg-indigo-50 rounded-2xl p-4"
```

**参考リンク:**
- Vercel Dashboard
- Apple WWDC サイト

**人々の評判:**
- X (Twitter): 「2024〜2025 のダッシュボードデザインはほぼ Bento」
- Reddit: 「情報密度を保ちながらおしゃれに見える唯一の方法」

---

### 手法 3: Duolingo 風ゲーミフィケーション（★★★★★ 学習アプリに最適）

**特徴:**
- XP・レベル・バッジ・ストリークを前面に出す
- カラーコードされた達成状態（ロック=グレー、完了=グリーン、挑戦中=ブルー）
- 星評価・プログレスバーが常に見える
- 達成時のエフェクト（控えめな光・色変化）

**Tailwind + Next.js での実装アプローチ:**
```tsx
// 星評価バッジ
className="flex gap-1 text-yellow-400"  // ★★★

// XPバー
className="h-2 bg-gray-100 rounded-full overflow-hidden"
// 内側: className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"

// ロック状態カード
className="opacity-50 grayscale cursor-not-allowed"

// 完了状態カード
className="border-2 border-green-300 bg-green-50"
```

**参考リンク:**
- Duolingo (duolingo.com)

**人々の評判:**
- Reddit r/LearnJapanese: 「Duolingo の UI は継続のモチベを上げる設計になってる」
- 学習アプリ研究: 「XP可視化だけでリテンションが 20-30% 向上」

---

### 手法 4: shadcn/ui ベース（★★★★☆ 実装コスト最小）

**特徴:**
- Radix UI + Tailwind ベースのコンポーネント集
- コードをコピーして自プロジェクトに取り込む形式（依存ゼロ）
- WCAG アクセシビリティ準拠済み
- ライト・ダーク両対応

**Tailwind + Next.js での実装アプローチ:**
```bash
npx shadcn@latest init
npx shadcn@latest add button card badge progress
```

**参考リンク:**
- ui.shadcn.com

**人々の評判:**
- Zenn 2024-2025 で最も言及されるUIライブラリ
- Reddit: 「shadcn を使わない理由がない」
- X: 「2025年の Next.js プロジェクトのデファクトスタンダード」

---

### 手法 5: Framer Motion によるマイクロインタラクション（★★★☆☆ アニメーション補完）

**特徴:**
- ホバー・フォーカス・マウント時のアニメーション
- スプリングアニメーションで自然な動き
- Tailwind の `transition-*` より表現力が高い

**Tailwind + Next.js での実装アプローチ:**
```tsx
import { motion } from "framer-motion"

// カードホバー
<motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>

// フェードイン
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
```

**参考リンク:**
- framer.com/motion

**人々の評判:**
- Reddit: 「Tailwind + Framer Motion が 2025 年のアニメーションスタック」
- Zenn: 「控えめに使えば一気に高級感が出る」

---

## 4. 今回のタイピングアプリに最もおすすめの手法

### 推奨: **モダンミニマリズム + Duolingo 風ゲーミフィケーション**

**理由:**
1. タイピング中は視覚的ノイズを最小化したい → ミニマリズムが合う
2. XP・バッジ・星評価が既にある → ゲーミフィケーション演出を強化するだけ
3. ダッシュボードには Bento Grid を部分採用できる
4. shadcn/ui で実装コストを下げ、Framer Motion は控えめに補完

**カラーパレット案:**
- 背景: `#FAFAFA`（オフホワイト）
- カード: `#FFFFFF` + `border-gray-100` + `shadow-sm`
- プライマリ: Indigo `#6366F1`（インディゴ）
- 成功: Emerald `#10B981`
- 警告/星: Amber `#F59E0B`
- テキスト: `#111827`（ほぼ黒）/ `#6B7280`（サブテキスト）

---

## 5. 使用するパッケージ候補

| パッケージ | 用途 | 優先度 |
|-----------|------|--------|
| `shadcn/ui` | UIコンポーネント基盤 | ★★★（高） |
| `lucide-react` | アイコン | ★★★（高） |
| `framer-motion` | マイクロアニメーション | ★★☆（中） |
| `@fontsource/noto-sans-jp` | 日本語フォント | ★★☆（中） |
| `class-variance-authority` | shadcn/ui の依存 | 自動インストール |

---

## 6. 実装時の注意点

1. **フォント**: `Noto Sans JP` を Google Fonts から `next/font` 経由で読み込む（layout.tsx）
2. **shadcn/ui の初期化**: `npx shadcn@latest init` で既存の Tailwind 設定を上書きしないよう注意
3. **カラートークン**: shadcn の CSS 変数（`--primary` 等）とカスタムカラーを混在させない
4. **ダークモード**: 既存の `darkMode: 'class'` 設定を shadcn に引き継ぎ可能
5. **アニメーション**: `prefers-reduced-motion` への対応（アクセシビリティ）
6. **Tailwind の purge**: shadcn コンポーネントのクラスが消えないよう `content` パスを確認

---

*調査完了: 2026-03-21*
