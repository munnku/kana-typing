'use client';
import type { FingerName } from '@/types';
import { FINGER_COLORS, FINGER_NAMES_JP } from '@/data/keyboardLayout';
import { KEY_INFO } from '@/data/keyboardLayout';

interface HandDiagramProps {
  activeKey: string | null;
  large?: boolean;
}

// Draw thumb before index so index renders on top (consistent with right hand)
const LEFT_FINGERS: FingerName[] = ['left-pinky', 'left-ring', 'left-middle', 'left-thumb', 'left-index'];
const RIGHT_FINGERS: FingerName[] = ['right-thumb', 'right-index', 'right-middle', 'right-ring', 'right-pinky'];

// Left hand (viewed from above, fingers pointing up): pinky=left, thumb=right
// Order matches LEFT_FINGERS: pinky, ring, middle, thumb, index
const LEFT_FINGER_POSITIONS = [
  { x: 10, y: 30, w: 18, h: 60 },  // pinky  (leftmost)
  { x: 32, y: 15, w: 18, h: 75 },  // ring
  { x: 54, y: 10, w: 18, h: 80 },  // middle (tallest)
  { x: 90, y: 55, w: 18, h: 40 },  // thumb  (rightmost, short) — drawn before index
  { x: 76, y: 15, w: 18, h: 75 },  // index  — drawn last, appears on top of thumb
];

// Right hand (viewed from above, fingers pointing up): thumb=left, pinky=right
const RIGHT_FINGER_POSITIONS = [
  { x:  8, y: 55, w: 18, h: 40 },  // thumb  (leftmost, short)
  { x: 22, y: 15, w: 18, h: 75 },  // index
  { x: 44, y: 10, w: 18, h: 80 },  // middle (tallest)
  { x: 66, y: 15, w: 18, h: 75 },  // ring
  { x: 88, y: 30, w: 18, h: 60 },  // pinky  (rightmost)
];

function HandSVG({ side, activeFinger, className }: {
  side: 'left' | 'right';
  activeFinger: FingerName | null;
  className?: string;
}) {
  const fingers = side === 'left' ? LEFT_FINGERS : RIGHT_FINGERS;
  const positions = side === 'left' ? LEFT_FINGER_POSITIONS : RIGHT_FINGER_POSITIONS;

  return (
    <svg
      viewBox="0 0 116 110"
      className={`overflow-visible ${className ?? 'w-[116px] h-[110px]'}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Palm */}
      <rect x="8" y="85" width="100" height="20" rx="4" fill="#e5e7eb" />
      {fingers.map((finger, i) => {
        const pos = positions[i];
        const isActive = finger === activeFinger;
        const color = isActive ? FINGER_COLORS[finger] : '#d1d5db';
        return (
          <rect
            key={finger}
            x={pos.x}
            y={pos.y}
            width={pos.w}
            height={pos.h}
            rx="6"
            fill={color}
            stroke={isActive ? FINGER_COLORS[finger] : '#9ca3af'}
            strokeWidth={isActive ? 2 : 1}
            className={`transition-all duration-200 ${isActive ? 'animate-finger-tap' : ''}`}
            style={{ transformOrigin: `${pos.x + pos.w / 2}px ${pos.y + pos.h}px` }}
          />
        );
      })}
      <rect x="28" y="95" width="60" height="16" rx="8" fill="#374151" />
      <text x="58" y="107" textAnchor="middle" fontSize="11" fontFamily="Arial, Helvetica, sans-serif" fill="white">
        {side === 'left' ? '左手' : '右手'}
      </text>
    </svg>
  );
}

export function HandDiagram({ activeKey, large }: HandDiagramProps) {
  if (!activeKey) return null;

  const keyInfo = KEY_INFO[activeKey];
  if (!keyInfo) return null;

  const activeFinger = keyInfo.finger;
  const isLeft = keyInfo.hand === 'left';

  if (large) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-8 items-end justify-center">
          <HandSVG
            side="left"
            activeFinger={isLeft ? activeFinger : null}
            className="w-[210px] max-w-[38vw] h-auto"
          />
          <HandSVG
            side="right"
            activeFinger={!isLeft ? activeFinger : null}
            className="w-[210px] max-w-[38vw] h-auto"
          />
        </div>
        <div className="flex items-center gap-3 justify-center">
          <div className="w-4 h-4 rounded-full flex-none" style={{ backgroundColor: FINGER_COLORS[activeFinger] }} />
          <span className="text-gray-700 dark:text-gray-200 text-base font-medium whitespace-nowrap">
            {FINGER_NAMES_JP[activeFinger]} で{' '}
            <strong className="text-gray-900 dark:text-white">{keyInfo.label}</strong> を押す
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-8 items-end">
        <HandSVG side="left" activeFinger={isLeft ? activeFinger : null} />
        <HandSVG side="right" activeFinger={!isLeft ? activeFinger : null} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FINGER_COLORS[activeFinger] }} />
        <span className="text-gray-600">{FINGER_NAMES_JP[activeFinger]} で <strong>{keyInfo.label}</strong> を押す</span>
      </div>
    </div>
  );
}
