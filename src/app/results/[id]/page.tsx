'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SessionResult, BadgeDefinition } from '@/types';
import { LESSONS_BY_ID, getNextLesson } from '@/data/lessons';
import { loadProgress, getLessonProgress, saveProgress } from '@/lib/storage';
import { evaluateBadges } from '@/lib/badges';
import { formatKpm, formatAccuracy, formatDuration } from '@/lib/metrics';
import dynamic from 'next/dynamic';
import { StarRating } from '@/components/results/StarRating';
import { BadgeToast } from '@/components/results/BadgeToast';
import { useBgmStop } from '@/hooks/useBgm';
import { loadSettings } from '@/lib/storage';
import { AdSideLayout } from '@/components/ads/AdSideLayout';

const KpmChart = dynamic(
  () => import('@/components/results/KpmChart').then(m => m.KpmChart),
  { ssr: false, loading: () => <div className="h-40 flex items-center justify-center"><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p></div> }
);

function playResultSound(stars: 0 | 1 | 2 | 3) {
  if (typeof window === 'undefined') return;
  const settings = loadSettings();
  if (!settings.soundEnabled) return;

  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  if (stars === 0) {
    // 失敗音: 下降する2音
    const times = [0, 0.25];
    const freqs = [300, 220];
    times.forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.4);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.4);
    });
  } else if (stars === 1 || stars === 2) {
    // 普通: 短い上昇2音
    const freqs = [392, 523];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.3);
    });
  } else {
    // 3星: ファンファーレ (C E G C)
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.5);
    });
  }
}

export default function ResultsPage() {
  useBgmStop();
  const router = useRouter();
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : null;
  const nextLesson = lesson ? getNextLesson(lesson.id) : null;

  const [result, setResult] = useState<SessionResult | null>(null);
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([]);
  const soundPlayedRef = useRef(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { router.push('/lessons'); return; }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (nextLesson) router.push(`/lessons/${nextLesson.id}`);
        else if (lesson) router.push(`/lessons/${lesson.id}`);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextLesson, lesson, router]);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastResult');
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return;
      const r = parsed as SessionResult;
      setResult(r);
      // Play result sound after short delay (let page render first)
      if (!soundPlayedRef.current) {
        soundPlayedRef.current = true;
        setTimeout(() => playResultSound(r.stars), 400);
      }
      const progress = loadProgress();
      const prevProgress = { ...progress, lessons: { ...progress.lessons } };
      const earned = evaluateBadges(r, progress, prevProgress);
      setNewBadges(earned);
      if (earned.length > 0) {
        const newIds = earned.map(b => b.id).filter(id => !progress.badges.includes(id));
        saveProgress({ ...progress, badges: [...progress.badges, ...newIds] });
      }
    }
  }, []);

  if (!lesson || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-on-surface-variant">結果が見つかりません</p>
        <Link href="/lessons" className="px-4 py-2 gradient-primary text-on-primary rounded-full font-headline font-medium">
          レッスン一覧へ
        </Link>
      </div>
    );
  }

  const lessonProgress = getLessonProgress(lessonId!);
  const isPersonalBest = result.kpm >= lessonProgress.bestKpm;

  return (
    <AdSideLayout>
      <BadgeToast badges={newBadges} />
      {/* Celebration bg */}
      <div className="fixed inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at center, rgba(192,193,255,0.06) 0%, rgba(11,19,38,0) 70%)' }} />
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-secondary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-3 animate-float">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-label text-xs font-semibold tracking-widest text-secondary uppercase">レッスン完了</span>
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{lesson.unitTitle}</p>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">{lesson.title}</h1>
          </div>
          {isPersonalBest && result.kpm > 0 && (
            <div className="glass-card rounded-xl px-4 py-3 border border-primary/20 text-center">
              <span className="material-symbols-outlined text-primary block mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              <p className="font-label text-[10px] uppercase tracking-widest text-primary">自己ベスト！</p>
            </div>
          )}
        </div>

        {/* Bento grid stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* KPM main */}
          <div className="md:col-span-6 glass-card rounded-lg px-6 py-4 border border-[#464555]/5 relative overflow-hidden group flex flex-col items-center justify-center">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-1">タイプ速度（キー/秒）</p>
            <h2 className="font-headline font-extrabold text-6xl leading-none text-primary tracking-tighter">{formatKpm(result.kpm)}</h2>
            <div className="flex items-center gap-2 mt-2 text-secondary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <span className="font-label font-bold text-sm">+{result.xpEarned} XP 獲得</span>
            </div>
          </div>
          {/* Accuracy */}
          <div className="md:col-span-3 glass-card rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 border border-[#464555]/5">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">正確率</p>
            <h3 className="font-headline font-bold text-4xl text-secondary">
              {formatAccuracy(result.accuracy)}<span className="text-xl opacity-50">%</span>
            </h3>
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${result.accuracy}%` }} />
            </div>
          </div>
          {/* Time */}
          <div className="md:col-span-3 glass-card rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 border border-[#464555]/5">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">所要時間</p>
            <h3 className="font-headline font-bold text-4xl text-on-surface">{formatDuration(result.durationSeconds)}</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="w-2 h-2 rounded-full bg-primary-container/40" />
              <span className="w-2 h-2 rounded-full bg-primary-container/20" />
            </div>
          </div>
        </div>

        {/* Stars */}
        <div className="glass-card rounded-lg p-6 border border-[#464555]/5 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">評価</p>
            <StarRating stars={result.stars} />
          </div>
          <div className="text-right">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">詳細</p>
            <p className="font-body text-sm text-on-surface-variant">
              正解 {result.correctChars}文字 / ミス {result.errorCount}回
            </p>
          </div>
        </div>

        {/* History chart */}
        {lessonProgress.history.length >= 2 && (
          <div className="glass-card rounded-lg p-6 border border-[#464555]/5">
            <h4 className="font-headline font-bold text-lg text-on-surface mb-1">パフォーマンス履歴</h4>
            <p className="text-on-surface-variant text-sm mb-4">直近 {lessonProgress.history.length} 回の記録</p>
            <KpmChart history={lessonProgress.history} />
          </div>
        )}

        {/* CTA actions */}
        <div className="max-w-md mx-auto space-y-3 pb-8">
          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="gradient-primary w-full py-4 rounded-full font-headline font-extrabold text-lg text-on-primary flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 shadow-ambient hover:shadow-glow group"
            >
              <div className="flex items-center gap-3">
                次のレッスン: {nextLesson.title}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <span className="font-label text-[9px] text-on-primary/60 uppercase tracking-widest">Space / Enter</span>
            </Link>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/lessons/${lesson.id}`}
              className="py-4 rounded-full font-headline font-bold text-sm text-on-surface transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#464555]/20 bg-surface-container-high hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              もう一度
            </Link>
            <Link
              href="/lessons"
              className="py-4 rounded-full font-headline font-bold text-sm text-on-surface transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 border border-[#464555]/20 bg-surface-container-high hover:bg-surface-container-highest"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">grid_view</span>
                一覧へ
              </div>
              <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">ESC</span>
            </Link>
          </div>
        </div>
      </div>
    </AdSideLayout>
  );
}
