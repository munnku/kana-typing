'use client';
import { useMemo } from 'react';
import { KeyCap } from './KeyCap';
import { FingerGuide } from './FingerGuide';
import { KEYBOARD_ROWS, KEY_INFO } from '@/data/keyboardLayout';

interface OnScreenKeyboardProps {
  activeKeys: string[];       // keys to highlight (next expected)
  showFingerGuide: boolean;
}

export function OnScreenKeyboard({ activeKeys, showFingerGuide }: OnScreenKeyboardProps) {
  const activeSet = useMemo(() => new Set(activeKeys), [activeKeys]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-inner">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1 justify-center mb-1 ${rowIndex === 1 ? 'ml-6' : rowIndex === 2 ? 'ml-12' : ''}`}>
            {row.map(({ key }) => {
              const info = KEY_INFO[key];
              if (!info) return null;
              return (
                <KeyCap
                  key={key}
                  keyChar={key}
                  info={info}
                  isActive={activeSet.has(key)}
                  isPressed={false}
                  showFingerColor={showFingerGuide}
                />
              );
            })}
          </div>
        ))}
        {/* Space bar row */}
        <div className="flex gap-1 justify-center mt-1">
          {KEY_INFO[' '] && (
            <div
              className={`h-10 flex items-center justify-center rounded-lg border-2 font-mono text-sm font-bold transition-all duration-75 select-none ${
                activeSet.has(' ')
                  ? 'border-yellow-400 bg-yellow-300 text-gray-900 scale-105 shadow-lg'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
              style={{ width: '280px' }}
              aria-label="スペースキー"
            >
              Space
            </div>
          )}
        </div>
      </div>
      {showFingerGuide && <FingerGuide />}
    </div>
  );
}
