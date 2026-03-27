'use client';
import { clsx } from 'clsx';
import { HandDiagram } from '@/components/keyboard/HandDiagram';
import type { DisplayChar } from '@/types';

interface TypingScreenProps {
  chars: DisplayChar[];
  visibleLines: { start: number; end: number }[];
  visibleLineStart: number;
  cursorIndex: number;
  partialRomaji: string;
  status: 'idle' | 'active' | 'complete' | 'done' | 'paused';
  // Header
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;
  // Top bar
  topBarPct: number;
  topBarColor?: string;
  // Stats bar (shown when active)
  statsBar?: React.ReactNode;
  // Settings
  showFingerGuide: boolean;
  showRomajiGuide: boolean;
  activeKey: string | null;
  // Idle hint
  idleHint?: string;
}

export function TypingScreen({
  chars,
  visibleLines,
  visibleLineStart,
  cursorIndex,
  status,
  headerLeft,
  headerRight,
  topBarPct,
  topBarColor,
  statsBar,
  showFingerGuide,
  showRomajiGuide,
  activeKey,
  idleHint,
}: TypingScreenProps) {
  const barColor = topBarColor ?? (status === 'idle' ? 'bg-secondary shadow-glow-green' : 'bg-secondary shadow-glow-green');

  return (
    <div className="flex flex-col bg-surface overflow-hidden" style={{ height: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, #131b2e 0%, #0b1326 100%)' }} />

      {/* Top bar */}
      <div className="fixed top-0 left-20 right-0 h-1 z-50">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${topBarPct}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex-none flex justify-between items-center px-8 py-4 pt-5">
        <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          {headerLeft}
        </div>
        <div className="flex items-center gap-6">
          {headerRight}
        </div>
      </header>

      {/* Stats bar */}
      {statsBar && (
        <div className="flex-none flex justify-center gap-8 py-1">
          {statsBar}
        </div>
      )}

      {/* Typing area */}
      <div className="flex-none flex flex-col items-center px-6 py-4">
        <div className="relative w-full max-w-3xl text-center px-8 rounded-2xl glass-surface border border-[#464555]/5 py-6">
          <div className="w-full max-w-2xl mx-auto space-y-3">
            {visibleLines.map((line, lineIdx) => (
              <div
                key={visibleLineStart + lineIdx}
                className={`flex flex-nowrap gap-1 font-mono justify-center min-h-[4rem] overflow-hidden ${lineIdx > 0 ? 'opacity-30' : ''}`}
              >
                {chars.slice(line.start, line.end + 1).map((char, i) => {
                  const absIdx = line.start + i;
                  const isCurrent = absIdx === cursorIndex;
                  if (char.kana === ' ') return <span key={absIdx} className="w-4 inline-block" />;
                  return (
                    <span key={absIdx} className="inline-flex flex-col items-center relative">
                      <span className={clsx('text-4xl px-1 rounded-xl transition-colors duration-75', {
                        'bg-[#1a3a2a] text-[#7fffb8] relative': isCurrent && char.state !== 'error',
                        'bg-error-container text-error': char.state === 'error',
                        'text-secondary': char.state === 'correct',
                        'text-on-surface-variant/40': char.state === 'pending',
                        'text-tertiary': char.state === 'corrected',
                      })}>
                        {char.kana}
                        {isCurrent && char.state !== 'error' && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-secondary animate-caret-blink rounded-full shadow-glow-green" />
                        )}
                      </span>
                      {showRomajiGuide && (
                        <span className={clsx('text-xs font-mono mt-1', {
                          'text-[#7fffb8] font-bold': isCurrent,
                          'text-secondary/60': char.state === 'correct',
                          'text-error': char.state === 'error',
                          'text-on-surface-variant/30': char.state === 'pending',
                        })}>
                          {isCurrent && char.typedRomaji
                            ? <><span className="text-white font-bold">{char.typedRomaji}</span><span className="text-[#7fffb8]/70">{char.displayRomaji.slice(char.typedRomaji.length)}</span></>
                            : char.displayRomaji
                          }
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {status === 'idle' && idleHint && (
            <p className="text-on-surface-variant/60 text-xs font-label uppercase tracking-[0.3em] mt-4 animate-pulse">
              {idleHint}
            </p>
          )}
        </div>
      </div>

      {/* Hand diagram */}
      <div className="flex-1 flex items-center justify-center min-h-0 pb-4">
        {showFingerGuide && activeKey ? (
          <HandDiagram activeKey={activeKey} large />
        ) : (
          <div className="text-on-surface-variant/20 select-none">
            {status === 'complete' || status === 'done' ? (
              <span className="material-symbols-outlined text-secondary text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            ) : (
              <span className="material-symbols-outlined text-7xl">keyboard</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="fixed bottom-6 right-8 flex flex-col items-end gap-1 pointer-events-none opacity-20">
        <div className="flex gap-2">
          <kbd className="px-2 py-1 rounded bg-surface-container-highest border border-[#464555]/20 font-mono text-[10px]">Space</kbd>
          <span className="font-label text-[10px] uppercase tracking-widest self-center">やり直す</span>
        </div>
      </div>
    </div>
  );
}
