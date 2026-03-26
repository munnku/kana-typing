import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-headline', weight: ['400','500','600','700','800'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-label', weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  title: 'かなタイピング — 日本語タイピング練習',
  description: '日本語ひらがなタイピング練習アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* display=block: アイコンフォント読み込み前にテキスト（リガチャ）が表示されるのを防ぐ */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable} font-body bg-surface text-on-surface min-h-screen`}>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-20 min-h-screen">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
