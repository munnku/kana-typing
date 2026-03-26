'use client';
import Link from 'next/link';
import type { Lesson } from '@/types';

interface LessonHeaderProps {
  lesson: Lesson;
  onRestart: () => void;
}

export function LessonHeader({ lesson, onRestart }: LessonHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="text-sm text-gray-500">{lesson.unitTitle}</div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="レッスンをやり直す"
        >
          やり直す
        </button>
        <Link
          href="/lessons"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="レッスン一覧に戻る"
        >
          一覧へ
        </Link>
      </div>
    </div>
  );
}
