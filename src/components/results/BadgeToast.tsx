'use client';
import { useEffect, useState } from 'react';
import type { BadgeDefinition } from '@/types';

interface BadgeToastProps {
  badges: BadgeDefinition[];
}

export function BadgeToast({ badges }: BadgeToastProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (badges.length === 0) return;
    setVisible(true);
    setCurrentIndex(0);
  }, [badges]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setVisible(false);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [visible, currentIndex, badges.length]);

  if (!visible || badges.length === 0) return null;
  const badge = badges[currentIndex];
  if (!badge) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-yellow-400 text-gray-900 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 max-w-xs">
        <span className="text-4xl">{badge.icon}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">バッジ獲得！</p>
          <p className="font-bold text-lg">{badge.title}</p>
          <p className="text-sm opacity-80">{badge.description}</p>
        </div>
      </div>
    </div>
  );
}
