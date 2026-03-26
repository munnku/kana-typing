'use client';

import { useCallback, useEffect, useRef } from 'react';
import { loadSettings } from '@/lib/storage';

// C major pentatonic intervals (semitones from root): C D E G A
const PENTATONIC_INTERVALS = [0, 2, 4, 7, 9];
const BASE_MIDI = 48; // C3 — start low so there's plenty of room to climb
const MAX_MIDI = 96;  // C7 — ceiling

function pentatonicHz(noteIndex: number): number {
  const octave = Math.floor(noteIndex / PENTATONIC_INTERVALS.length);
  const degree = noteIndex % PENTATONIC_INTERVALS.length;
  const midi = BASE_MIDI + octave * 12 + PENTATONIC_INTERVALS[degree];
  const clampedMidi = Math.min(midi, MAX_MIDI);
  return 440 * Math.pow(2, (clampedMidi - 69) / 12);
}

// Singleton AudioContext shared across the app
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    sharedCtx = new AudioContext();
  }
  return sharedCtx;
}

async function ensureResumed(ctx: AudioContext) {
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

/** Synthesize a short mechanical click using noise burst */
function playClickSound(ctx: AudioContext, volume: number) {
  const bufferSize = ctx.sampleRate * 0.04; // 40ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 6);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  // High-pass filter to make it sound crisper
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
}

/** Play a pentatonic note (xylophone-like tone) */
function playPentatonicNote(ctx: AudioContext, noteIndex: number, volume: number) {
  const freq = pentatonicHz(noteIndex);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = freq;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

export function useAudio() {
  const noteIndexRef = useRef(0);
  const settingsRef = useRef(loadSettings());

  // Refresh settings on each use
  useEffect(() => {
    settingsRef.current = loadSettings();
  });

  const onKeyPress = useCallback(async (correct: boolean) => {
    const settings = settingsRef.current;
    if (!settings.soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;
    await ensureResumed(ctx);

    if (correct) {
      // Play click + ascending pentatonic note (keeps rising, no wrap-around)
      playClickSound(ctx, 0.6);
      playPentatonicNote(ctx, noteIndexRef.current, 0.5);
      noteIndexRef.current = noteIndexRef.current + 1;
    } else {
      // Error: dull thud, reset progression back to bottom
      playClickSound(ctx, 0.3);
      noteIndexRef.current = 0;
    }
  }, []);

  const resetProgression = useCallback(() => {
    noteIndexRef.current = 0;
  }, []);

  // Call this on first user interaction to unlock AudioContext
  const unlock = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx) await ensureResumed(ctx);
  }, []);

  return { onKeyPress, resetProgression, unlock };
}
