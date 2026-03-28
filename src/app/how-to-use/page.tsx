import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使い方ガイド | かなタイピング',
};

const STEPS = [
  { step: '1', icon: 'menu_book', title: 'レッスンを選ぶ', desc: 'ダッシュボードまたはレッスン一覧から練習したいレッスンを選んでください。Unit 0から順番に進めることをおすすめします。' },
  { step: '2', icon: 'play_arrow', title: 'スタートボタンを押す', desc: 'レッスン画面に入ったら、Enterキーまたは「スタート」ボタンを押して練習を開始します。' },
  { step: '3', icon: 'keyboard', title: 'ひらがなをローマ字で入力', desc: '画面上に表示されるひらがなを、ローマ字に変換してキーボードで入力します。指ガイドを参考にしながら入力しましょう。' },
  { step: '4', icon: 'bar_chart', title: '結果を確認する', desc: 'レッスン完了後、CPS・KPM・正確率・星評価が表示されます。記録を塗り替えながら上達を実感しましょう。' },
];

const ROMAJI_TABLE = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'si/shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'ti/chi' }, { kana: 'つ', romaji: 'tu/tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
];

const TIPS = [
  { icon: 'home', title: 'ホームポジションを守る', desc: '左手: A・S・D・F、右手: J・K・L・；の位置に指を置くのが基本です。Unit 0でしっかり練習しましょう。' },
  { icon: 'back_hand', title: '指ガイドを活用する', desc: 'レッスン画面の指ガイド（ハンドダイアグラム）を見ながら、正しい指を使う習慣をつけましょう。' },
  { icon: 'speed', title: '焦らず正確さを優先する', desc: '最初はスピードよりも正確さを重視してください。正確に打てるようになると、自然にスピードも上がります。' },
  { icon: 'repeat', title: '繰り返し練習する', desc: '同じレッスンを何度も繰り返すことで記憶が定着します。星3つを目指して挑戦しましょう。' },
];

const SHORTCUTS = [
  { key: 'Enter', desc: 'レッスンを開始する' },
  { key: 'Esc', desc: 'レッスンを中断する' },
];

export default function HowToUsePage() {
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
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Guide</p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">使い方ガイド</h1>
            </div>
          </div>
          <p className="font-body text-sm text-on-surface-variant mt-2">かなタイピングの基本的な使い方と上達のコツを解説します。</p>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 1: 基本的な使い方 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
            基本的な使い方
          </h2>
          <div className="space-y-3">
            {STEPS.map((s) => (
              <div key={s.step} className="glass-card rounded-2xl border border-[#464555]/10 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-headline font-extrabold text-primary text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 2: スコアの見方 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">bar_chart</span>
            スコアの見方
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4 pb-4 border-b border-[#464555]/10">
                <div className="w-16 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-headline font-extrabold text-primary text-sm">CPS</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface">Characters Per Second</h3>
                  <p className="font-body text-sm text-on-surface-variant">1秒あたりに入力できたかな文字数。タイピング速度の指標です。数値が高いほど速く打てています。</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-[#464555]/10">
                <div className="w-16 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-headline font-extrabold text-secondary text-sm">KPM</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface">Keys Per Minute</h3>
                  <p className="font-body text-sm text-on-surface-variant">1分あたりのキー入力数。ローマ字変換後の実際のキーストローク数を基準にしています。</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-[#464555]/10">
                <div className="w-16 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-headline font-extrabold text-primary text-sm">%</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface">正確率</h3>
                  <p className="font-body text-sm text-on-surface-variant">入力の正確さを示すパーセンテージ。ミスなく入力できた割合です。100%が理想です。</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface">星評価（1〜3）</h3>
                  <p className="font-body text-sm text-on-surface-variant">CPS・正確率をもとに算出される総合評価。星3つを目指して繰り返し練習しましょう。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 3: ローマ字変換表 */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">table_chart</span>
            ローマ字入力の基本
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-4">
            <p className="font-body text-sm text-on-surface-variant">
              ひらがなはローマ字（アルファベット）に変換して入力します。代表的な変換を覚えましょう。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#464555]/10">
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2 pr-4">かな</th>
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2 pr-4">ローマ字</th>
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2 pr-4">かな</th>
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2 pr-4">ローマ字</th>
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2 pr-4">かな</th>
                    <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-left pb-2">ローマ字</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-b border-[#464555]/5">
                      {[0, 1, 2].map((col) => {
                        const idx = col * 5 + row;
                        const entry = ROMAJI_TABLE[idx];
                        return entry ? (
                          <>
                            <td key={`k-${idx}`} className="py-2 pr-4 font-headline font-bold text-on-surface text-lg">{entry.kana}</td>
                            <td key={`r-${idx}`} className="py-2 pr-4 font-body text-on-surface-variant">{entry.romaji}</td>
                          </>
                        ) : (
                          <>
                            <td key={`k-${idx}`} className="py-2 pr-4" />
                            <td key={`r-${idx}`} className="py-2 pr-4" />
                          </>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-primary/5 rounded-xl p-4 space-y-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary">ポイント</p>
              <p className="font-body text-xs text-on-surface-variant">「し」は <strong>si</strong> でも <strong>shi</strong> でも入力できます。「ち」は <strong>ti</strong> / <strong>chi</strong>、「つ」は <strong>tu</strong> / <strong>tsu</strong> など複数のローマ字が使えます。</p>
            </div>
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 4: 上達のコツ */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">tips_and_updates</span>
            上達のコツ
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {TIPS.map((tip, i) => (
              <div key={i} className="glass-card rounded-2xl border border-[#464555]/10 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>{tip.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-on-surface mb-1">{tip.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#464555]/15" />

        {/* Section 5: ショートカット */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">keyboard_command_key</span>
            よく使うショートカット
          </h2>
          <div className="glass-card rounded-2xl border border-[#464555]/10 p-6 space-y-3">
            {SHORTCUTS.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <kbd className="px-3 py-1.5 rounded-lg bg-surface-container-highest font-label text-sm font-bold text-on-surface border border-[#464555]/20 min-w-[80px] text-center">
                  {s.key}
                </kbd>
                <span className="font-body text-sm text-on-surface-variant">{s.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}
