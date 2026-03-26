'use client';

import { useEffect, useRef } from 'react';
import { loadSettings } from '@/lib/storage';

// Singleton audio element — persists across route changes
let bgmAudio: HTMLAudioElement | null = null;
let currentTrack: number = 0;

function getBgmAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.loop = true;
    bgmAudio.preload = 'none';
  }
  return bgmAudio;
}

export function startBgm() {
  const settings = loadSettings();
  if (!settings.bgmEnabled) return;

  const audio = getBgmAudio();
  if (!audio) return;

  const trackNum = settings.bgmTrack ?? 1;
  const src = `/sounds/bgm-${trackNum}.mp3`;

  // Only reload if track changed
  if (currentTrack !== trackNum || audio.src === '' || !audio.src.endsWith(`bgm-${trackNum}.mp3`)) {
    audio.src = src;
    currentTrack = trackNum;
  }

  audio.volume = settings.bgmVolume ?? 0.35;
  audio.play().catch(() => {/* autoplay policy — will retry on next user interaction */});
}

export function stopBgm() {
  const audio = getBgmAudio();
  if (!audio) return;
  audio.pause();
}

export function isBgmPlaying(): boolean {
  return bgmAudio !== null && !bgmAudio.paused;
}

/**
 * Hook: BGMをこのページでは流す（BGM対象ページ用）
 * レッスン/テスト/結果ページでは使わない
 */
export function useBgm() {
  const startedRef = useRef(false);

  useEffect(() => {
    startBgm();
    startedRef.current = true;

    // When navigating away, stop BGM if destination is lesson/test/results
    return () => {
      // BGM停止はBGM非対象ページ側（useBgmStop）が担当
    };
  }, []);

  // Re-sync when settings change (e.g. track or volume updated)
  useEffect(() => {
    const handler = () => {
      const audio = getBgmAudio();
      if (!audio) return;
      const settings = loadSettings();
      if (!settings.bgmEnabled) {
        audio.pause();
        return;
      }
      const newSrc = `/sounds/bgm-${settings.bgmTrack}.mp3`;
      if (!audio.src.endsWith(`bgm-${settings.bgmTrack}.mp3`)) {
        audio.src = newSrc;
        currentTrack = settings.bgmTrack;
        audio.play().catch(() => {});
      }
      audio.volume = settings.bgmVolume ?? 0.35;
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
}

/**
 * Hook: このページではBGMを止める（レッスン/テスト/結果ページ用）
 */
export function useBgmStop() {
  useEffect(() => {
    stopBgm();
    return () => {
      // ページを離れたらBGM再開（BGM対象ページなら useBgm が再開する）
    };
  }, []);
}
