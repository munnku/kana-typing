'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppSettings } from '@/types';
import { loadSettings, saveSettings, clearAllData } from '@/lib/storage';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(loadSettings()); }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (key === 'theme') {
      if (value === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
    if (key === 'fontSize') {
      document.documentElement.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
      document.documentElement.classList.add(`text-size-${value}`);
    }
  }

  function handleReset() { clearAllData(); setShowConfirm(false); router.push('/'); }

  return (
    <div className="min-h-screen px-8 py-10 max-w-4xl">
      <div className="fixed top-0 right-0 -z-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">設定</h1>
        {saved && (
          <span className="ml-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            保存済み
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-primary">palette</span>
            <h2 className="font-headline text-xl font-bold text-on-surface">表示設定</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Theme */}
            <div className="glass-card p-5 rounded-lg border border-[#464555]/10 space-y-4">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">テーマ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => update('theme', 'dark')}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all bg-[#0b1326] ${settings.theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-[#464555]/20'}`}
                >
                  <div className="absolute inset-0 flex flex-col p-2 gap-1.5">
                    <div className="h-1.5 w-10 bg-primary/20 rounded-full" />
                    <div className="h-1.5 w-full bg-[#464555]/10 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-[#464555]/10 rounded-full" />
                  </div>
                  {settings.theme === 'dark' && (
                    <div className="absolute bottom-2 right-2">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-xs font-label text-white">ダーク</span>
                </button>
                <button
                  onClick={() => update('theme', 'light')}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all bg-white ${settings.theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-[#464555]/20'}`}
                >
                  <div className="absolute inset-0 flex flex-col p-2 gap-1.5">
                    <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
                    <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-slate-100 rounded-full" />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity text-xs font-label text-slate-600">ライト</span>
                </button>
              </div>
            </div>

            {/* Font size */}
            <div className="glass-card p-5 rounded-lg border border-[#464555]/10 space-y-4">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">文字サイズ</label>
              <div className="flex p-1 bg-surface-container-lowest rounded-full border border-[#464555]/10">
                {(['sm', 'md', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => update('fontSize', size)}
                    className={`flex-1 py-2 text-xs font-label rounded-full transition-all ${
                      settings.fontSize === size
                        ? 'bg-surface-container-highest text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {size === 'sm' ? '小' : size === 'md' ? '中' : '大'}
                  </button>
                ))}
              </div>
              <p className="font-label text-[10px] text-on-surface-variant/60 italic text-center">フォントサイズを調整</p>
            </div>
          </div>
        </section>

        {/* Audio settings */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-tertiary">volume_up</span>
            <h2 className="font-headline text-xl font-bold text-on-surface">Audio Settings</h2>
          </div>
          <div className="glass-card rounded-lg border border-[#464555]/10 divide-y divide-[#464555]/10 overflow-hidden">
            <ToggleRow
              icon="music_note"
              label="Enable All Audio"
              desc="Master switch for all in-app sounds and music"
              value={settings.soundEnabled}
              onChange={v => update('soundEnabled', v)}
            />
            <ToggleRow
              icon="keyboard"
              label="Typing Sounds"
              desc="Mechanical switch feedback on every keystroke"
              value={settings.soundEnabled}
              onChange={v => update('soundEnabled', v)}
              disabled={!settings.soundEnabled}
            />
            <ToggleRow
              icon="radio"
              label="Background Music (BGM)"
              desc="Lo-fi ambient tracks for deep focus"
              value={false}
              onChange={() => {}}
              disabled={!settings.soundEnabled}
            />
          </div>
        </section>

        {/* Practice settings */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-secondary">tune</span>
            <h2 className="font-headline text-xl font-bold text-on-surface">練習設定</h2>
          </div>
          <div className="glass-card rounded-lg border border-[#464555]/10 divide-y divide-[#464555]/10 overflow-hidden">
            <ToggleRow
              icon="keyboard"
              label="オンスクリーンキーボード"
              desc="タイピング中にキーボード図を表示"
              value={settings.showKeyboard}
              onChange={v => update('showKeyboard', v)}
            />
            <ToggleRow
              icon="back_hand"
              label="指使いガイド"
              desc="どの指でキーを押すか表示"
              value={settings.showFingerGuide}
              onChange={v => update('showFingerGuide', v)}
            />
            <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">translate</span>
                </div>
                <div>
                  <h4 className="font-headline font-medium text-on-surface">ローマ字ガイド</h4>
                  <p className="font-label text-xs text-on-surface-variant">かな文字のローマ字表示タイミング</p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={settings.romajiGuide}
                  onChange={e => update('romajiGuide', e.target.value as AppSettings['romajiGuide'])}
                  className="appearance-none bg-surface-container-lowest border border-[#464555]/20 rounded-lg px-4 py-2 pr-8 text-sm font-body text-on-surface focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer"
                >
                  <option value="always">常に表示</option>
                  <option value="fadein">3秒後</option>
                  <option value="never">非表示</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="pt-2">
          <div className="p-6 rounded-lg bg-gradient-to-r from-surface-container-high to-surface-container border border-error/10">
            <h3 className="font-headline font-bold text-on-surface mb-1">データ管理</h3>
            <p className="font-body text-sm text-on-surface-variant mb-4">全ての進捗データを削除します。この操作は取り消せません。</p>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-3 rounded-full bg-error-container/20 text-error font-headline font-bold text-sm hover:bg-error-container/40 transition-all"
              >
                全進捗をリセット
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-error">本当にリセットしますか？この操作は取り消せません。</p>
                <div className="flex gap-3">
                  <button onClick={handleReset} className="px-6 py-3 rounded-full bg-error text-on-error font-headline font-bold text-sm hover:opacity-90">
                    リセットする
                  </button>
                  <button onClick={() => setShowConfirm(false)} className="px-6 py-3 rounded-full border border-[#464555]/20 text-on-surface-variant font-headline font-bold text-sm hover:bg-surface-container-highest">
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <footer className="pt-4 text-center">
          <p className="font-label text-[10px] text-on-surface-variant/40 tracking-[0.2em] uppercase">Kinetic Type — Kinetic Sanctuary Design System</p>
        </footer>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, desc, value, onChange, disabled }: {
  icon: string; label: string; desc: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <div className={`p-5 flex items-center justify-between transition-colors ${disabled ? 'opacity-40' : 'hover:bg-white/5'}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        <div>
          <h4 className="font-headline font-medium text-on-surface">{label}</h4>
          <p className="font-label text-xs text-on-surface-variant">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-secondary' : 'bg-surface-container-highest'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-checked={value}
        role="switch"
        disabled={disabled}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
