'use client';
import { useState, useEffect, useCallback } from 'react';
import type { TutorialSlide } from '@/data/tutorialSlides';
import { HandDiagram } from '@/components/keyboard/HandDiagram';
import { KeyboardDiagram } from '@/components/keyboard/KeyboardDiagram';

interface TutorialSlideshowProps {
  slides: TutorialSlide[];
  onComplete: () => void;
}

export function TutorialSlideshow({ slides, onComplete }: TutorialSlideshowProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setIndex(i => i + 1);
    }
  }, [isLast, onComplete]);

  const handlePrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleNext(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onComplete(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, onComplete]);

  // 表示するビジュアルを決定：handKey/handKeys があれば手の図、keyboardKeys があればキーボード図
  const showHand = !!(slide.handKey || (slide.handKeys && slide.handKeys.length > 0));
  const showKeyboard = !showHand && !!slide.keyboardKeys && slide.keyboardKeys.length > 0;

  const hasVisual = showHand || showKeyboard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm px-4 py-4">
      <div
        className="glass-card rounded-2xl border border-[#464555]/20 shadow-2xl w-full animate-float flex flex-col"
        style={{
          maxWidth: hasVisual ? '820px' : '520px',
          maxHeight: 'calc(100vh - 32px)',
        }}
      >
        {/* スクロール可能な内部領域 */}
        <div className="overflow-y-auto flex-1 p-5">
          {/* ヘッダー：プログレスドット + スキップ */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-primary' : i < index ? 'w-3 bg-secondary/60' : 'w-3 bg-[#464555]/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onComplete}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5"
            >
              <div className="flex items-center gap-1">
                スキップ
                <span className="material-symbols-outlined text-sm">skip_next</span>
              </div>
              <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">ESC</span>
            </button>
          </div>

          {/* メインコンテンツ：テキスト + ビジュアル（横並び） */}
          <div className={`flex gap-5 ${hasVisual ? 'items-start' : 'flex-col items-start'}`}>

            {/* テキスト部分 */}
            <div className="flex-1 space-y-2 min-w-0">
              <h2 className="font-headline font-bold text-lg text-on-surface">{slide.title}</h2>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                {slide.body}
              </p>

              {/* ハイライトキーバッジ */}
              {slide.highlightKeys && slide.highlightKeys.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {slide.highlightKeys.map(key => (
                    <span
                      key={key}
                      className="px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/30 font-mono text-xs font-bold text-primary uppercase"
                    >
                      {key === ' ' ? 'Space' : key}
                    </span>
                  ))}
                </div>
              )}

              {/* 指ヒントテキスト */}
              {slide.fingerHint && (
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>back_hand</span>
                  <span className="font-label text-xs font-semibold">{slide.fingerHint}</span>
                </div>
              )}
            </div>

            {/* ビジュアル部分：手の図 + キーボード図を縦に並べる */}
            {hasVisual && (
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                {showHand && (
                  <>
                    {slide.handKeys && slide.handKeys.length > 0 ? (
                      <HandDiagram activeKey={null} activeKeys={slide.handKeys} large />
                    ) : slide.handKey ? (
                      <HandDiagram activeKey={slide.handKey} large />
                    ) : null}
                    {slide.keyboardKeys && slide.keyboardKeys.length > 0 && (
                      <div className="w-full">
                        <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40 mb-1 text-center">キーボード上の位置</p>
                        <KeyboardDiagram highlightKeys={slide.keyboardKeys} />
                      </div>
                    )}
                  </>
                )}
                {showKeyboard && slide.keyboardKeys && (
                  <KeyboardDiagram highlightKeys={slide.keyboardKeys} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* フッター：ナビゲーション（固定） */}
        <div className="px-5 pb-4 pt-2 border-t border-[#464555]/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="flex items-center gap-1 font-label text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              前へ
            </button>
            <button
              onClick={handleNext}
              className="gradient-primary px-7 py-2 rounded-full font-headline font-bold text-on-primary text-sm shadow-ambient hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              {isLast ? 'レッスン開始' : '次へ'}
              <span className="material-symbols-outlined text-sm">
                {isLast ? 'play_arrow' : 'arrow_forward'}
              </span>
            </button>
          </div>
          <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40 text-center mt-1">
            Space / Enter キーで次へ進めます
          </p>
        </div>
      </div>
    </div>
  );
}
