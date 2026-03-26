'use client';
import { useEffect, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LESSONS, getUnitIds, getLessonsByUnit } from '@/data/lessons';
import { loadProgress } from '@/lib/storage';
import type { UserProgress } from '@/types';
import { UnitSection } from '@/components/dashboard/UnitSection';
import { xpForNextLevel } from '@/lib/constants';
import { SkeletonCard, SkeletonUnitSection, SkeletonProgressCard } from '@/components/shared/Skeleton';
import { useBgm } from '@/hooks/useBgm';

const PerformanceCharts = dynamic(
  () => import('@/components/dashboard/PerformanceCharts').then(m => m.PerformanceCharts),
  { ssr: false, loading: () => <div className="glass-card rounded-lg border border-[#464555]/10 p-10 text-center"><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p></div> }
);

const UNIT_TITLES: Record<string, string> = {
  'unit-0':  'Unit 0: ホームポジション',
  'unit-1':  'Unit 1: あ行',
  'unit-2':  'Unit 2: か行',
  'unit-3':  'Unit 3: さ行',
  'unit-4':  'Unit 4: た行',
  'unit-5':  'Unit 5: な行',
  'unit-6':  'Unit 6: は行',
  'unit-7':  'Unit 7: ま行',
  'unit-8':  'Unit 8: や行・わ行・ん',
  'unit-9':  'Unit 9: ら行',
  'unit-10': 'Unit 10: が行',
  'unit-11': 'Unit 11: ざ行',
  'unit-12': 'Unit 12: だ行',
  'unit-13': 'Unit 13: ば行',
  'unit-14': 'Unit 14: ぱ行',
  'unit-15': 'Unit 15: きゃ行・しゃ行',
  'unit-16': 'Unit 16: ちゃ行・にゃ行',
  'unit-17': 'Unit 17: ひゃ・みゃ・りゃ行',
  'unit-18': 'Unit 18: ぎゃ・じゃ・びゃ・ぴゃ行',
  'unit-19': 'Unit 19: 句読点・長音符',
  'unit-20': 'Unit 20: 総合練習',
};

function buildChartData(progress: UserProgress) {
  // Collect all history entries across lessons, sort by date
  const entries: { cps: number; accuracy: number; date: string }[] = [];
  for (const lp of Object.values(progress.lessons)) {
    for (const h of lp.history) {
      entries.push({ cps: h.kpm, accuracy: h.accuracy, date: h.date });
    }
  }
  entries.sort((a, b) => a.date.localeCompare(b.date));

  // Take last 20 entries for the chart
  const recent = entries.slice(-20);
  return recent.map((e, i) => ({
    session: `#${entries.length - recent.length + i + 1}`,
    CPS: e.cps,
    正確率: Math.round(e.accuracy),
  }));
}

export default function HomePage() {
  useBgm();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [unitsReady, setUnitsReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransitionFn] = useTransition();

  useEffect(() => {
    const p = loadProgress();
    if (!p.lessons['u0-l01']) {
      p.lessons['u0-l01'] = {
        lessonId: 'u0-l01',
        unlocked: true,
        completed: false,
        bestKpm: 0,
        bestAccuracy: 0,
        stars: 0,
        attempts: 0,
        lastPlayedAt: null,
        history: [],
      };
    }
    setProgress(p);
    // Defer heavy unit rendering to after first paint
    startTransitionFn(() => {
      setUnitsReady(true);
    });
  }, []);

  if (!progress) {
    return (
      <div className="min-h-screen px-8 py-10 space-y-8">
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        {/* Hero skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-2 w-12 rounded-full bg-surface-container-highest" />
          <div className="h-8 w-56 rounded-full bg-surface-container-highest" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        {/* Progress bars skeleton */}
        <SkeletonProgressCard />
        {/* Continue button skeleton */}
        <div className="h-20 rounded-2xl bg-surface-container-highest animate-pulse" />
        {/* Chart skeleton */}
        <div className="glass-card rounded-lg border border-[#464555]/10 p-10 text-center animate-pulse">
          <div className="h-40 flex items-center justify-center">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p>
          </div>
        </div>
        {/* Units skeleton */}
        <div className="space-y-6">
          <SkeletonUnitSection /><SkeletonUnitSection /><SkeletonUnitSection />
        </div>
      </div>
    );
  }

  const unitIds = getUnitIds();
  const totalLessons = LESSONS.length;
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;
  const overallPct = Math.round((completedLessons / totalLessons) * 100);
  const nextLevelXp = xpForNextLevel(progress.level);
  const xpPct = nextLevelXp > 0 ? Math.min((progress.xp / nextLevelXp) * 100, 100) : 100;

  const nextLesson = LESSONS.find(l =>
    (progress.lessons[l.id]?.unlocked ?? l.id === 'u0-l01') &&
    !progress.lessons[l.id]?.completed
  );

  const chartData = buildChartData(progress);
  const hasChartData = chartData.length >= 2;

  // Aggregate stats from all history
  const allHistory = Object.values(progress.lessons).flatMap(l => l.history);
  const avgCps = allHistory.length > 0
    ? (allHistory.reduce((s, h) => s + h.kpm, 0) / allHistory.length).toFixed(1)
    : '—';
  const avgAccuracy = allHistory.length > 0
    ? (allHistory.reduce((s, h) => s + h.accuracy, 0) / allHistory.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen px-8 py-10 space-y-8">
      {/* Ambient background orbs */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero */}
      <section>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">ようこそ</p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
          かなタイピング<span className="text-primary">練習</span>
        </h1>
      </section>

      {/* Stats cards — Level / Streak / XP */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="military_tech" label="レベル" value={`Lv.${progress.level}`} sub={`${progress.xp} XP`} accent="primary" />
        <StatCard icon="local_fire_department" label="ストリーク" value={`${progress.streakDays}日`} sub={`最長 ${progress.longestStreak}日`} accent="secondary" />
        <StatCard icon="stars" label="XP" value={`${progress.xp}`} sub={`次まで ${Math.max(0, nextLevelXp - progress.xp)} XP`} accent="tertiary" />
      </div>

      {/* Progress bars */}
      <div className="glass-card rounded-lg border border-[#464555]/10 p-6 space-y-5">
        {/* Overall progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">カリキュラム進捗</span>
            <span className="font-label text-xs font-bold text-secondary">{completedLessons} / {totalLessons} 完了 · {overallPct}%</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-secondary-container rounded-full shadow-glow-green transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
        {/* XP bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">次のレベルまで</span>
            <span className="font-label text-xs font-bold text-primary">{progress.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-glow transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue button */}
      {nextLesson && (
        <Link
          href={`/lessons/${nextLesson.id}`}
          className="w-full gradient-primary text-white font-headline font-bold py-5 rounded-2xl flex items-center justify-between px-6 shadow-ambient hover:shadow-glow transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div>
            <div className="text-xs font-label text-white/70 mb-0.5 uppercase tracking-widest">再開する</div>
            <div className="text-base">{nextLesson.title}</div>
          </div>
          <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
        </Link>
      )}

      {/* Performance graphs */}
      {hasChartData ? (
        <PerformanceCharts chartData={chartData} avgCps={avgCps} avgAccuracy={avgAccuracy} />
      ) : (
        <div className="glass-card rounded-lg border border-[#464555]/10 p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">analytics</span>
          <p className="font-headline font-bold text-on-surface mb-1">まだデータがありません</p>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">レッスンを2回以上完了するとグラフが表示されます</p>
        </div>
      )}

      {/* Unit sections — deferred to after first paint */}
      <div className="space-y-6">
        {unitsReady ? (
          unitIds.map(unitId => (
            <UnitSection
              key={unitId}
              unitId={unitId}
              unitTitle={UNIT_TITLES[unitId] ?? unitId}
              lessons={getLessonsByUnit(unitId)}
              progress={progress}
            />
          ))
        ) : (
          <>
            <SkeletonUnitSection /><SkeletonUnitSection /><SkeletonUnitSection />
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: {
  icon: string; label: string; value: string; sub: string; accent: 'primary' | 'secondary' | 'tertiary'
}) {
  const colors = {
    primary:   'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    tertiary:  'text-tertiary bg-tertiary/10',
  };
  return (
    <div className="glass-card rounded-lg border border-[#464555]/10 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[accent]}`}>
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">{label}</p>
      <p className="font-headline text-2xl font-bold text-on-surface leading-tight">{value}</p>
      <p className="font-label text-[10px] text-on-surface-variant mt-0.5">{sub}</p>
    </div>
  );
}
