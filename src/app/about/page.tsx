import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'このアプリについて',
  description: 'かなタイピングは無料の日本語ひらがなタイピング練習アプリです。21ユニットの段階的カリキュラム、指ガイド、バッジシステムで楽しく上達できます。会員登録不要。',
  keywords: ['かなタイピング', '日本語タイピング', 'ひらがな練習', '無料タイピング', '指ガイド'],
  alternates: { canonical: 'https://kana-typing.vercel.app/about' },
};

const FEATURES = [
  { icon: 'back_hand', label: '指ガイド・ハンドダイアグラム', desc: 'どの指でどのキーを押すべきかをリアルタイムで視覚的に表示します。' },
  { icon: 'auto_stories', label: '段階的カリキュラム', desc: 'Unit 0（ホームポジション）から始まり、ひらがな全50音・濁音・半濁音・拗音まで体系的に学べます。' },
  { icon: 'emoji_events', label: 'バッジ・実績システム', desc: 'レッスン完了・速度・正確率に応じたバッジを獲得。モチベーションを維持しながら学習を続けられます。' },
  { icon: 'dark_mode', label: 'ダーク/ライトモード', desc: '目に優しいダークモードと明るいライトモードを切り替えられます。' },
  { icon: 'music_note', label: 'BGM・効果音', desc: '学習をサポートするBGMと、正解・ミス時の効果音で集中力を高めます。' },
];

const TARGETS = [
  { icon: 'person', label: 'タイピング初心者', desc: '初めてキーボードでタイピングを練習する方' },
  { icon: 'translate', label: '日本語入力を学ぶ方', desc: 'ローマ字入力でひらがなを打てるようになりたい方' },
  { icon: 'sports_score', label: '正しい指使いを身につけたい方', desc: 'ホームポジションから指ガイドに沿って正確なタイピングを習得したい方' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-8 py-10">
      {/* Ambient background orbs */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Page Header */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">About</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">このアプリについて</h1>
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 1: アプリ概要 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">keyboard</span>
            アプリの概要
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-4">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              <strong className="text-primary">かなタイピング</strong>は、日本語ひらがなのタイピングを楽しく・効率よく練習できる無料のWebアプリです。
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="font-headline text-2xl font-extrabold text-primary mb-1">21</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">ユニット</p>
                <p className="font-body text-xs text-on-surface-variant mt-1">Unit 0〜Unit 20</p>
              </div>
              <div className="bg-secondary/5 rounded-xl p-4 text-center">
                <p className="font-headline text-2xl font-extrabold text-secondary mb-1">無料</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">完全無料</p>
                <p className="font-body text-xs text-on-surface-variant mt-1">全機能利用可</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="font-headline text-2xl font-extrabold text-primary mb-1">不要</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">登録</p>
                <p className="font-body text-xs text-on-surface-variant mt-1">会員登録なし</p>
              </div>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Unit 0のホームポジションから始まり、あ行・か行・さ行……と段階的に進むカリキュラムで、初心者でも無理なく日本語タイピングをマスターできます。進捗はブラウザに自動保存されるため、会員登録は不要です。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 2: 特徴 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">star</span>
            アプリの特徴
          </h2>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl border border-[#464555]/10 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface mb-1">{f.label}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 3: 対象ユーザー */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">group</span>
            こんな方におすすめ
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {TARGETS.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl border border-[#464555]/10 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface">{t.label}</h3>
                  <p className="font-body text-sm text-on-surface-variant">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 4: 開発について */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">code</span>
            開発について
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              かなタイピングは個人開発のプロジェクトです。より多くの方が日本語タイピングを楽しく学べるよう、継続的に機能改善・コンテンツ追加を行っています。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts', 'App Router'].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 5: お問い合わせリンク */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">mail</span>
            ご意見・ご要望
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              バグ報告・機能リクエスト・ご感想など、お気軽にお寄せください。いただいたフィードバックを参考に改善を続けています。
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-label text-sm font-semibold hover:opacity-90 transition-opacity shadow-ambient"
            >
              <span className="material-symbols-outlined text-base">send</span>
              お問い合わせページへ
            </Link>
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}
