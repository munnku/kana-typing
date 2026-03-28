'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { TestResult } from '@/types';
import { textToKanaUnits, matchRomaji, getNextExpectedChars } from '@/data/romajiMap';
import { buildTestText } from '@/data/testTexts';
import { saveTestResult, loadTestResults, loadSettings } from '@/lib/storage';
import { computeKpm, computeAccuracy } from '@/lib/metrics';
import { TypingScreen } from '@/components/shared/TypingScreen';
import { useBgm, startBgm, stopBgm } from '@/hooks/useBgm';
import { useAudio } from '@/hooks/useAudio';
import { AdSideLayout } from '@/components/ads/AdSideLayout';
import type { DisplayChar } from '@/types';

const TestHistoryChart = dynamic(
  () => import('@/components/results/TestHistoryChart').then(m => m.TestHistoryChart),
  { ssr: false, loading: () => <div className="h-40 flex items-center justify-center"><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p></div> }
);

const DURATIONS = [60, 180, 300] as const;
type Duration = typeof DURATIONS[number];
const CHARS_BUFFER = 2500;
const CHARS_PER_LINE = 12;
const VISIBLE_LINES = 2;

interface LineRange { start: number; end: number; nextStart: number; }

const DURATION_LABELS: Record<number, { short: string; sub: string; icon: string }> = {
  60:  { short: '1分テスト',   sub: 'スピード重視', icon: 'timer' },
  180: { short: '3分テスト',   sub: 'バランス型', icon: 'timer' },
  300: { short: '5分テスト',   sub: '持久力テスト', icon: 'timer' },
};

function buildTestChars(): DisplayChar[] {
  const text = buildTestText(CHARS_BUFFER);
  const units = textToKanaUnits(text);
  return units.map((u, i) => ({
    kana: u.kana,
    displayRomaji: u.displayRomaji,
    acceptedRomaji: u.romaji,
    state: i === 0 ? 'current' : 'pending',
    typedRomaji: '',
  }));
}

function buildLines(chars: DisplayChar[]): LineRange[] {
  const lines: LineRange[] = [];
  let lineStart = 0;
  let charCount = 0;
  for (let i = 0; i < chars.length; i++) {
    const isSpace = chars[i].kana === ' ';
    // スペースも含めてカウント（表示幅を占めるため）
    charCount++;

    if (isSpace && charCount >= CHARS_PER_LINE) {
      // スペースで区切れる位置で改行
      lines.push({ start: lineStart, end: i - 1, nextStart: i + 1 });
      lineStart = i + 1;
      charCount = 0;
    } else if (!isSpace && charCount >= CHARS_PER_LINE) {
      // スペースなしで上限を超えたら強制改行
      lines.push({ start: lineStart, end: i, nextStart: i + 1 });
      lineStart = i + 1;
      charCount = 0;
    }
  }
  if (lineStart < chars.length) {
    lines.push({ start: lineStart, end: chars.length - 1, nextStart: chars.length });
  }
  return lines;
}

export default function TestPage() {
  const { onKeyPress, resetProgression, unlock } = useAudio();
  const router = useRouter();
  const [duration, setDuration] = useState<Duration>(60);
  const [status, setStatus] = useState<'idle' | 'active' | 'done'>('idle');

  // BGM: idle = BGM流す、active/done = BGM停止
  useBgm();
  useEffect(() => {
    if (status === 'active' || status === 'done') {
      stopBgm();
    } else {
      startBgm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const [chars, setChars] = useState<DisplayChar[]>([]);
  const [lines, setLines] = useState<LineRange[]>([]);
  const [visibleLineStart, setVisibleLineStart] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [partial, setPartial] = useState('');
  const [errors, setErrors] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctChars, setCorrectChars] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const settings = loadSettings();

  useEffect(() => { setHistory(loadTestResults()); }, []);

  const startTest = useCallback(() => {
    const testChars = buildTestChars();
    const testLines = buildLines(testChars);
    setChars(testChars);
    setLines(testLines);
    setVisibleLineStart(0);
    setCursor(0);
    setPartial('');
    setErrors(0);
    setKeystrokes(0);
    setCorrectChars(0);
    setTimeLeft(duration);
    setResult(null);
    resetProgression();
    setStatus('active');
  }, [duration, resetProgression]);

  useEffect(() => {
    if (status !== 'active') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setStatus('done'); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'done') return;
    const kpm = computeKpm(correctChars, duration);
    const accuracy = computeAccuracy(keystrokes - errors, keystrokes);
    const r: TestResult = { duration, kpm, accuracy, correctChars, errorCount: errors, completedAt: new Date().toISOString() };
    setResult(r);
    saveTestResult(r);
    setHistory(prev => [r, ...prev].slice(0, 20));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (status !== 'active') return;
    if (e.isComposing) return;
    const ignoredKeys = new Set(['Shift','Control','Alt','Meta','CapsLock','Tab','Escape','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter']);
    if (ignoredKeys.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === ' ') return;
    if (e.key.length !== 1) return;
    e.preventDefault();

    unlock();
    const key = e.key.toLowerCase();
    const newPartial = partial + key;
    const currentChar = chars[cursor];
    if (!currentChar) return;

    const match = matchRomaji(newPartial, currentChar.acceptedRomaji);
    setKeystrokes(k => k + 1);

    if (match === 'complete') {
      onKeyPress(true);
      setCorrectChars(c => c + 1);
      let nextCursor = cursor + 1;
      while (nextCursor < chars.length && chars[nextCursor].kana === ' ') nextCursor++;
      setChars(prev => prev.map((c, i) => {
        if (i === cursor) return { ...c, state: 'correct', typedRomaji: newPartial };
        if (i > cursor && i < nextCursor && c.kana === ' ') return { ...c, state: 'correct' };
        if (i === nextCursor) return { ...c, state: 'current' };
        return c;
      }));
      setCursor(nextCursor);
      setPartial('');
      setVisibleLineStart(prev => {
        if (lines.length > 0 && prev < lines.length - 1 && nextCursor >= lines[prev].nextStart) return prev + 1;
        return prev;
      });
    } else if (match === 'partial') {
      setChars(prev => prev.map((c, i) => i === cursor ? { ...c, typedRomaji: newPartial } : c));
      setPartial(newPartial);
    } else {
      const singleMatch = matchRomaji(key, currentChar.acceptedRomaji);
      setErrors(err => err + 1);
      onKeyPress(false);
      if (singleMatch !== 'no-match') {
        setPartial(key);
        setChars(prev => prev.map((c, i) => i === cursor ? { ...c, state: 'error', typedRomaji: key } : c));
      } else {
        setPartial('');
        setChars(prev => prev.map((c, i) => i === cursor ? { ...c, state: 'error' } : c));
      }
    }
  }, [status, partial, chars, cursor, lines, onKeyPress, unlock]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { router.push('/lessons'); return; }
      if ((e.key === ' ' || e.key === 'Enter') && status !== 'active') {
        e.preventDefault();
        if (status === 'idle') startTest();
        else setStatus('idle');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [status, router, startTest]);

  const activeKey = useMemo(() => {
    if (status !== 'active' || !chars[cursor]) return null;
    const expected = getNextExpectedChars(chars[cursor].acceptedRomaji, partial);
    return expected[0] ?? null;
  }, [status, chars, cursor, partial]);

  const visibleLines = useMemo(() => lines.slice(visibleLineStart, visibleLineStart + VISIBLE_LINES), [lines, visibleLineStart]);

  const timerPct = (timeLeft / duration) * 100;
  const currentKpm = computeKpm(correctChars, duration - timeLeft);
  const currentAcc = computeAccuracy(keystrokes - errors, keystrokes);

  // Done — results screen (full page, same as results/[id])
  if (status === 'done' && result) {
    const isPersonalBest = history.length > 1 && result.kpm >= Math.max(...history.slice(1).map(h => h.kpm));
    const recentHistory = history.filter(h => h.duration === result.duration).slice(0, 10);
    return (
      <AdSideLayout>
        {/* Celebration bg */}
        <div className="fixed inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at center, rgba(192,193,255,0.06) 0%, rgba(11,19,38,0) 70%)' }} />
        <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-float" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-secondary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-3 animate-float">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label text-xs font-semibold tracking-widest text-secondary uppercase">テスト完了</span>
              </div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{DURATION_LABELS[result.duration].sub}</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">
                {DURATION_LABELS[result.duration].short} 完了
              </h1>
            </div>
            {isPersonalBest && result.kpm > 0 && (
              <div className="glass-card rounded-xl px-4 py-3 border border-primary/20 text-center mt-2">
                <span className="material-symbols-outlined text-primary block mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary">自己ベスト！</p>
              </div>
            )}
          </div>

          {/* Bento grid stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 glass-card rounded-lg px-6 py-4 border border-[#464555]/5 relative overflow-hidden group flex flex-col items-center justify-center">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
              <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-1">タイプ速度（キー/秒）</p>
              <h2 className="font-headline font-extrabold text-6xl leading-none text-primary tracking-tighter">{result.kpm.toFixed(1)}</h2>
              <div className="flex items-center gap-2 mt-2 text-secondary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <span className="font-label font-bold text-sm">ベストエフォート</span>
              </div>
            </div>
            <div className="md:col-span-3 glass-card rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 border border-[#464555]/5">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">正確率</p>
              <h3 className="font-headline font-bold text-4xl text-secondary">
                {result.accuracy.toFixed(1)}<span className="text-xl opacity-50">%</span>
              </h3>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${result.accuracy}%` }} />
              </div>
            </div>
            <div className="md:col-span-3 glass-card rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 border border-[#464555]/5">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">文字数</p>
              <h3 className="font-headline font-bold text-4xl text-on-surface">{result.correctChars}</h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                <span className="w-2 h-2 rounded-full bg-primary-container/40" />
                <span className="w-2 h-2 rounded-full bg-primary-container/20" />
              </div>
            </div>
          </div>

          {/* Details Card (imitation of Stars section) */}
          <div className="glass-card rounded-lg p-6 border border-[#464555]/5 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">総打鍵数</p>
              <p className="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">keyboard</span>
                {result.correctChars + result.errorCount}
              </p>
            </div>
            <div className="text-right">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">詳細</p>
              <p className="font-body text-sm text-on-surface-variant">
                正解 {result.correctChars}文字 / ミス {result.errorCount}回
              </p>
            </div>
          </div>

          {/* Performance history chart */}
          {recentHistory.length >= 2 && (
            <div className="glass-card rounded-lg p-6 border border-[#464555]/5">
              <h4 className="font-headline font-bold text-lg text-on-surface mb-1">パフォーマンス履歴</h4>
              <p className="text-on-surface-variant text-sm mb-4">{DURATION_LABELS[result.duration].short} の直近 {recentHistory.length} 回の記録</p>
              <TestHistoryChart history={recentHistory} />
            </div>
          )}

          {/* Actions */}
          <div className="max-w-md mx-auto space-y-3 pb-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startTest}
                className="py-4 rounded-full font-headline font-bold text-sm text-on-surface transition-all active:scale-95 flex flex-col items-center justify-center gap-1 border border-[#464555]/20 bg-surface-container-high hover:bg-surface-container-highest"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  もう一度
                </div>
                <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">Space / Enter</span>
              </button>
              <button
                onClick={() => setStatus('idle')}
                className="py-4 rounded-full font-headline font-bold text-sm text-on-surface transition-all active:scale-95 flex flex-col items-center justify-center gap-1 border border-[#464555]/20 bg-surface-container-high hover:bg-surface-container-highest"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">keyboard_backspace</span>
                  テスト選択
                </div>
                <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">ESC</span>
              </button>
            </div>
          </div>
        </div>
      </AdSideLayout>
    );
  }

  // Active test — reuse shared TypingScreen
  if (status === 'active') {
    return (
      <TypingScreen
        chars={chars}
        visibleLines={visibleLines}
        visibleLineStart={visibleLineStart}
        cursorIndex={cursor}
        partialRomaji={partial}
        status="active"
        topBarPct={timerPct}
        topBarColor={timeLeft <= 10 ? 'bg-error' : 'bg-secondary shadow-glow-green'}
        headerLeft={
          <>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            タイムドテスト • {DURATION_LABELS[duration].sub}
          </>
        }
        headerRight={
          <>
            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-error' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-sm">timer</span>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="h-4 w-px bg-[#464555]/30" />
            <button onClick={() => setStatus('idle')} className="font-label text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                やり直す
              </div>
              <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">Space / Enter</span>
            </button>
            <span className="font-label text-xs uppercase tracking-widest text-outline">ESC で終了</span>
          </>
        }
        statsBar={
          <>
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">タイプ速度</span>
              <span className="font-headline font-bold text-lg text-primary">{currentKpm.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">精度</span>
              <span className="font-headline font-bold text-lg text-secondary">{currentAcc.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">文字数</span>
              <span className="font-headline font-bold text-lg text-on-surface">{correctChars}</span>
            </div>
          </>
        }
        showFingerGuide={settings.showFingerGuide}
        showRomajiGuide={settings.romajiGuide !== 'never'}
        activeKey={activeKey}
      />
    );
  }

  return (
    <AdSideLayout side="right">
    <div className="min-h-screen px-8 py-10 space-y-10">
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero */}
      <section>
        <h1 className="font-headline font-extrabold text-5xl tracking-tighter mb-3 text-on-surface">テスト</h1>
        <p className="text-on-surface-variant font-body text-base max-w-xl">
          テスト時間を選択して、タイピングスピードを計測しましょう。
        </p>
      </section>

      {status === 'idle' && (
        <>
          {/* Duration selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DURATIONS.map(d => {
              const info = DURATION_LABELS[d];
              const isSelected = duration === d;
              return (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`glass-card p-8 rounded-lg text-left transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group ${
                    isSelected
                      ? 'ring-2 ring-secondary/40 scale-[1.02] shadow-glow-green'
                      : 'border border-[#464555]/10 hover:border-primary/20'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'wght' 700" }}>{info.icon}</span>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${isSelected ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined text-2xl">{info.icon}</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl mb-1 text-on-surface">{info.short}</h3>
                    <p className="font-label text-secondary uppercase tracking-widest text-xs mb-4 font-semibold">{info.sub}</p>
                    <div className="mt-auto">
                      <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full rounded-full gradient-secondary`} style={{ width: d === 60 ? '33%' : d === 180 ? '66%' : '100%' }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startTest}
              className="gradient-primary px-12 py-5 rounded-full font-headline font-bold text-on-primary text-xl shadow-ambient hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              テストを開始
            </button>
            <p className="font-label text-outline text-[10px] uppercase tracking-[0.2em]">Enter キーでも開始</p>
          </div>
        </>
      )}


      {/* History */}
      {history.length > 0 && status === 'idle' && (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline font-bold text-2xl text-on-surface">パフォーマンス履歴</h2>
              <p className="text-on-surface-variant font-body text-sm">過去のテスト記録</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.slice(0, 6).map((h, i) => (
              <div key={i} className="glass-card p-5 rounded-lg border border-[#464555]/10 flex items-center justify-between">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{DURATION_LABELS[h.duration]?.short ?? `${h.duration}秒`}</p>
                  <p className="text-xs text-on-surface-variant/60">{new Date(h.completedAt).toLocaleDateString('ja-JP')}</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="font-headline font-bold text-2xl text-primary">{h.kpm.toFixed(1)}</p>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase">キー/秒</p>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-2xl text-secondary">{h.accuracy.toFixed(1)}%</p>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase">正確率</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </AdSideLayout>
  );
}
