'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;           // Google AdSense スロットID
  format?: 'vertical';   // 縦長広告（160×600）
  className?: string;
}

/**
 * Google AdSense 広告ユニット（縦長）
 * AdSense 未承認時はプレースホルダーを表示。
 * slot に AdSense スロットIDを渡すと本番広告が表示されます。
 *
 * 設定方法:
 * 1. next.config.mjs の CSP に AdSense ドメインを追加
 * 2. src/app/layout.tsx に AdSense スクリプトタグを追加
 * 3. このコンポーネントの slot prop に取得したスロットIDを設定
 */
export function AdUnit({ slot, format = 'vertical', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  // AdSense が未設定の場合はプレースホルダー表示
  const isAdSenseReady = typeof window !== 'undefined' &&
    typeof (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle !== 'undefined';

  useEffect(() => {
    if (!initialized.current && isAdSenseReady && slot) {
      try {
        ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle =
          (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
        initialized.current = true;
      } catch {
        // AdSense not loaded yet
      }
    }
  }, [isAdSenseReady, slot]);

  if (!slot || slot === 'PLACEHOLDER') {
    // プレースホルダー（開発時・AdSense未申請時）
    return (
      <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#464555]/30 bg-surface-container text-center p-4 ${
        format === 'vertical' ? 'w-[160px] h-[600px]' : 'w-full h-24'
      } ${className}`}>
        <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2">ad_units</span>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/30">広告</p>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'inline-block',
        width: '160px',
        height: '600px',
      }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // TODO: AdSense パブリッシャーIDに置き換え
      data-ad-slot={slot}
      data-ad-format="auto"
    />
  );
}
