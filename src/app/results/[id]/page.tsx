'use client';
import { useEffect, useState } from 'react';
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

const KpmChart = dynamic(
  () => import('@/components/results/KpmChart').then(m => m.KpmChart),
  { ssr: false, loading: () => <div className="h-40 flex items-center justify-center"><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p></div> }
);

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : null;
  const nextLesson = lesson ? getNextLesson(lesson.id) : null;

  const [result, setResult] = useState<SessionResult | null>(null);
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([]);

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
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* KPM main */}
          <div className="md:col-span-6 glass-card rounded-lg p-8 border border-[#464555]/5 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <p className="font-label text-sm uppercase tracking-[0.3em] text-on-surface-variant mb-2">CPS（1秒あたり文字数）</p>
            <h2 className="font-headline font-extrabold text-8xl leading-none text-primary tracking-tighter">{formatKpm(result.kpm)}</h2>
            <div className="flex items-center gap-2 mt-3 text-secondary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <span className="font-label font-bold text-sm">+{result.xpEarned} XP 獲得</span>
            </div>
          </div>
          {/* Accuracy */}
          <div className="md:col-span-3 glass-card rounded-lg p-6 flex flex-col justify-between border border-[#464555]/5">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">正確率</p>
              <h3 className="font-headline font-bold text-4xl text-secondary">
                {formatAccuracy(result.accuracy)}<span className="text-xl opacity-50">%</span>
              </h3>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${result.accuracy}%` }} />
            </div>
          </div>
          {/* Time */}
          <div className="md:col-span-3 glass-card rounded-lg p-6 flex flex-col justify-between border border-[#464555]/5">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">所要時間</p>
              <h3 className="font-headline font-bold text-4xl text-on-surface">{formatDuration(result.durationSeconds)}</h3>
            </div>
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
        <div className="max-w-md mx-auto space-y-4">
          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="gradient-primary w-full py-5 rounded-full font-headline font-extrabold text-lg text-on-primary flex items-center justify-center gap-3 transition-all active:scale-95 shadow-ambient hover:shadow-glow group"
            >
              次のレッスン: {nextLesson.title}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
              className="py-4 rounded-full font-headline font-bold text-sm text-on-surface transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#464555]/20 bg-surface-container-high hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              一覧へ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
