'use client';
import { AdUnit } from './AdUnit';

/**
 * レッスン・テスト・フィードバック画面用の広告レイアウトラッパー
 * PC: 左右に縦長広告（160×600）を表示
 * モバイル: 広告非表示（モバイルは /ad-gate 経由でレッスンに入る）
 *
 * AdSense スロットIDは環境変数または定数から取得してください。
 * 現在はプレースホルダーを表示します。
 */

// TODO: AdSenseスロットIDが取得できたらここに設定する
const AD_SLOT_LEFT = 'PLACEHOLDER';
const AD_SLOT_RIGHT = 'PLACEHOLDER';

interface AdSideLayoutProps {
  children: React.ReactNode;
}

export function AdSideLayout({ children }: AdSideLayoutProps) {
  return (
    <div className="flex items-start justify-center gap-4 w-full">
      {/* 左サイド広告 — PC のみ表示 */}
      <div className="hidden xl:flex flex-col items-center pt-16 flex-shrink-0">
        <AdUnit slot={AD_SLOT_LEFT} format="vertical" />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0 w-full">
        {children}
      </div>

      {/* 右サイド広告 — PC のみ表示 */}
      <div className="hidden xl:flex flex-col items-center pt-16 flex-shrink-0">
        <AdUnit slot={AD_SLOT_RIGHT} format="vertical" />
      </div>
    </div>
  );
}
