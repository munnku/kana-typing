'use client';
import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import { BADGE_DEFINITIONS } from '@/lib/constants';
import { cn } from '@/lib/cn';

export default function BadgesPage() {
  const [earnedIds, setEarnedIds] = useState<string[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setEarnedIds(p.badges);
  }, []);

  const earned = BADGE_DEFINITIONS.filter(b => earnedIds.includes(b.id));
  const unearned = BADGE_DEFINITIONS.filter(b => !earnedIds.includes(b.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">バッジ</h1>
        <p className="text-gray-500 mt-1">{earned.length} / {BADGE_DEFINITIONS.length} 獲得</p>
      </div>

      {earned.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">獲得済み</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {earned.map(badge => (
              <div key={badge.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                <span className="text-4xl">{badge.icon}</span>
                <p className="font-bold text-gray-800 mt-2 text-sm">{badge.title}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">未獲得</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {unearned.map(badge => (
            <div key={badge.id} className={cn('bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-center opacity-60')}>
              <span className="text-4xl grayscale">{badge.icon}</span>
              <p className="font-bold text-gray-500 mt-2 text-sm">{badge.title}</p>
              <p className="text-xs text-gray-400 mt-1">{badge.condition}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
