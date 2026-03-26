'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
  }, [running, elapsed]);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    startTimeRef.current = null;
  }, [stop]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return { elapsed, running, start, stop, reset };
}
