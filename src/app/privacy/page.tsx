import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | かなタイピング',
};

export default function PrivacyPage() {
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
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>privacy_tip</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Legal</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">プライバシーポリシー</h1>
            </div>
          </div>
          <p className="font-body text-sm text-on-surface-variant mt-3">最終更新日: 2026年3月27日</p>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 1: 基本方針 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">shield</span>
            1. 基本方針
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              かなタイピング（以下「当サイト」）は、ユーザーの個人情報保護を重要な責務と考え、適切な管理・保護に努めます。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトは、個人情報の保護に関する法律（個人情報保護法）および関連する法令・ガイドラインを遵守し、個人情報を適切に取り扱います。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              本プライバシーポリシーは、当サイトが収集・利用する情報について説明するものです。当サイトをご利用いただくことで、本ポリシーに同意されたものとみなします。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 2: 収集する情報 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">database</span>
            2. 収集する情報
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-4">
            <div>
              <h3 className="font-headline font-semibold text-on-surface mb-2">アクセスログ</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                当サイトでは、アクセス解析のためにアクセスログを記録する場合があります。アクセスログには、IPアドレス、ブラウザの種類、アクセス日時、参照元URL等が含まれます。これらの情報は個人を特定するものではありません。
              </p>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-on-surface mb-2">Cookie（クッキー）</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                当サイトでは、ユーザーの利便性向上および広告配信の最適化のためにCookieを使用しています。Cookieはブラウザの設定から無効にすることができますが、一部の機能が制限される場合があります。
              </p>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-on-surface mb-2">ローカルストレージ</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                当サイトでは、タイピング練習の進捗・設定データをブラウザのlocalStorageに保存します。このデータは端末内にのみ保存され、外部サーバーには送信されません。
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 3: Cookie */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">cookie</span>
            3. Cookieについて
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              Cookieとは、Webサーバーからブラウザに送信される小さなテキストファイルです。ブラウザはこのデータを保持し、同じサーバーへの次のリクエスト時に送信します。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトでは以下の目的でCookieを使用しています：
            </p>
            <ul className="space-y-2 ml-4">
              {[
                'ユーザー設定（テーマ・フォントサイズ等）の保存',
                'Google AdSenseによる広告配信の最適化',
                'アクセス解析（Google Analytics等）',
              ].map((item, i) => (
                <li key={i} className="font-body text-sm text-on-surface-variant flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-body text-sm text-on-surface leading-relaxed mt-2">
              ブラウザの設定でCookieを無効にすることができます。ただし、Cookieを無効にすると一部の機能が正常に動作しない場合があります。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 4: 広告 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">ad_units</span>
            4. 広告について
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトでは、Google LLCが提供する広告配信サービス「Google AdSense」を使用しています。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              Google AdSenseは、ユーザーの興味・関心に基づいた広告を表示するため、Cookieを使用してユーザーの当サイトおよび他サイトへの訪問情報を収集する場合があります。
            </p>
            <div className="bg-primary/5 rounded-xl p-4 space-y-2">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary">オプトアウトについて</p>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Google による広告のCookieの使用は、
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Googleの広告設定ページ
                </a>
                でオプトアウトすることができます。または、
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  www.aboutads.info
                </a>
                にアクセスして、パーソナライズ広告のCookieを無効にすることもできます。
              </p>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Google AdSenseに関する詳細は、
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                Googleのプライバシーポリシー
              </a>
              をご参照ください。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 5: アクセス解析 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">analytics</span>
            5. アクセス解析について
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトでは、サービス改善のためにGoogleが提供するアクセス解析ツール「Google Analytics」を使用する場合があります。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              Google AnalyticsはCookieを使用してデータを収集しますが、収集されるデータは匿名であり、個人を特定するものではありません。
            </p>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Google Analyticsのデータ収集を無効化するには、
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                Google Analytics オプトアウト アドオン
              </a>
              をブラウザにインストールしてください。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 6: 免責事項 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">gavel</span>
            6. 免責事項
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトの情報の正確性・安全性について最善を尽くしておりますが、内容の完全性・正確性・有用性等について保証するものではありません。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトのご利用により生じた損害・損失について、当サイト運営者は一切の責任を負いかねます。
            </p>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              当サイトからリンクされている外部サイトの内容・運営については、当サイトは一切関与しておらず、責任を負いません。
            </p>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 7: お問い合わせ */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">mail</span>
            7. お問い合わせ
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            <p className="font-body text-sm text-on-surface leading-relaxed">
              本プライバシーポリシーに関するご質問・ご意見は、以下よりお問い合わせください。
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-label text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              お問い合わせページへ
            </a>
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}
