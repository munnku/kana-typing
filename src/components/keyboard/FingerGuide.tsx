import { FINGER_COLORS, FINGER_NAMES_JP } from '@/data/keyboardLayout';
import type { FingerName } from '@/types';

const FINGERS_DISPLAY: FingerName[] = [
  'left-pinky', 'left-ring', 'left-middle', 'left-index',
  'right-index', 'right-middle', 'right-ring', 'right-pinky',
];

export function FingerGuide() {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-2">
      {FINGERS_DISPLAY.map(finger => (
        <div key={finger} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: FINGER_COLORS[finger] }}
            aria-hidden="true"
          />
          <span className="text-xs text-gray-500">{FINGER_NAMES_JP[finger]}</span>
        </div>
      ))}
    </div>
  );
}
