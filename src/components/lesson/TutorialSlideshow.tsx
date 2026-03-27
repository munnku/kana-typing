'use client';
import { useState, useEffect, useCallback } from 'react';
import type { TutorialSlide } from '@/data/tutorialSlides';

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

  // Enterキーで次へ進む
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm px-4">
      <div className="glass-card rounded-2xl border border-[#464555]/20 shadow-2xl max-w-lg w-full p-8 space-y-6 animate-float">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-6 bg-primary'
                    : i < index
                    ? 'w-3 bg-secondary/60'
                    : 'w-3 bg-[#464555]/30'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onComplete}
            className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            スキップ
            <span className="material-symbols-outlined text-sm">skip_next</span>
          </button>
        </div>

        {/* スライド本文 */}
        <div className="space-y-4 min-h-[140px]">
          <h2 className="font-headline font-bold text-2xl text-on-surface">{slide.title}</h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
            {slide.body}
          </p>

          {/* ハイライトキー表示 */}
          {slide.highlightKeys && slide.highlightKeys.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {slide.highlightKeys.map(key => (
                <span
                  key={key}
                  className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 font-mono text-sm font-bold text-primary uppercase"
                >
                  {key === ' ' ? 'Space' : key}
                </span>
              ))}
            </div>
          )}

          {/* 指のヒント */}
          {slide.fingerHint && (
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>back_hand</span>
              <span className="font-label text-xs font-semibold">{slide.fingerHint}</span>
            </div>
          )}
        </div>

        {/* ナビゲーション */}
        <div className="flex items-center justify-between pt-2">
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
            className="gradient-primary px-8 py-3 rounded-full font-headline font-bold text-on-primary text-sm shadow-ambient hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            {isLast ? 'レッスン開始' : '次へ'}
            <span className="material-symbols-outlined text-sm">
              {isLast ? 'play_arrow' : 'arrow_forward'}
            </span>
          </button>
        </div>

        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 text-center">
          Enter キーでも次へ進めます
        </p>
      </div>
    </div>
  );
}
