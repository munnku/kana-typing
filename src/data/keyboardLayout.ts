import type { KeyInfo, FingerName } from '@/types';

export const KEY_INFO: Record<string, KeyInfo> = {
  // Number row
  '1': { finger: 'left-pinky', hand: 'left', label: '1', shiftLabel: '!' },
  '2': { finger: 'left-ring', hand: 'left', label: '2', shiftLabel: '@' },
  '3': { finger: 'left-middle', hand: 'left', label: '3', shiftLabel: '#' },
  '4': { finger: 'left-index', hand: 'left', label: '4', shiftLabel: '$' },
  '5': { finger: 'left-index', hand: 'left', label: '5', shiftLabel: '%' },
  '6': { finger: 'right-index', hand: 'right', label: '6', shiftLabel: '^' },
  '7': { finger: 'right-index', hand: 'right', label: '7', shiftLabel: '&' },
  '8': { finger: 'right-middle', hand: 'right', label: '8', shiftLabel: '*' },
  '9': { finger: 'right-ring', hand: 'right', label: '9', shiftLabel: '(' },
  '0': { finger: 'right-pinky', hand: 'right', label: '0', shiftLabel: ')' },
  // Top row
  'q': { finger: 'left-pinky', hand: 'left', label: 'Q' },
  'w': { finger: 'left-ring', hand: 'left', label: 'W' },
  'e': { finger: 'left-middle', hand: 'left', label: 'E' },
  'r': { finger: 'left-index', hand: 'left', label: 'R' },
  't': { finger: 'left-index', hand: 'left', label: 'T' },
  'y': { finger: 'right-index', hand: 'right', label: 'Y' },
  'u': { finger: 'right-index', hand: 'right', label: 'U' },
  'i': { finger: 'right-middle', hand: 'right', label: 'I' },
  'o': { finger: 'right-ring', hand: 'right', label: 'O' },
  'p': { finger: 'right-pinky', hand: 'right', label: 'P' },
  // Home row
  'a': { finger: 'left-pinky', hand: 'left', label: 'A' },
  's': { finger: 'left-ring', hand: 'left', label: 'S' },
  'd': { finger: 'left-middle', hand: 'left', label: 'D' },
  'f': { finger: 'left-index', hand: 'left', label: 'F' },
  'g': { finger: 'left-index', hand: 'left', label: 'G' },
  'h': { finger: 'right-index', hand: 'right', label: 'H' },
  'j': { finger: 'right-index', hand: 'right', label: 'J' },
  'k': { finger: 'right-middle', hand: 'right', label: 'K' },
  'l': { finger: 'right-ring', hand: 'right', label: 'L' },
  ';': { finger: 'right-pinky', hand: 'right', label: ';', shiftLabel: ':' },
  // Bottom row
  'z': { finger: 'left-pinky', hand: 'left', label: 'Z' },
  'x': { finger: 'left-ring', hand: 'left', label: 'X' },
  'c': { finger: 'left-middle', hand: 'left', label: 'C' },
  'v': { finger: 'left-index', hand: 'left', label: 'V' },
  'b': { finger: 'left-index', hand: 'left', label: 'B' },
  'n': { finger: 'right-index', hand: 'right', label: 'N' },
  'm': { finger: 'right-index', hand: 'right', label: 'M' },
  ',': { finger: 'right-middle', hand: 'right', label: ',', shiftLabel: '<' },
  '.': { finger: 'right-ring', hand: 'right', label: '.', shiftLabel: '>' },
  '/': { finger: 'right-pinky', hand: 'right', label: '/', shiftLabel: '?' },
  ' ': { finger: 'right-thumb', hand: 'right', label: 'Space' },
};

export const FINGER_COLORS: Record<FingerName, string> = {
  'left-pinky': '#ef4444',    // red
  'left-ring': '#f97316',     // orange
  'left-middle': '#eab308',   // yellow
  'left-index': '#22c55e',    // green
  'left-thumb': '#8b5cf6',    // purple
  'right-thumb': '#8b5cf6',   // purple
  'right-index': '#3b82f6',   // blue
  'right-middle': '#06b6d4',  // cyan
  'right-ring': '#ec4899',    // pink
  'right-pinky': '#a855f7',   // violet
};

export const FINGER_NAMES_JP: Record<FingerName, string> = {
  'left-pinky': '左 小指',
  'left-ring': '左 薬指',
  'left-middle': '左 中指',
  'left-index': '左 人差し指',
  'left-thumb': '左 親指',
  'right-thumb': '右 親指',
  'right-index': '右 人差し指',
  'right-middle': '右 中指',
  'right-ring': '右 薬指',
  'right-pinky': '右 小指',
};

// Keyboard layout rows for rendering
export const KEYBOARD_ROWS: Array<Array<{ key: string; width?: number }>> = [
  // Top row
  [
    { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' },
    { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' },
  ],
  // Home row
  [
    { key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' },
    { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: ';' },
  ],
  // Bottom row
  [
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' },
    { key: 'n' }, { key: 'm' }, { key: ',' }, { key: '.' }, { key: '/' },
  ],
];
