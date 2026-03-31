'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    q: 'ログインや会員登録は必要ですか？',
    a: '不要です。KANAXはログインや会員登録なしで全機能をご利用いただけます。レッスンの進捗・設定・バッジなどのデータはすべてブラウザのlocalStorageに自動保存されます。',
  },
  {
    q: 'スマートフォンでも使えますか？',
    a: 'タイピング練習の性質上、物理キーボードをお持ちのデバイスを推奨しています。スマートフォンでもページの閲覧は可能ですが、スマートフォンのソフトウェアキーボードでは入力練習には向いていません。パソコンまたは外付けキーボードでのご利用をおすすめします。',
  },
  {
    q: '進捗データが消えてしまいました',
    a: 'KANAXの進捗データはブラウザのlocalStorageに保存されています。ブラウザの「閲覧データの削除」でキャッシュ・Cookieをクリアした場合や、ブラウザのプライベートモードをご利用の場合はデータが消える場合があります。現在、クラウドへのバックアップ機能はございません。',
  },
  {
    q: 'ローマ字入力とかな入力の違いは？',
    a: 'このアプリは「ローマ字入力」に対応しています。ローマ字入力とは、アルファベットキーを組み合わせてひらがなを入力する方式です（例: か → ka）。かな入力（キーボードのかなの刻印を使う方式）には対応していません。',
  },
  {
    q: 'CPS・KPMとは何ですか？',
    a: 'CPS（Characters Per Second）は1秒あたりに入力できたかな文字数を表します。KPM（Keys Per Minute）は1分あたりのキー入力数（ローマ字変換後のキーストローク数）を表します。どちらもタイピング速度の指標ですが、CPSは日本語入力の実力をより直感的に表します。',
  },
  {
    q: 'バグを見つけた・要望があります',
    a: null, // 特別レンダリング
    isContact: true,
  },
];

function FaqItem({ item, isOpen, onToggle }: {
  item: typeof FAQ_ITEMS[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`glass-card rounded-2xl border border-[#464555]/10 overflow-hidden transition-all duration-200 ${isOpen ? 'ring-1 ring-primary/20' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-primary/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="font-headline font-extrabold text-primary text-sm flex-shrink-0">Q</span>
          <span className="font-headline font-semibold text-on-surface">{item.q}</span>
        </div>
        <span
          className="material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0 border-t border-[#464555]/10">
          <div className="flex items-start gap-3 pt-4">
            <span className="font-headline font-extrabold text-secondary text-sm flex-shrink-0">A</span>
            {item.isContact ? (
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                バグ報告・機能リクエストは
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors mx-1">
                  お問い合わせページ
                </Link>
                からご連絡ください。いただいたフィードバックを参考にアプリの改善を続けています。
              </p>
            ) : (
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen px-8 py-10">
      {/* Ambient background orbs */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">FAQ</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">よくある質問</h1>
            </div>
          </div>
          <p className="font-body text-sm text-on-surface-variant mt-2">ご不明な点があればまずこちらをご確認ください。</p>
        </section>

        <hr className="border-[#464555]/15" />

        {/* FAQ Accordion */}
        <section className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </section>

        <hr className="border-[#464555]/15" />

        {/* CTA to contact */}
        <section>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-headline font-semibold text-on-surface mb-1">解決しませんでしたか？</h3>
              <p className="font-body text-sm text-on-surface-variant">お問い合わせページからお気軽にご連絡ください。</p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-label text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">send</span>
              お問い合わせ
            </Link>
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}
