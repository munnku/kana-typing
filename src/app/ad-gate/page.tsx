'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdUnit } from '@/components/ads/AdUnit';
import { useBgm } from '@/hooks/useBgm';

const AD_SLOT = 'PLACEHOLDER';

function AdGateContent() {
  useBgm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get('dest') ?? '/lessons';
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setReady(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleContinue = () => {
    router.push(destination);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-8">
      <div className="fixed top-0 right-0 -z-10 w-80 h-80 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* ヘッダー */}
      <div className="text-center">
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">もうすぐ始まります</p>
        <h1 className="font-headline font-bold text-2xl text-on-surface">広告を表示中です</h1>
        <p className="font-body text-sm text-on-surface-variant mt-2">このアプリは広告収入で無料提供されています。</p>
      </div>

      {/* 広告 */}
      <div className="flex justify-center">
        <AdUnit slot={AD_SLOT} format="vertical" />
      </div>

      {/* カウントダウン & ボタン */}
      <button
        onClick={handleContinue}
        disabled={!ready}
        className={`px-10 py-4 rounded-full font-headline font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
          ready
            ? 'gradient-primary text-on-primary shadow-ambient hover:shadow-glow hover:scale-105 active:scale-95'
            : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
        }`}
      >
        {ready ? (
          <>
            レッスンを始める
            <span className="material-symbols-outlined">play_arrow</span>
          </>
        ) : (
          <>
            <span className="font-mono">{countdown}</span>
            秒後に進めます
          </>
        )}
      </button>
    </div>
  );
}

export default function AdGatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-on-surface-variant">読み込み中...</p></div>}>
      <AdGateContent />
    </Suspense>
  );
}
