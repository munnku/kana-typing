import type { Lesson, UserProgress } from '@/types';
import { LessonCard } from './LessonCard';

interface UnitSectionProps {
  unitId: string;
  unitTitle: string;
  lessons: Lesson[];
  progress: UserProgress;
  hideHeader?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UnitSection({ unitId, unitTitle, lessons, progress, hideHeader }: UnitSectionProps) {
  const completed = lessons.filter(l => progress.lessons[l.id]?.completed).length;
  const pct = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
  const isUnitComplete = completed === lessons.length && lessons.length > 0;

  if (hideHeader) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progress.lessons[lesson.id] ?? null}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="bg-surface-container-low border border-[#464555]/10 rounded-lg p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold text-sm flex-shrink-0 ${
            isUnitComplete
              ? 'bg-secondary text-on-secondary'
              : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            {isUnitComplete
              ? <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              : <span className="text-xs">{pct}%</span>
            }
          </div>
          <h2 className="font-headline font-bold text-base text-on-surface">{unitTitle}</h2>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {completed} / {lessons.length} 完了
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isUnitComplete ? 'bg-secondary shadow-glow-green' : 'bg-gradient-to-r from-primary to-primary-container'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progress.lessons[lesson.id] ?? null}
          />
        ))}
      </div>
    </section>
  );
}
