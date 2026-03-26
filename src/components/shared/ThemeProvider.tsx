'use client';
import { useEffect } from 'react';
import { loadSettings } from '@/lib/storage';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function applySettings() {
      const settings = loadSettings();

      // Apply theme
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Apply font size
      root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
      root.classList.add(`text-size-${settings.fontSize}`);
    }

    applySettings();

    // Listen for storage changes (e.g. settings updated from another tab or from settings page)
    window.addEventListener('storage', applySettings);
    return () => window.removeEventListener('storage', applySettings);
  }, []);

  return <>{children}</>;
}
