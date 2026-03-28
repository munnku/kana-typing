'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot?: string;          // 将来のAdSense用（現在は未使用）
  format?: 'vertical';
  className?: string;
}

/**
 * 忍者AdMax 広告ユニット
 * AdSense審査通過後はこのコンポーネントをAdSense版に切り替える
 */
export function AdUnit({ format = 'vertical', className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    const script = document.createElement('script');
    script.src = 'https://adm.shinobi.jp/s/a50306ded28a8f8d06fc294e586e021e';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center rounded-xl ${
        format === 'vertical' ? 'w-[160px] min-h-[600px]' : 'w-full min-h-[90px]'
      } ${className}`}
    />
  );
}
