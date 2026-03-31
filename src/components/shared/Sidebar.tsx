'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',        icon: 'dashboard',     label: 'ダッシュボード' },
  { href: '/lessons', icon: 'menu_book',     label: 'レッスン' },
  { href: '/test',    icon: 'timer',         label: 'テスト' },
  { href: '/stats',   icon: 'analytics',     label: '統計' },
  { href: '/badges',  icon: 'emoji_events',  label: 'バッジ' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-20 hover:w-64 transition-all duration-300 z-50 border-r border-[#464555]/15 bg-[#131b2e] flex flex-col py-8 px-4 overflow-hidden group shadow-sidebar">
      {/* Logo */}
      <Link href="/" className="flex items-center mb-10 overflow-hidden h-10 flex-shrink-0">
        {/* 折りたたみ時: "KX" */}
        <span className="group-hover:opacity-0 group-hover:w-0 transition-all duration-300 font-headline font-black text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap flex-shrink-0 w-12">
          KX
        </span>
        {/* 展開時: "KANAX" */}
        <span className="opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto transition-all duration-300 font-headline font-black text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
          KANAX
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-xl font-headline text-sm font-medium tracking-tight transition-all duration-150 ${
                isActive
                  ? 'bg-[#2d3449] text-secondary'
                  : 'text-[#c7c4d8] opacity-70 hover:bg-[#2d3449] hover:opacity-100 hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Info links + Settings */}
      <div className="mt-auto pt-6 border-t border-[#464555]/10 space-y-2">
        {[
          { href: '/about',       icon: 'info',          label: 'このアプリについて' },
          { href: '/how-to-use',  icon: 'help',          label: '使い方' },
          { href: '/faq',         icon: 'quiz',          label: 'よくある質問' },
          { href: '/contact',     icon: 'mail',          label: 'お問い合わせ' },
        ].map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-xl font-headline text-sm font-medium tracking-tight transition-all duration-150 ${
                isActive
                  ? 'bg-[#2d3449] text-secondary'
                  : 'text-[#c7c4d8] opacity-70 hover:bg-[#2d3449] hover:opacity-100 hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex items-center gap-4 p-3 rounded-xl font-headline text-sm font-medium tracking-tight transition-all duration-150 ${
            pathname === '/settings'
              ? 'bg-[#2d3449] text-secondary'
              : 'text-[#c7c4d8] opacity-70 hover:bg-[#2d3449] hover:opacity-100 hover:text-white'
          }`}
        >
          <span
            className="material-symbols-outlined flex-shrink-0"
            style={pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            settings
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            設定
          </span>
        </Link>
      </div>
    </aside>
  );
}
