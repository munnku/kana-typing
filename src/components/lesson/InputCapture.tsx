'use client';
import { useEffect } from 'react';

interface InputCaptureProps {
  onKey: (key: string) => void;
  active: boolean;
}

const IGNORED_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
  ' ', 'Enter',
]);

export function InputCapture({ onKey, active }: InputCaptureProps) {
  useEffect(() => {
    if (!active) return;

    const handler = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if (IGNORED_KEYS.has(e.key)) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length !== 1) return;
      e.preventDefault();
      onKey(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onKey]);

  return null;
}
