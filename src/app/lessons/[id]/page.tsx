'use client';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { LESSONS_BY_ID, getNextLesson } from '@/data/lessons';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { useBgmStop } from '@/hooks/useBgm';
import { InputCapture } from '@/components/lesson/InputCapture';
import { TypingScreen } from '@/components/shared/TypingScreen';
import { TutorialSlideshow } from '@/components/lesson/TutorialSlideshow';
import { loadSettings, updateLessonProgress } from '@/lib/storage';
import { TUTORIAL_SLIDES } from '@/data/tutorialSlides';
import type { Lesson, SessionResult, DisplayChar } from '@/types';

const CHARS_PER_LINE = 12;
const VISIBLE_LINES = 2;

interface LineRange {
  start: number;
  end: number;
  nextStart: number;
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

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function LessonRunner({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const unitIndex = parseInt(lesson.unitId.replace('unit-', ''), 10);
  const settings = loadSettings();

  useBgmStop();

  // チュートリアルスライド: レッスンIDをキーに取得
  const lessonSlides = TUTORIAL_SLIDES[lesson.id] ?? null;
  const [showTutorial, setShowTutorial] = useState(!!lessonSlides);
  const {
    state, kpm, accuracy, stars, xpEarned, correctChars,
    nextExpectedKeys, handleKey, reset, tick,
  } = useTypingEngine(lesson, unitIndex);

  const { elapsed, running, start, stop, reset: resetTimer } = useTimer();
  const { onKeyPress, resetProgression, unlock } = useAudio();
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = useMemo(
    () => buildLines(state.chars),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.chars.length]
  );
  const [visibleLineStart, setVisibleLineStart] = useState(0);

  useEffect(() => {
    if (lines.length === 0) return;
    const currentLine = lines[visibleLineStart];
    if (currentLine && state.cursorIndex >= currentLine.nextStart && visibleLineStart < lines.length - 1) {
      setVisibleLineStart(v => v + 1);
    }
  }, [state.cursorIndex, lines, visibleLineStart]);

  useEffect(() => { setVisibleLineStart(0); }, [lesson.id]);

  useEffect(() => {
    if (state.status === 'active' && !running) start();
  }, [state.status, running, start]);

  useEffect(() => { tick(elapsed); }, [elapsed, tick]);

  const handleRestart = useCallback(() => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    reset();
    resetTimer();
    resetProgression();
    setVisibleLineStart(0);
  }, [reset, resetTimer, resetProgression]);

  // Sound: detect cursor advance (correct) vs error count increase
  const prevCursorRef = useRef(state.cursorIndex);
  const prevErrorRef = useRef(state.errorCount);
  useEffect(() => {
    const cursorAdvanced = state.cursorIndex > prevCursorRef.current;
    const errorIncreased = state.errorCount > prevErrorRef.current;
    if (cursorAdvanced) {
      onKeyPress(true);
    } else if (errorIncreased) {
      onKeyPress(false);
    }
    prevCursorRef.current = state.cursorIndex;
    prevErrorRef.current = state.errorCount;
  }, [state.cursorIndex, state.errorCount, onKeyPress]);

  const handleKeyWithSound = useCallback((key: string) => {
    unlock();
    handleKey(key);
  }, [handleKey, unlock]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showTutorial) return; // スライド表示中はスライド側でキーを処理する
      if (e.key === 'Escape') { router.push('/lessons'); return; }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleRestart(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.status, handleRestart, router, showTutorial]);

  useEffect(() => {
    if (state.status !== 'complete') return;
    stop();
    const nextLesson = getNextLesson(lesson.id);
    const result: SessionResult = {
      lessonId: lesson.id,
      kpm,
      accuracy,
      stars,
      durationSeconds: elapsed,
      correctChars,
      totalChars: state.chars.length,
      errorCount: state.errorCount,
      completedAt: new Date().toISOString(),
      xpEarned,
    };
    updateLessonProgress(result, nextLesson?.id);
    sessionStorage.setItem('lastResult', JSON.stringify(result));
    completionTimeoutRef.current = setTimeout(() => {
      router.push(`/results/${lesson.id}`);
    }, 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const activeKey = nextExpectedKeys[0] ?? null;
  const nonSpaceTotal = state.chars.filter(c => c.kana !== ' ').length;
  const progress = nonSpaceTotal > 0 ? Math.round((correctChars / nonSpaceTotal) * 100) : 0;
  const visibleLines = lines.slice(visibleLineStart, visibleLineStart + VISIBLE_LINES);

  return (
    <>
      {showTutorial && lessonSlides && (
        <TutorialSlideshow slides={lessonSlides} onComplete={() => setShowTutorial(false)} />
      )}
      <InputCapture onKey={handleKeyWithSound} active={state.status !== 'complete' && !showTutorial} />
      <TypingScreen
        chars={state.chars}
        visibleLines={visibleLines}
        visibleLineStart={visibleLineStart}
        cursorIndex={state.cursorIndex}
        partialRomaji={state.partialRomaji}
        status={state.status}
        topBarPct={progress}
        headerLeft={
          <>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            {lesson.title}
          </>
        }
        headerRight={
          <>
            {state.status !== 'idle' && (
              <div className="flex items-center gap-2 font-mono text-sm text-secondary">
                <span className="material-symbols-outlined text-sm">timer</span>
                {formatTime(elapsed)}
              </div>
            )}
            <div className="h-4 w-px bg-[#464555]/30" />
            <button
              onClick={handleRestart}
              className="font-label text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                やり直す
              </div>
              <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">Space / Enter</span>
            </button>
            <Link
              href="/lessons"
              className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-colors"
            >
              ESC で終了
            </Link>
          </>
        }
        statsBar={state.status === 'active' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">タイプ速度</span>
              <span className="font-headline font-bold text-lg text-primary">{kpm.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">精度</span>
              <span className="font-headline font-bold text-lg text-secondary">{accuracy}%</span>
            </div>
          </>
        ) : undefined}
        showFingerGuide={settings.showFingerGuide}
        showRomajiGuide={settings.romajiGuide !== 'never'}
        activeKey={activeKey}
        idleHint="キーを押してスタート"
      />
    </>
  );
}

export default function LessonPage() {
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : null;

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-on-surface-variant">レッスンが見つかりません</p>
        <Link href="/lessons" className="px-4 py-2 gradient-primary text-on-primary rounded-full font-headline font-medium hover:opacity-90 transition-opacity">
          レッスン一覧へ
        </Link>
      </div>
    );
  }

  return <LessonRunner lesson={lesson} />;
}
