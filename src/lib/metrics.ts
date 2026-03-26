import { STAR_THRESHOLDS_BY_UNIT } from './constants';

// CPS = Characters Per Second (1秒あたりの正解文字数)
// kpm フィールドには CPS 値を小数1桁で格納する（互換性のため変数名は kpm のまま）
export function computeKpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1) return 0;
  // Return CPS as a number with 1 decimal place stored as-is (e.g. 2.3)
  return Math.round((correctChars / elapsedSeconds) * 10) / 10;
}

// correctKeystrokes = keystrokes that were not errors (i.e. keystrokes - errorCount)
export function computeAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes === 0) return 100;
  const ratio = Math.min(1, Math.max(0, correctKeystrokes / totalKeystrokes));
  return Math.round(ratio * 1000) / 10;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function computeStars(kpm: number, accuracy: number, unitIndex: number): 0 | 1 | 2 | 3 {
  // kpm here is actually CPS; thresholds in constants.ts are already in CPS units
  const thresholds = STAR_THRESHOLDS_BY_UNIT[0];
  if (kpm >= thresholds.three.kpm && accuracy >= thresholds.three.accuracy) return 3;
  if (kpm >= thresholds.two.kpm && accuracy >= thresholds.two.accuracy) return 2;
  if (kpm >= thresholds.one.kpm && accuracy >= thresholds.one.accuracy) return 1;
  return 0;
}

export function computeXpReward(stars: 0 | 1 | 2 | 3): number {
  const xpMap: Record<number, number> = { 0: 5, 1: 10, 2: 20, 3: 40 };
  return xpMap[stars] ?? 5;
}

// Format CPS value for display
export function formatKpm(cps: number): string {
  return `${cps.toFixed(1)} CPS`;
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}秒`;
  return `${m}分${s.toString().padStart(2, '0')}秒`;
}
