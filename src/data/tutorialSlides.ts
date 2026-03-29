/**
 * チュートリアルスライドデータ
 * 各ユニットの最初のレッスン前に表示されるスライド。
 *
 * 後で内容を差し替えたい場合は、このファイルの `TUTORIAL_SLIDES` を編集してください。
 * 各スライドは { title, body, image? } の形式です。
 * unitId をキーにして、スライドの配列を定義します。
 */

export interface TutorialSlide {
  title: string;
  body: string;
  /** キーボードのどのキーをハイライトするか（オプション） */
  highlightKeys?: string[];
  /** 指の名前（オプション） */
  fingerHint?: string;
  /** HandDiagram に渡すキー。指ハイライト表示に使う */
  handKey?: string;
  /** KeyboardDiagram でハイライトするキー群 */
  keyboardKeys?: string[];
}

export const TUTORIAL_SLIDES: Record<string, TutorialSlide[]> = {
  'unit-0': [
    {
      title: 'ホームポジションとは？',
      body: 'タイピングの基本は「ホームポジション」です。両手の指を決まった位置に置くことで、すべてのキーに素早く届きます。',
      keyboardKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    },
    {
      title: '左手の位置',
      body: '左手の指はそれぞれ\n小指 → A\n薬指 → S\n中指 → D\n人差し指 → F\nに置きます。Fキーには突起があります。',
      highlightKeys: ['a', 's', 'd', 'f'],
      fingerHint: '左手 小指・薬指・中指・人差し指',
      handKey: 'a',
      keyboardKeys: ['a', 's', 'd', 'f'],
    },
    {
      title: '右手の位置',
      body: '右手の指はそれぞれ\n人差し指 → J\n中指 → K\n薬指 → L\n小指 → ;\nに置きます。Jキーにも突起があります。',
      highlightKeys: ['j', 'k', 'l', ';'],
      fingerHint: '右手 人差し指・中指・薬指・小指',
      handKey: 'j',
      keyboardKeys: ['j', 'k', 'l', ';'],
    },
    {
      title: '親指はスペースキー',
      body: '両手の親指はスペースキーの上に軽く置きます。日本語のかなを入力するとき、単語の区切りに使います。',
      highlightKeys: [' '],
      handKey: ' ',
      keyboardKeys: [' '],
    },
  ],

  'unit-1': [
    {
      title: 'あ行：a i u e o',
      body: 'あ行のローマ字は覚えやすい！\nあ → a　い → i　う → u\nえ → e　お → o\n母音5文字だけです。',
      highlightKeys: ['a', 'i', 'u', 'e', 'o'],
      keyboardKeys: ['a', 'i', 'u', 'e', 'o'],
    },
    {
      title: '使う指',
      body: 'a は左手の小指（Aキー）\ni は右手の中指（Iキー）\nu は右手の人差し指（Uキー）\ne は左手の中指（Eキー）\no は右手の薬指（Oキー）',
      highlightKeys: ['a', 'i', 'u', 'e', 'o'],
      handKey: 'a',
      keyboardKeys: ['a', 'i', 'u', 'e', 'o'],
    },
  ],

  'unit-2': [
    {
      title: 'か行：k + 母音',
      body: 'か行は「k」の後に母音をつけます。\nか → ka　き → ki　く → ku\nけ → ke　こ → ko',
      highlightKeys: ['k', 'a', 'i', 'u', 'e', 'o'],
      keyboardKeys: ['k', 'a', 'i', 'u', 'e', 'o'],
    },
    {
      title: 'Kキーの指',
      body: 'Kキーは右手の中指で打ちます。ホームポジションのJキーの右隣です。打った後はすぐにJキーの位置に戻しましょう。',
      highlightKeys: ['k'],
      fingerHint: '右手 中指',
      handKey: 'k',
      keyboardKeys: ['k'],
    },
  ],

  'unit-3': [
    {
      title: 'さ行：s + 母音',
      body: 'さ行は「s」の後に母音をつけます。\nさ → sa　し → si または shi\nす → su　せ → se　そ → so\n「し」は shi でも入力できます。',
      highlightKeys: ['s', 'h', 'i'],
      keyboardKeys: ['s', 'h', 'i'],
    },
    {
      title: 'Sキーの指',
      body: 'Sキーは左手の薬指で打ちます。ホームポジションのAキーの右隣にあります。',
      highlightKeys: ['s'],
      fingerHint: '左手 薬指',
      handKey: 's',
      keyboardKeys: ['s'],
    },
  ],

  'unit-4': [
    {
      title: 'た行：t / ch / ts + 母音',
      body: 'た → ta　ち → ti または chi\nつ → tu または tsu\nて → te　と → to\n「ち」「つ」は複数の入力方法があります。',
      highlightKeys: ['t', 'c', 'h', 's'],
      keyboardKeys: ['t', 'c', 'h', 's'],
    },
    {
      title: 'Tキーの指',
      body: 'Tキーは左手の人差し指で打ちます。ホームポジションのFキーから一つ上の行にあります。',
      highlightKeys: ['t'],
      fingerHint: '左手 人差し指',
      handKey: 't',
      keyboardKeys: ['t'],
    },
  ],

  'unit-5': [
    {
      title: 'な行：n + 母音',
      body: 'な行は「n」の後に母音をつけます。\nな → na　に → ni　ぬ → nu\nね → ne　の → no\n単独の「ん」は nn と入力します。',
      highlightKeys: ['n', 'a', 'i', 'u', 'e', 'o'],
      keyboardKeys: ['n', 'a', 'i', 'u', 'e', 'o'],
    },
    {
      title: 'Nキーの指',
      body: 'Nキーは右手の人差し指で打ちます。ホームポジションのJキーの上の行にあります。',
      highlightKeys: ['n'],
      fingerHint: '右手 人差し指',
      handKey: 'n',
      keyboardKeys: ['n'],
    },
  ],

  'unit-6': [
    {
      title: 'は行：h + 母音',
      body: 'は行は「h」の後に母音をつけます。\nは → ha　ひ → hi　ふ → fu または hu\nへ → he　ほ → ho',
      highlightKeys: ['h', 'f', 'u'],
      keyboardKeys: ['h', 'f', 'u'],
    },
    {
      title: 'Hキーの指',
      body: 'Hキーは右手の人差し指で打ちます。ホームポジションのJキーの左隣です。',
      highlightKeys: ['h'],
      fingerHint: '右手 人差し指',
      handKey: 'h',
      keyboardKeys: ['h'],
    },
  ],

  'unit-7': [
    {
      title: 'ま行：m + 母音',
      body: 'ま行は「m」の後に母音をつけます。\nま → ma　み → mi　む → mu\nめ → me　も → mo',
      highlightKeys: ['m'],
      keyboardKeys: ['m'],
    },
    {
      title: 'Mキーの指',
      body: 'Mキーは右手の人差し指で打ちます。一番下の行（底段）にあります。',
      highlightKeys: ['m'],
      fingerHint: '右手 人差し指',
      handKey: 'm',
      keyboardKeys: ['m'],
    },
  ],

  'unit-8': [
    {
      title: 'や行・わ行・ん',
      body: 'や → ya　ゆ → yu　よ → yo\nわ → wa　を → wo\nん → nn（または n + 子音）',
      highlightKeys: ['y', 'w', 'n'],
      keyboardKeys: ['y', 'w', 'n'],
    },
  ],

  'unit-9': [
    {
      title: 'ら行：r + 母音',
      body: 'ら行は「r」の後に母音をつけます。\nら → ra　り → ri　る → ru\nれ → re　ろ → ro',
      highlightKeys: ['r'],
      fingerHint: '左手 人差し指',
      handKey: 'r',
      keyboardKeys: ['r'],
    },
  ],

  'unit-10': [
    {
      title: '濁音：g + 母音',
      body: '濁音は清音の子音に「g / z / d / b」を使います。\nが行 → ga gi gu ge go\n濁点（゛）は子音を変えることで入力します。',
      highlightKeys: ['g'],
      handKey: 'g',
      keyboardKeys: ['g', 'z', 'd', 'b'],
    },
  ],

  'unit-11': [
    {
      title: 'ざ行：z + 母音',
      body: 'ざ → za　じ → zi または ji\nず → zu　ぜ → ze　ぞ → zo\n「じ」は ji でも入力できます。',
      highlightKeys: ['z', 'j'],
      handKey: 'z',
      keyboardKeys: ['z', 'j'],
    },
  ],

  'unit-12': [
    {
      title: 'だ行：d + 母音',
      body: 'だ → da　ぢ → di　づ → du\nで → de　ど → do',
      highlightKeys: ['d'],
      fingerHint: '左手 中指',
      handKey: 'd',
      keyboardKeys: ['d'],
    },
  ],

  'unit-13': [
    {
      title: 'ば行：b + 母音',
      body: 'ば行は「b」の後に母音をつけます。\nば → ba　び → bi　ぶ → bu\nべ → be　ぼ → bo',
      highlightKeys: ['b'],
      fingerHint: '左手 人差し指',
      handKey: 'b',
      keyboardKeys: ['b'],
    },
  ],

  'unit-14': [
    {
      title: 'ぱ行：p + 母音',
      body: 'ぱ行は「p」の後に母音をつけます。\nぱ → pa　ぴ → pi　ぷ → pu\nぺ → pe　ぽ → po',
      highlightKeys: ['p'],
      fingerHint: '右手 小指',
      handKey: 'p',
      keyboardKeys: ['p'],
    },
  ],

  'unit-15': [
    {
      title: 'きゃ行・しゃ行',
      body: '拗音（ようおん）は子音 + y + 母音で入力します。\nきゃ → kya　きゅ → kyu　きょ → kyo\nしゃ → sha または sya',
      highlightKeys: ['k', 'y', 's', 'h'],
      keyboardKeys: ['k', 'y', 's', 'h'],
    },
  ],

  'unit-16': [
    {
      title: 'ちゃ行・にゃ行',
      body: 'ちゃ → cha または tya\nにゃ → nya　にゅ → nyu　にょ → nyo',
      highlightKeys: ['c', 'n', 'y'],
      keyboardKeys: ['c', 'n', 'y', 't'],
    },
  ],

  'unit-17': [
    {
      title: 'ひゃ・みゃ・りゃ行',
      body: 'ひゃ → hya　ひゅ → hyu　ひょ → hyo\nみゃ → mya　りゃ → rya',
      highlightKeys: ['h', 'm', 'r', 'y'],
      keyboardKeys: ['h', 'm', 'r', 'y'],
    },
  ],

  'unit-18': [
    {
      title: 'ぎゃ・じゃ・びゃ・ぴゃ行',
      body: 'ぎゃ → gya　じゃ → jya または ja\nびゃ → bya　ぴゃ → pya',
      highlightKeys: ['g', 'j', 'b', 'p', 'y'],
      keyboardKeys: ['g', 'j', 'b', 'p', 'y'],
    },
  ],

  'unit-19': [
    {
      title: '句読点・記号の入力',
      body: '句読点や記号の入力方法を練習します。\n。（句点）→ . （ピリオドキー）\n、（読点）→ , （カンマキー）\nー（長音符）→ - （ハイフンキー）',
      highlightKeys: ['.', ',', '-'],
      keyboardKeys: ['.', ','],
    },
  ],

  'unit-20': [
    {
      title: '総合練習',
      body: 'これまで学んだすべての文字を使った総合練習です。実際の日本語の文章を通じて、スムーズなタイピングを目指しましょう！',
    },
  ],
};
