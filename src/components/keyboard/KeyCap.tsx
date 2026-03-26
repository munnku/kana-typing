import { clsx } from 'clsx';
import type { KeyInfo } from '@/types';
import { FINGER_COLORS } from '@/data/keyboardLayout';

interface KeyCapProps {
  keyChar: string;
  info: KeyInfo;
  isActive: boolean;     // currently highlighted as next expected key
  isPressed: boolean;    // visually pressed (brief animation)
  showFingerColor: boolean;
}

export function KeyCap({ keyChar, info, isActive, isPressed, showFingerColor }: KeyCapProps) {
  const fingerColor = FINGER_COLORS[info.finger];
  const isSpace = keyChar === ' ';

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center rounded-lg border-2 font-mono font-bold select-none transition-all duration-75',
        isSpace ? 'col-span-6 h-10 text-xs' : 'w-10 h-10 text-sm',
        {
          'border-yellow-400 bg-yellow-300 text-gray-900 scale-105 shadow-lg': isActive,
          'border-gray-300 bg-white text-gray-700': !isActive && !isPressed,
          'border-gray-400 bg-gray-200 scale-95': isPressed && !isActive,
        }
      )}
      style={showFingerColor && !isActive ? {
        borderBottomColor: fingerColor,
        borderBottomWidth: '3px',
      } : undefined}
      aria-label={`${info.label} キー`}
    >
      {isSpace ? 'Space' : info.label}
      {info.shiftLabel && (
        <span className="absolute top-0.5 right-1 text-xs text-gray-400 leading-none">{info.shiftLabel}</span>
      )}
    </div>
  );
}
