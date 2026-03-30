'use client';

interface AdUnitProps {
  slot?: string;
  format?: 'vertical';
  className?: string;
}

/**
 * 忍者AdMax 広告表示枠
 * 広告スクリプトは layout.tsx の <Script> で読み込み済み
 * 忍者AdMaxはdocument.writeで広告をページ直接挿入するため、
 * このコンポーネントは視覚的な枠のみ提供する
 */
export function AdUnit({ format = 'vertical', className = '' }: AdUnitProps) {
  return (
    <div className={`flex items-center justify-center rounded-xl bg-surface-container/30 ${
      format === 'vertical' ? 'w-[160px] min-h-[600px]' : 'w-full min-h-[90px]'
    } ${className}`} />
  );
}
