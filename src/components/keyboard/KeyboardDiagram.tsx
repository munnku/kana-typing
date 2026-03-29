'use client';
import { KEY_INFO, KEYBOARD_ROWS, FINGER_COLORS } from '@/data/keyboardLayout';

interface KeyboardDiagramProps {
  /** ハイライトするキーの配列 */
  highlightKeys: string[];
}

export function KeyboardDiagram({ highlightKeys }: KeyboardDiagramProps) {
  const highlightSet = new Set(highlightKeys.map(k => k.toLowerCase()));

  return (
    <div className="w-full flex flex-col items-center gap-1 select-none">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1" style={{ paddingLeft: rowIdx === 1 ? '0.75rem' : rowIdx === 2 ? '1.5rem' : 0 }}>
          {row.map(({ key }) => {
            const info = KEY_INFO[key];
            const isActive = highlightSet.has(key);
            const color = isActive && info ? FINGER_COLORS[info.finger] : undefined;
            return (
              <div
                key={key}
                className={`
                  w-8 h-8 rounded-md flex items-center justify-center
                  font-mono text-[11px] font-bold uppercase
                  transition-all duration-200
                  ${isActive
                    ? 'text-white shadow-md animate-key-press'
                    : 'bg-surface-container-high text-on-surface-variant/50 border border-outline-variant/30'
                  }
                `}
                style={isActive && color ? {
                  backgroundColor: color,
                  boxShadow: `0 3px 0 rgba(0,0,0,0.25), 0 0 8px ${color}55`,
                } : undefined}
              >
                {key === ';' ? ';' : info?.label ?? key.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
      {/* Space bar */}
      <div className="flex gap-1 mt-0.5">
        <div
          className={`
            h-7 rounded-md flex items-center justify-center
            font-mono text-[10px] font-bold
            transition-all duration-200
            ${highlightSet.has(' ')
              ? 'text-white shadow-md animate-key-press'
              : 'bg-surface-container-high text-on-surface-variant/50 border border-outline-variant/30'
            }
          `}
          style={{
            width: '10.5rem',
            ...(highlightSet.has(' ') ? {
              backgroundColor: FINGER_COLORS['right-thumb'],
              boxShadow: `0 3px 0 rgba(0,0,0,0.25), 0 0 8px ${FINGER_COLORS['right-thumb']}55`,
            } : {}),
          }}
        >
          Space
        </div>
      </div>
    </div>
  );
}
