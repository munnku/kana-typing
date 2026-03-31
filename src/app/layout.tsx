import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/shared/Sidebar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { SidebarAd } from '@/components/ads/SidebarAd';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-headline', weight: ['400','500','600','700','800'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-label', weight: ['400','500','600','700'] });

const siteUrl = 'https://kana-typing.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KANAX — 無料の日本語ひらがなタイピング練習',
    template: '%s | KANAX',
  },
  description: '無料で使える日本語ひらがなタイピング練習アプリ。ホームポジションから始まり、あ行・か行・濁音・拗音まで21ユニットで段階的に学べます。指ガイド付き・会員登録不要。',
  keywords: ['タイピング練習', 'ひらがな', '日本語タイピング', 'ローマ字入力', 'タッチタイピング', '初心者', 'キーボード練習', '無料', 'KANAX'],
  authors: [{ name: 'KANAX' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'KANAX',
    title: 'KANAX — 無料の日本語ひらがなタイピング練習',
    description: '無料で使える日本語ひらがなタイピング練習アプリ。21ユニットで段階的に学べます。指ガイド付き・会員登録不要。',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'KANAX — 無料の日本語ひらがなタイピング練習',
    description: '無料で使える日本語ひらがなタイピング練習アプリ。21ユニットで段階的に学べます。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
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
        {/* 忍者AdMax — SSRの初期HTMLに含めてクローラーに検出させる */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script type="text/javascript" src="https://adm.shinobi.jp/s/a50306ded28a8f8d06fc294e586e021e" />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable} font-body bg-surface text-on-surface min-h-screen`}>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-20 min-h-screen flex gap-0">
              <div className="flex-1 min-w-0">
                {children}
              </div>
              <SidebarAd />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
