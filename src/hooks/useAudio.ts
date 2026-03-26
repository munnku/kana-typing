'use client';

import { useCallback, useEffect, useRef } from 'react';
import { loadSettings } from '@/lib/storage';

// C major pentatonic scale: C4 D4 E4 G4 A4 C5
const PENTATONIC_MIDI = [60, 62, 64, 67, 69, 72];
const PENTATONIC_HZ = PENTATONIC_MIDI.map((midi) => 440 * Math.pow(2, (midi - 69) / 12));

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
  const freq = PENTATONIC_HZ[noteIndex % PENTATONIC_HZ.length];

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
      // Play click + ascending pentatonic note
      playClickSound(ctx, 0.6);
      playPentatonicNote(ctx, noteIndexRef.current, 0.5);
      noteIndexRef.current = (noteIndexRef.current + 1) % PENTATONIC_HZ.length;
    } else {
      // Error: just a dull thud, reset progression
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
