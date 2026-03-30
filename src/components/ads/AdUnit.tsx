'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'vertical';
  className?: string;
}

const SHINOBI_SCRIPT = 'https://adm.shinobi.jp/s/a50306ded28a8f8d06fc294e586e021e';

/**
 * 忍者AdMax 広告ユニット
 * srcdocを使ったiframe埋め込み方式（document.write対応）
 */
export function AdUnit({ format = 'vertical', className = '' }: AdUnitProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:transparent;overflow:hidden;"><script src="${SHINOBI_SCRIPT}"><\/script></body></html>`);
    doc.close();
  }, []);

  return (
    <div className={`flex items-center justify-center rounded-xl ${
      format === 'vertical' ? 'w-[160px] min-h-[600px]' : 'w-full min-h-[90px]'
    } ${className}`}>
      <iframe
        ref={iframeRef}
        width={format === 'vertical' ? 160 : '100%'}
        height={format === 'vertical' ? 600 : 90}
        style={{ border: 'none' }}
        scrolling="no"
        title="advertisement"
      />
    </div>
  );
}
