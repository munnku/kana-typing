import type { BadgeDefinition, AppSettings } from '@/types';

// Star thresholds per unit (0-indexed unit number)
// kpm values are now CPS (Characters Per Second) — converted from original KPM ÷ 60
export const STAR_THRESHOLDS_BY_UNIT = [
  // Unit 0: ホームポジション  (1.0 / 1.7 / 2.3 CPS)
  { one: { kpm: 1.0, accuracy: 75 }, two: { kpm: 1.7, accuracy: 85 }, three: { kpm: 2.3, accuracy: 95 } },
  // Unit 1: あ行
  { one: { kpm: 1.0, accuracy: 75 }, two: { kpm: 1.7, accuracy: 85 }, three: { kpm: 2.5, accuracy: 95 } },
  // Unit 2: か行
  { one: { kpm: 1.2, accuracy: 75 }, two: { kpm: 1.8, accuracy: 85 }, three: { kpm: 2.7, accuracy: 95 } },
  // Unit 3: さ行
  { one: { kpm: 1.2, accuracy: 75 }, two: { kpm: 1.8, accuracy: 85 }, three: { kpm: 2.7, accuracy: 95 } },
  // Unit 4: た行
  { one: { kpm: 1.3, accuracy: 78 }, two: { kpm: 2.0, accuracy: 87 }, three: { kpm: 2.8, accuracy: 95 } },
  // Unit 5: な行
  { one: { kpm: 1.3, accuracy: 78 }, two: { kpm: 2.0, accuracy: 87 }, three: { kpm: 2.8, accuracy: 95 } },
  // Unit 6: は行
  { one: { kpm: 1.3, accuracy: 78 }, two: { kpm: 2.0, accuracy: 87 }, three: { kpm: 2.8, accuracy: 95 } },
  // Unit 7: ま行
  { one: { kpm: 1.5, accuracy: 80 }, two: { kpm: 2.2, accuracy: 88 }, three: { kpm: 3.0, accuracy: 96 } },
  // Unit 8: や行・わ行・ん
  { one: { kpm: 1.5, accuracy: 80 }, two: { kpm: 2.2, accuracy: 88 }, three: { kpm: 3.0, accuracy: 96 } },
  // Unit 9: ら行
  { one: { kpm: 1.5, accuracy: 80 }, two: { kpm: 2.2, accuracy: 88 }, three: { kpm: 3.0, accuracy: 96 } },
  // Unit 10: が行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 11: ざ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 12: だ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 13: ば行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 14: ぱ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 15: きゃ行・しゃ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 16: ちゃ行・にゃ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 17: ひゃ・みゃ・りゃ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 18: ぎゃ・じゃ・びゃ・ぴゃ行
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 19: 句読点・長音符
  { one: { kpm: 1.7, accuracy: 80 }, two: { kpm: 2.5, accuracy: 88 }, three: { kpm: 3.3, accuracy: 96 } },
  // Unit 20: 総合練習
  { one: { kpm: 2.0, accuracy: 82 }, two: { kpm: 2.8, accuracy: 90 }, three: { kpm: 3.7, accuracy: 97 } },
] as const;

// XP rewards
export const XP_REWARDS = {
  LESSON_1_STAR: 10,
  LESSON_2_STAR: 20,
  LESSON_3_STAR: 40,
  TEST_PASS: 30,
  DAILY_PRACTICE: 5,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  BADGE_EARNED: 25,
} as const;

// Level thresholds (xp required to reach each level)
export const LEVEL_THRESHOLDS = [
  0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000,
  4000, 5200, 6600, 8200, 10000,
] as const;

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function xpForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

// Badge definitions
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_lesson', title: '第一歩', description: '初めてレッスンを完了した', icon: '🌱', condition: '初めてレッスンを完了する' },
  { id: 'home_row_master', title: 'ホームロー マスター', description: 'Unit 0 を全て星2以上でクリア', icon: '🏠', condition: 'Unit 0 を全て星2以上でクリア' },
  { id: 'aiueo_master', title: 'あいうえおマスター', description: 'あ行テストをクリア', icon: '🎵', condition: 'あ行テストをクリアする' },
  { id: 'speed_100', title: 'スピードスター', description: 'CPS 1.7 以上でレッスン完了', icon: '⚡', condition: 'CPS 1.7 以上でレッスンをクリア' },
  { id: 'speed_200', title: 'タイピングエース', description: 'CPS 3.3 以上でレッスン完了', icon: '🚀', condition: 'CPS 3.3 以上でレッスンをクリア' },
  { id: 'perfect_lesson', title: 'パーフェクト', description: '正確率 100% でレッスン完了', icon: '💎', condition: '正確率100%でレッスンをクリア' },
  { id: 'streak_7', title: '7日連続', description: '7日間連続で練習した', icon: '🔥', condition: '7日間連続で練習する' },
  { id: 'streak_30', title: '30日連続', description: '30日間連続で練習した', icon: '🌟', condition: '30日間連続で練習する' },
  { id: 'dedicated', title: '継続は力なり', description: '累計10セッション完了', icon: '💪', condition: '累計10セッション完了する' },
  { id: 'dakuten_master', title: '濁音マスター', description: 'Unit 10 をクリア', icon: '🎯', condition: '濁音・半濁音ユニットをクリア' },
  { id: 'graduate', title: '卒業生', description: '全レッスンをクリア', icon: '🎓', condition: '全てのレッスンをクリアする' },
  { id: 'all_stars', title: '三ツ星コレクター', description: '10レッスンで星3を取得', icon: '⭐', condition: '10個のレッスンで星3を取得する' },
];

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  showKeyboard: true,
  showFingerGuide: true,
  soundEnabled: false,
  fontSize: 'md',
  theme: 'light',
  romajiGuide: 'always',
};

// Storage keys
export const STORAGE_KEYS = {
  PROGRESS: 'typing_app_progress',
  SETTINGS: 'typing_app_settings',
  TEST_RESULTS: 'typing_app_test_results',
} as const;

export const CURRENT_SCHEMA_VERSION = 2;
