'use client';
import { useEffect, useState } from 'react';
import { LESSONS } from '@/data/lessons';
import { loadProgress, loadTestResults } from '@/lib/storage';
import { getEarnedBadges } from '@/lib/badges';
import type { UserProgress, TestResult, BadgeDefinition } from '@/types';
import { useBgm } from '@/hooks/useBgm';
import dynamic from 'next/dynamic';

const PerformanceCharts = dynamic(
  () => import('@/components/dashboard/PerformanceCharts').then(m => m.PerformanceCharts),
  { ssr: false, loading: () => <div className="h-48 flex items-center justify-center"><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">読み込み中...</p></div> }
);

export default function StatsPage() {
  useBgm();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setTestHistory(loadTestResults());
    setBadges(getEarnedBadges(p));
  }, []);

  if (!progress) return null;

  const totalLessons = LESSONS.length;
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;

  // 統計対象: 単語練習・テストのみ（単文字・Unit0・記号の練習レッスンは除外）
  const statsLessonIds = new Set(
    LESSONS.filter(l => l.type === 'words' || l.type === 'test').map(l => l.id)
  );

  // タイプ速度 stats (bestKpm field stores CPS)
  const allCps = Object.entries(progress.lessons)
    .filter(([id]) => statsLessonIds.has(id))
    .map(([, l]) => l.bestKpm)
    .filter(k => k > 0);
  const peakCps = allCps.length > 0 ? Math.max(...allCps).toFixed(1) : '0.0';
  const avgCps = allCps.length > 0
    ? (allCps.reduce((a, b) => a + b, 0) / allCps.length).toFixed(1)
    : '0.0';

  const allAccuracies = Object.entries(progress.lessons)
    .filter(([id]) => statsLessonIds.has(id))
    .map(([, l]) => l.bestAccuracy)
    .filter(a => a > 0);
  const avgAccuracy = allAccuracies.length > 0
    ? (allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length).toFixed(1)
    : '0.0';

  // All history entries sorted by date for chart (統計対象レッスンのみ)
  const allHistory = Object.entries(progress.lessons)
    .filter(([id]) => statsLessonIds.has(id))
    .flatMap(([, l]) => l.history)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20);

  const chartData = allHistory.map((h, i) => ({ session: `${i + 1}`, CPS: Math.round(h.kpm * 10) / 10, 正確率: Math.round(h.accuracy) }));

  // Session history (most recent completed lessons)
  const recentSessions = Object.values(progress.lessons)
    .filter(l => l.lastPlayedAt)
    .sort((a, b) => new Date(b.lastPlayedAt!).getTime() - new Date(a.lastPlayedAt!).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen px-8 py-10 space-y-10">
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">統計</h1>
          <p className="font-label text-secondary uppercase tracking-widest text-sm">パフォーマンス・実績</p>
        </div>
      </header>

      {/* Main grid: chart + right cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* タイプ速度 + 正確率 推移グラフ */}
        <div className="lg:col-span-8">
          {chartData.length >= 2 ? (
            <PerformanceCharts chartData={chartData} avgCps={avgCps} avgAccuracy={avgAccuracy} />
          ) : (
            <div className="glass-card p-7 rounded-lg border border-[#464555]/5 flex items-center justify-center h-48">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">データがまだありません</p>
            </div>
          )}
        </div>

        {/* Right stats cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {[
            { icon: 'speed', label: '最高 タイプ速度（キー/秒）', value: `${peakCps} キー/秒`, accent: 'text-primary', bg: 'bg-primary/10' },
            { icon: 'trending_up', label: '平均 タイプ速度（キー/秒）', value: `${avgCps} キー/秒`, accent: 'text-[#c0c1ff]', bg: 'bg-[#c0c1ff]/10' },
            { icon: 'verified', label: '平均 正確率', value: `${avgAccuracy}%`, accent: 'text-secondary', bg: 'bg-secondary/10' },
            { icon: 'school', label: '完了レッスン', value: `${completedLessons} / ${totalLessons}`, accent: 'text-tertiary', bg: 'bg-tertiary/10' },
          ].map(item => (
            <div key={item.label} className="flex-1 glass-card p-4 rounded-lg flex items-center gap-4 border border-[#464555]/5 hover:bg-surface-container-high/60 transition-all">
              <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center ${item.accent} flex-shrink-0`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <p className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant">{item.label}</p>
                <h4 className="font-headline text-xl font-bold text-on-surface">{item.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Unlocked Milestones (badges) */}
      {badges.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold text-on-surface">獲得バッジ</h2>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{badges.length} 個取得</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {badges.map(badge => (
              <div key={badge.id} className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 border border-[#464555]/10 w-28 hover:border-primary/20 transition-all">
                <span className="text-3xl">{badge.icon}</span>
                <p className="font-headline font-bold text-xs text-on-surface text-center leading-tight">{badge.title}</p>
                <p className="font-label text-[9px] text-on-surface-variant text-center leading-tight">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Session History table */}
      {recentSessions.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">セッション履歴</h2>
          <div className="glass-card rounded-lg border border-[#464555]/10 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-[#464555]/10">
                  <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">レッスン</th>
                  <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">タイプ速度</th>
                  <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">正確率</th>
                  <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#464555]/5">
                {recentSessions.map((session, i) => {
                  const lesson = LESSONS.find(l => l.id === session.lessonId);
                  return (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-headline font-medium text-sm text-on-surface">{lesson?.title ?? session.lessonId}</p>
                        <p className="font-label text-[10px] text-on-surface-variant">{lesson?.unitTitle ?? ''}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-headline font-bold text-lg text-on-surface">{session.bestKpm.toFixed(1)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-headline font-bold text-lg ${session.bestAccuracy >= 95 ? 'text-secondary' : session.bestAccuracy >= 80 ? 'text-on-surface' : 'text-error'}`}>
                          {session.bestAccuracy.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-label text-xs text-on-surface-variant">
                          {session.lastPlayedAt ? new Date(session.lastPlayedAt).toLocaleDateString('ja-JP') : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Test history */}
      {testHistory.length > 0 && (
        <section className="space-y-4 pb-8">
          <h2 className="font-headline text-2xl font-bold text-on-surface">テスト履歴</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testHistory.slice(0, 8).map((h, i) => (
              <div key={i} className="glass-card p-5 rounded-lg border border-[#464555]/10">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
                  {h.duration === 60 ? '1分' : h.duration === 180 ? '3分' : '5分'} テスト
                </p>
                <p className="font-headline text-3xl font-bold text-primary">{h.kpm.toFixed(1)}</p>
                <p className="font-label text-[10px] text-on-surface-variant uppercase mb-1">キー/秒</p>
                <p className="font-headline text-lg font-bold text-secondary">{h.accuracy.toFixed(1)}%</p>
                <p className="font-label text-[10px] text-on-surface-variant uppercase">正確率</p>
                <p className="font-label text-[10px] text-on-surface-variant/50 mt-2">
                  {new Date(h.completedAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
