'use client';

import type { UserProgress, AppSettings, LessonProgress, SessionResult, TestResult } from '@/types';
import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION, DEFAULT_SETTINGS, xpToLevel } from './constants';

// Initial progress state
function createInitialProgress(): UserProgress {
  return {
    version: CURRENT_SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
    xp: 0,
    level: 1,
    streakDays: 0,
    lastPracticeDate: null,
    longestStreak: 0,
    totalSessions: 0,
    totalTimeSeconds: 0,
    totalKeystrokes: 0,
    lessons: {},
    badges: [],
    weakKeys: {},
  };
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// In-memory fallback for when localStorage is unavailable
let memoryProgress: UserProgress | null = null;
let memorySettings: AppSettings | null = null;

function isValidProgress(obj: unknown): obj is UserProgress {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.version === 'number' &&
    typeof o.xp === 'number' &&
    typeof o.level === 'number' &&
    typeof o.totalSessions === 'number' &&
    Array.isArray(o.badges) &&
    typeof o.lessons === 'object' && o.lessons !== null
  );
}

function isValidSettings(obj: unknown): obj is Partial<AppSettings> {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  const validThemes = ['light', 'dark', 'blue'];
  const validFontSizes = ['sm', 'md', 'lg'];
  const validRomaji = ['always', 'fadein', 'never'];
  if ('theme' in o && !validThemes.includes(o.theme as string)) return false;
  if ('fontSize' in o && !validFontSizes.includes(o.fontSize as string)) return false;
  if ('romajiGuide' in o && !validRomaji.includes(o.romajiGuide as string)) return false;
  return true;
}

export function loadProgress(): UserProgress {
  if (!isBrowser()) return createInitialProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return createInitialProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProgress(parsed)) return createInitialProgress();
    // Migration
    if (parsed.version !== CURRENT_SCHEMA_VERSION) {
      const migrated = migrateProgress(parsed);
      saveProgress(migrated);
      return migrated;
    }
    return parsed;
  } catch {
    return memoryProgress ?? createInitialProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  const updated = { ...progress, lastUpdated: new Date().toISOString() };
  if (!isBrowser()) {
    memoryProgress = updated;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
  } catch {
    memoryProgress = updated;
  }
}

export function loadSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidSettings(parsed)) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return memorySettings ?? DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (!isBrowser()) {
    memorySettings = settings;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    memorySettings = settings;
  }
}

export function getLessonProgress(lessonId: string): LessonProgress {
  const progress = loadProgress();
  return progress.lessons[lessonId] ?? {
    lessonId,
    unlocked: false,
    completed: false,
    bestKpm: 0,
    bestAccuracy: 0,
    stars: 0,
    attempts: 0,
    lastPlayedAt: null,
    history: [],
  };
}

export function updateLessonProgress(result: SessionResult, nextLessonId?: string): UserProgress {
  const progress = loadProgress();
  const existing = progress.lessons[result.lessonId] ?? {
    lessonId: result.lessonId,
    unlocked: true,
    completed: false,
    bestKpm: 0,
    bestAccuracy: 0,
    stars: 0,
    attempts: 0,
    lastPlayedAt: null,
    history: [],
  };

  const newHistory = [
    { kpm: result.kpm, accuracy: result.accuracy, date: result.completedAt },
    ...existing.history,
  ].slice(0, 10);

  const updated: LessonProgress = {
    ...existing,
    completed: true,
    bestKpm: Math.max(existing.bestKpm, result.kpm),
    bestAccuracy: Math.max(existing.bestAccuracy, result.accuracy),
    stars: Math.max(existing.stars, result.stars) as 0 | 1 | 2 | 3,
    attempts: existing.attempts + 1,
    lastPlayedAt: result.completedAt,
    history: newHistory,
  };

  const newProgress: UserProgress = {
    ...progress,
    xp: progress.xp + result.xpEarned,
    level: xpToLevel(progress.xp + result.xpEarned),
    totalSessions: progress.totalSessions + 1,
    totalTimeSeconds: progress.totalTimeSeconds + result.durationSeconds,
    totalKeystrokes: progress.totalKeystrokes + result.correctChars,
    lessons: { ...progress.lessons, [result.lessonId]: updated },
  };

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastDate = progress.lastPracticeDate;
  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastDate === yesterday ? progress.streakDays + 1 : 1;
    newProgress.streakDays = newStreak;
    newProgress.longestStreak = Math.max(progress.longestStreak, newStreak);
    newProgress.lastPracticeDate = today;
  }

  // Unlock next lesson
  if (nextLessonId && result.stars >= 1) {
    const nextLesson = newProgress.lessons[nextLessonId] ?? {
      lessonId: nextLessonId,
      unlocked: false,
      completed: false,
      bestKpm: 0,
      bestAccuracy: 0,
      stars: 0,
      attempts: 0,
      lastPlayedAt: null,
      history: [],
    };
    newProgress.lessons[nextLessonId] = { ...nextLesson, unlocked: true };
  }

  saveProgress(newProgress);
  return newProgress;
}

export function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) return false;
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS);
}

function migrateProgress(old: UserProgress): UserProgress {
  const base = { ...createInitialProgress(), ...old };

  // v1 → v2: kpm フィールドが旧KPM値（>20）で保存されていた場合、CPS（÷60）に変換
  if ((old.version ?? 0) < 2) {
    const convertedLessons: UserProgress['lessons'] = {};
    for (const [id, lp] of Object.entries(base.lessons)) {
      const convertedHistory = lp.history.map(h => ({
        ...h,
        kpm: h.kpm > 20 ? Math.round((h.kpm / 60) * 10) / 10 : h.kpm,
      }));
      convertedLessons[id] = {
        ...lp,
        bestKpm: lp.bestKpm > 20 ? Math.round((lp.bestKpm / 60) * 10) / 10 : lp.bestKpm,
        bestAccuracy: Math.min(100, lp.bestAccuracy),
        history: convertedHistory,
      };
    }
    base.lessons = convertedLessons;
  }

  return { ...base, version: CURRENT_SCHEMA_VERSION };
}

export function saveTestResult(result: TestResult): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    const parsedRaw: unknown = raw ? JSON.parse(raw) : [];
    const existing: TestResult[] = Array.isArray(parsedRaw) ? parsedRaw : [];
    const updated = [result, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function loadTestResults(): TestResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    const results: TestResult[] = Array.isArray(parsed) ? parsed : [];
    // Migrate old KPM values (>20) to CPS
    return results.map(r => ({
      ...r,
      kpm: r.kpm > 20 ? Math.round((r.kpm / 60) * 10) / 10 : r.kpm,
      accuracy: Math.min(100, r.accuracy),
    }));
  } catch {
    return [];
  }
}
