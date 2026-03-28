import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ | かなタイピング',
};

export default function ContactPage() {
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
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Contact</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">お問い合わせ</h1>
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Description */}
        <div className="glass-card rounded-2xl border border-[#464555]/10 p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="material-symbols-outlined text-secondary text-xl mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              ご質問・ご要望・バグ報告はこちらからお気軽にどうぞ。通常3日以内に返信いたします。
            </p>
          </div>
          <ul className="space-y-2 ml-8">
            {[
              'バグ・動作不具合の報告',
              '機能追加・改善のご要望',
              'コンテンツに関するご意見',
              'その他ご質問',
            ].map((item, i) => (
              <li key={i} className="font-body text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm flex-shrink-0">check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Google Form Embed */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
            お問い合わせフォーム
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 overflow-hidden">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeuhPUO5gs1HqJTmAFsxE81yDaR2CANEXjf5sS3e3Bvhn9StQ/viewform?embedded=true"
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="お問い合わせフォーム"
              className="block"
            >
              読み込んでいます…
            </iframe>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Email Alternative */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">alternate_email</span>
            メールでのお問い合わせ
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              フォームからの送信が難しい場合は、メールにてお問い合わせください。
            </p>
            <a
              href="mailto:ken.aka.munnku@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-label text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              ken.aka.munnku@gmail.com
            </a>
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}
