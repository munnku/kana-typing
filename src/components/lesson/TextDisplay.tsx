'use client';
import type { DisplayChar } from '@/types';
import { clsx } from 'clsx';

interface TextDisplayProps {
  chars: DisplayChar[];
  cursorIndex: number;
  romajiGuide: 'always' | 'fadein' | 'never';
  fontSize?: 'sm' | 'md' | 'lg';
}

const fontSizeMap = {
  sm: { kana: 'text-3xl', romaji: 'text-sm' },
  md: { kana: 'text-4xl', romaji: 'text-base' },
  lg: { kana: 'text-5xl', romaji: 'text-lg' },
};

export function TextDisplay({ chars, cursorIndex, romajiGuide, fontSize = 'md' }: TextDisplayProps) {
  const sizes = fontSizeMap[fontSize];

  return (
    <div className="w-full select-none" aria-live="polite" aria-label="タイピングテキスト">
      <div className="flex flex-wrap gap-1 justify-center font-mono">
        {chars.map((char, i) => {
          const isCurrent = i === cursorIndex;
          const isSpace = char.kana === ' ';

          if (isSpace) {
            return (
              <span key={i} className="inline-flex flex-col items-center">
                <span className={clsx(sizes.kana, 'w-6 h-full', isCurrent && 'bg-yellow-300')}> </span>
                {romajiGuide !== 'never' && <span className={clsx(sizes.romaji, 'text-transparent')}>_</span>}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="inline-flex flex-col items-center"
            >
              <span
                className={clsx(
                  sizes.kana,
                  'px-1 rounded transition-colors duration-75',
                  {
                    'bg-yellow-300 text-gray-900': isCurrent && char.state !== 'error',
                    'bg-red-400 text-white': char.state === 'error',
                    'text-gray-900': char.state === 'correct',
                    'text-gray-400': char.state === 'pending',
                    'text-yellow-600': char.state === 'corrected',
                  }
                )}
              >
                {char.kana}
              </span>
              {romajiGuide !== 'never' && (
                <span
                  className={clsx(
                    sizes.romaji,
                    'font-mono transition-colors duration-75',
                    {
                      'text-yellow-600 font-bold': isCurrent,
                      'text-green-600': char.state === 'correct',
                      'text-red-500': char.state === 'error',
                      'text-gray-400': char.state === 'pending',
                    }
                  )}
                >
                  {isCurrent && char.typedRomaji
                    ? <><span className="text-green-500">{char.typedRomaji}</span><span>{char.displayRomaji.slice(char.typedRomaji.length)}</span></>
                    : char.displayRomaji
                  }
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
