'use client';
import { useEffect, useState } from 'react';
import { LESSONS, getUnitIds, getLessonsByUnit } from '@/data/lessons';
import { loadProgress } from '@/lib/storage';
import type { UserProgress } from '@/types';
import { UnitSection } from '@/components/dashboard/UnitSection';

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

export default function LessonsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);

    // Auto-expand: first incomplete unit (in-progress) and any unit with no completed lessons yet
    const unitIds = getUnitIds();
    const toExpand = new Set<string>();
    let foundInProgress = false;
    for (const uid of unitIds) {
      const lessons = getLessonsByUnit(uid);
      const completedCount = lessons.filter(l => p.lessons[l.id]?.completed).length;
      const hasStarted = lessons.some(l => p.lessons[l.id]?.attempts && (p.lessons[l.id]?.attempts ?? 0) > 0);
      const isComplete = completedCount === lessons.length && lessons.length > 0;
      if (!isComplete && !foundInProgress) {
        toExpand.add(uid);
        foundInProgress = true;
      }
      if (hasStarted && !isComplete) toExpand.add(uid);
    }
    // Always expand first unit if nothing in progress
    if (toExpand.size === 0 && unitIds.length > 0) toExpand.add(unitIds[0]);
    setExpandedUnits(toExpand);
  }, []);

  if (!progress) return null;

  const unitIds = getUnitIds();
  const totalLessons = LESSONS.length;
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;
  const pct = Math.round((completedLessons / totalLessons) * 100);

  function toggleUnit(uid: string) {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  }

  return (
    <div className="min-h-screen px-8 py-10 space-y-8">
      {/* Ambient orbs */}
      <div className="fixed -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="p-8 rounded-lg bg-surface-container-low border border-[#464555]/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label text-[10px] text-secondary uppercase tracking-[0.2em] font-bold block mb-1">現在の状況</span>
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Curriculum Mastery</h1>
            </div>
            <div className="text-right">
              <span className="text-4xl font-headline font-black text-secondary">{pct}%</span>
              <span className="font-label text-[10px] text-outline uppercase tracking-widest block">完了</span>
            </div>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary shadow-glow-green transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-label text-[10px] text-outline uppercase tracking-widest">Unit 0: 基礎</span>
            <span className="font-label text-[10px] text-outline uppercase tracking-widest">Unit 20: マスタリー</span>
          </div>
        </div>
      </div>

      {/* Unit sections with collapse */}
      <div className="space-y-3">
        {unitIds.map(unitId => {
          const lessons = getLessonsByUnit(unitId);
          const completedCount = lessons.filter(l => progress.lessons[l.id]?.completed).length;
          const isUnitComplete = completedCount === lessons.length && lessons.length > 0;
          const hasStarted = lessons.some(l => (progress.lessons[l.id]?.attempts ?? 0) > 0);
          const isInProgress = hasStarted && !isUnitComplete;
          const isExpanded = expandedUnits.has(unitId);
          const unitNum = unitId.replace('unit-', '');

          return (
            <div key={unitId} className="bg-surface-container-low border border-[#464555]/10 rounded-lg overflow-hidden transition-all duration-300">
              {/* Unit header — clickable to collapse */}
              <button
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                onClick={() => toggleUnit(unitId)}
              >
                <div className="flex items-center gap-4">
                  {/* Unit number badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold text-sm flex-shrink-0 ${
                    isUnitComplete
                      ? 'bg-secondary text-on-secondary'
                      : isInProgress
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {isUnitComplete
                      ? <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      : <span className="text-xs">{unitNum.padStart(2, '0')}</span>
                    }
                  </div>
                  <div className="text-left">
                    <h2 className="font-headline font-bold text-base text-on-surface">{UNIT_TITLES[unitId] ?? unitId}</h2>
                    <p className="font-label text-[10px] text-on-surface-variant">{completedCount} / {lessons.length} 完了</p>
                  </div>
                  {isInProgress && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 font-label text-[9px] text-secondary uppercase tracking-widest">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-label text-[10px] text-on-surface-variant">{completedCount}/{lessons.length}</span>
                  <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
              </button>

              {/* Progress bar always visible */}
              {!isUnitComplete && (
                <div className="h-0.5 w-full bg-surface-container-highest">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-700"
                    style={{ width: `${lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0}%` }}
                  />
                </div>
              )}

              {/* Lesson cards — collapsible */}
              {isExpanded && (
                <div className="px-6 pb-5 pt-3">
                  <UnitSection
                    unitId={unitId}
                    unitTitle={UNIT_TITLES[unitId] ?? unitId}
                    lessons={lessons}
                    progress={progress}
                    hideHeader
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
