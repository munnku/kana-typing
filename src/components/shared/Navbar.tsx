'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { href: '/', label: 'ホーム' },
  { href: '/lessons', label: 'レッスン' },
  { href: '/test', label: 'テスト' },
  { href: '/badges', label: 'バッジ' },
  { href: '/settings', label: '設定' },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
            <span className="text-white text-sm font-bold">か</span>
          </div>
          <span className="font-bold text-base text-slate-800 dark:text-slate-100 tracking-tight">
            KANAX
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
