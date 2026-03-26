'use client';
import Link from 'next/link';
import type { Lesson, LessonProgress } from '@/types';
import { StarDisplay } from '@/components/shared/StarDisplay';

interface LessonCardProps {
  lesson: Lesson;
  progress: LessonProgress | null;
}

const typeLabels: Record<string, string> = {
  intro:    '導入',
  practice: '練習',
  words:    '単語',
  test:     'テスト',
};

const typeBadgeColors: Record<string, string> = {
  intro:    'bg-primary/10 text-primary',
  practice: 'bg-secondary/10 text-secondary',
  words:    'bg-tertiary/10 text-tertiary',
  test:     'bg-[#ffb4ab]/10 text-[#ffb4ab]',
};

export function LessonCard({ lesson, progress }: LessonCardProps) {
  const isUnlocked = progress?.unlocked ?? (lesson.id === 'u0-l01');
  const isCompleted = progress?.completed ?? false;
  const stars = (progress?.stars ?? 0) as 0 | 1 | 2 | 3;

  if (!isUnlocked) {
    return (
      <div className="relative p-4 bg-surface-container-highest/30 border border-[#464555]/10 rounded-xl opacity-50">
        <div className="absolute top-3 right-3">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">lock</span>
        </div>
        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-label font-semibold mb-2 bg-surface-container-highest text-on-surface-variant`}>
          {typeLabels[lesson.type]}
        </span>
        <p className="font-headline text-sm font-medium text-on-surface-variant">{lesson.title}</p>
      </div>
    );
  }

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 group ${
        isCompleted
          ? 'bg-surface-container-high border-secondary/20 hover:border-secondary/50'
          : 'bg-surface-container-high border-[#464555]/20 hover:border-primary/30'
      }`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1", fontSize: '12px' }}>check</span>
        </div>
      )}
      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-label font-semibold mb-2 ${typeBadgeColors[lesson.type] ?? 'bg-surface-container-highest text-on-surface-variant'}`}>
        {typeLabels[lesson.type]}
      </span>
      <p className="font-headline text-sm font-semibold text-on-surface mb-3 leading-snug">{lesson.title}</p>
      <div className="flex items-center justify-between mt-auto">
        <StarDisplay stars={stars} size="sm" />
        {progress?.bestKpm ? (
          <span className="font-label text-[10px] text-on-surface-variant">{progress.bestKpm} KPM</span>
        ) : null}
      </div>
    </Link>
  );
}
