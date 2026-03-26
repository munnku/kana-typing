'use client';
import { useCallback, useReducer } from 'react';
import type { TypingSessionState, DisplayChar, Lesson } from '@/types';
import { textToKanaUnits, matchRomaji, getNextExpectedChars } from '@/data/romajiMap';
import { computeKpm, computeAccuracy, computeStars, computeXpReward } from '@/lib/metrics';

type Action =
  | { type: 'KEY_PRESS'; key: string }
  | { type: 'TICK'; elapsed: number }
  | { type: 'RESET'; chars: DisplayChar[] }
  | { type: 'PAUSE' }
  | { type: 'RESUME' };

function buildDisplayChars(lesson: Lesson): DisplayChar[] {
  const units = textToKanaUnits(lesson.text);
  return units.map((u, i) => ({
    kana: u.kana,
    displayRomaji: u.displayRomaji,
    acceptedRomaji: u.romaji,
    state: i === 0 ? 'current' : 'pending',
    typedRomaji: '',
  }));
}

function reducer(state: TypingSessionState, action: Action): TypingSessionState {
  switch (action.type) {
    case 'RESET':
      return {
        status: 'idle',
        chars: action.chars,
        cursorIndex: 0,
        partialRomaji: '',
        errorCount: 0,
        keystrokeCount: 0,
        startedAt: null,
        elapsedSeconds: 0,
      };

    case 'TICK':
      return { ...state, elapsedSeconds: action.elapsed };

    case 'PAUSE':
      return state.status === 'active' ? { ...state, status: 'paused' } : state;

    case 'RESUME':
      return state.status === 'paused' ? { ...state, status: 'active' } : state;

    case 'KEY_PRESS': {
      if (state.status === 'complete' || state.status === 'paused') return state;

      const { key } = action;
      // Reject if key is not a single printable ASCII character
      if (key.length !== 1 || key.charCodeAt(0) < 32 || key.charCodeAt(0) > 126) return state;
      const newStatus = state.status === 'idle' ? 'active' : state.status;
      const startedAt = state.startedAt ?? Date.now();
      // Limit partial buffer to prevent memory abuse
      if (state.partialRomaji.length >= 10) return { ...state, partialRomaji: '' };
      const newPartial = state.partialRomaji + key;
      const currentChar = state.chars[state.cursorIndex];

      if (!currentChar) return state;

      const matchResult = matchRomaji(newPartial, currentChar.acceptedRomaji);

      if (matchResult === 'complete') {
        // Correct: advance cursor, auto-skip spaces
        let nextIndex = state.cursorIndex + 1;
        // Find next non-space position
        while (nextIndex < state.chars.length && state.chars[nextIndex].kana === ' ') {
          nextIndex++;
        }
        const isComplete = nextIndex >= state.chars.length;
        const newChars = state.chars.map((c, i) => {
          if (i === state.cursorIndex) return { ...c, state: 'correct' as const, typedRomaji: newPartial };
          // Mark skipped spaces as correct
          if (i > state.cursorIndex && i < nextIndex && c.kana === ' ') return { ...c, state: 'correct' as const };
          if (i === nextIndex && !isComplete) return { ...c, state: 'current' as const };
          return c;
        });
        return {
          ...state,
          status: isComplete ? 'complete' : newStatus,
          chars: newChars,
          cursorIndex: nextIndex,
          partialRomaji: '',
          keystrokeCount: state.keystrokeCount + 1,
          startedAt,
        };
      } else if (matchResult === 'partial') {
        // Partial match: update display
        const newChars = state.chars.map((c, i) => {
          if (i === state.cursorIndex) return { ...c, typedRomaji: newPartial };
          return c;
        });
        return {
          ...state,
          status: newStatus,
          chars: newChars,
          partialRomaji: newPartial,
          keystrokeCount: state.keystrokeCount + 1,
          startedAt,
        };
      } else {
        // No match: error
        // Try matching just the new key alone (restart partial)
        const singleMatch = matchRomaji(key, currentChar.acceptedRomaji);
        let newChars = state.chars.map((c, i) => {
          if (i === state.cursorIndex) return { ...c, state: 'error' as const };
          return c;
        });

        // Reset error state after short delay via partial reset
        if (singleMatch !== 'no-match') {
          // The new key starts a fresh partial
          newChars = state.chars.map((c, i) => {
            if (i === state.cursorIndex) return { ...c, state: 'current' as const, typedRomaji: key };
            return c;
          });
          return {
            ...state,
            status: newStatus,
            chars: newChars,
            partialRomaji: key,
            errorCount: state.errorCount + 1,
            keystrokeCount: state.keystrokeCount + 1,
            startedAt,
          };
        }

        return {
          ...state,
          status: newStatus,
          chars: newChars,
          partialRomaji: '',
          errorCount: state.errorCount + 1,
          keystrokeCount: state.keystrokeCount + 1,
          startedAt,
        };
      }
    }
  }
}

export function useTypingEngine(lesson: Lesson, unitIndex: number) {
  const initialChars = buildDisplayChars(lesson);
  const initialState: TypingSessionState = {
    status: 'idle',
    chars: initialChars,
    cursorIndex: 0,
    partialRomaji: '',
    errorCount: 0,
    keystrokeCount: 0,
    startedAt: null,
    elapsedSeconds: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleKey = useCallback((key: string) => {
    dispatch({ type: 'KEY_PRESS', key });
  }, []);

  const reset = useCallback(() => {
    const chars = buildDisplayChars(lesson);
    dispatch({ type: 'RESET', chars });
  }, [lesson]);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const tick = useCallback((elapsed: number) => dispatch({ type: 'TICK', elapsed }), []);

  // Derived metrics
  // correctChars: kana chars completed (for progress display)
  const correctChars = state.chars.filter(c => c.state === 'correct' && c.kana !== ' ').length;
  // correctKeystrokes = actual correct key presses (total - errors), clamped to 0
  const correctKeystrokes = Math.max(0, state.keystrokeCount - state.errorCount);
  // CPS: count actual romaji keystrokes for completed kana chars (e.g. "ka" = 2 keys, not 1 char)
  const correctTypedKeys = state.chars
    .filter(c => c.state === 'correct' && c.kana !== ' ')
    .reduce((sum, c) => sum + (c.typedRomaji.length > 0 ? c.typedRomaji.length : (c.acceptedRomaji[0]?.length ?? 1)), 0);
  const kpm = computeKpm(correctTypedKeys, state.elapsedSeconds);
  const accuracy = computeAccuracy(correctKeystrokes, state.keystrokeCount);
  const stars = computeStars(kpm, accuracy, unitIndex);
  const xpEarned = computeXpReward(stars);

  // Next expected keys for keyboard highlight
  const currentChar = state.chars[state.cursorIndex];
  const nextExpectedKeys = currentChar
    ? getNextExpectedChars(currentChar.acceptedRomaji, state.partialRomaji)
    : [];

  return {
    state,
    kpm,
    accuracy,
    stars,
    xpEarned,
    correctChars,
    nextExpectedKeys,
    handleKey,
    reset,
    pause,
    resume,
    tick,
  };
}
