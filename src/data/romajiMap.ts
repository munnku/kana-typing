import type { KanaUnit } from '@/types';

// Map from kana to accepted romaji sequences
// Key = hiragana character, Value = array of accepted romaji strings (first = canonical/display)
export const KANA_ROMAJI_MAP: Record<string, string[]> = {
  // あ行
  'あ': ['a'],
  'い': ['i'],
  'う': ['u'],
  'え': ['e'],
  'お': ['o'],
  // か行
  'か': ['ka'],
  'き': ['ki'],
  'く': ['ku'],
  'け': ['ke'],
  'こ': ['ko'],
  // さ行
  'さ': ['sa'],
  'し': ['shi', 'si'],
  'す': ['su'],
  'せ': ['se'],
  'そ': ['so'],
  // た行
  'た': ['ta'],
  'ち': ['chi', 'ti'],
  'つ': ['tsu', 'tu'],
  'て': ['te'],
  'と': ['to'],
  // な行
  'な': ['na'],
  'に': ['ni'],
  'ぬ': ['nu'],
  'ね': ['ne'],
  'の': ['no'],
  // は行
  'は': ['ha'],
  'ひ': ['hi'],
  'ふ': ['fu', 'hu'],
  'へ': ['he'],
  'ほ': ['ho'],
  // ま行
  'ま': ['ma'],
  'み': ['mi'],
  'む': ['mu'],
  'め': ['me'],
  'も': ['mo'],
  // や行
  'や': ['ya'],
  'ゆ': ['yu'],
  'よ': ['yo'],
  // ら行
  'ら': ['ra'],
  'り': ['ri'],
  'る': ['ru'],
  'れ': ['re'],
  'ろ': ['ro'],
  // わ行
  'わ': ['wa'],
  'を': ['wo'],
  'ん': ['nn', 'n'],   // 'n' is ambiguous before vowels
  // 濁音 - が行
  'が': ['ga'],
  'ぎ': ['gi'],
  'ぐ': ['gu'],
  'げ': ['ge'],
  'ご': ['go'],
  // 濁音 - ざ行
  'ざ': ['za'],
  'じ': ['ji', 'zi'],
  'ず': ['zu'],
  'ぜ': ['ze'],
  'ぞ': ['zo'],
  // 濁音 - だ行
  'だ': ['da'],
  'ぢ': ['di'],
  'づ': ['du'],
  'で': ['de'],
  'ど': ['do'],
  // 濁音 - ば行
  'ば': ['ba'],
  'び': ['bi'],
  'ぶ': ['bu'],
  'べ': ['be'],
  'ぼ': ['bo'],
  // 半濁音 - ぱ行
  'ぱ': ['pa'],
  'ぴ': ['pi'],
  'ぷ': ['pu'],
  'ぺ': ['pe'],
  'ぽ': ['po'],
  // 拗音 - きゃ行
  'きゃ': ['kya'],
  'きゅ': ['kyu'],
  'きょ': ['kyo'],
  'しゃ': ['sha', 'sya'],
  'しゅ': ['shu', 'syu'],
  'しょ': ['sho', 'syo'],
  'ちゃ': ['cha', 'tya'],
  'ちゅ': ['chu', 'tyu'],
  'ちょ': ['cho', 'tyo'],
  'にゃ': ['nya'],
  'にゅ': ['nyu'],
  'にょ': ['nyo'],
  'ひゃ': ['hya'],
  'ひゅ': ['hyu'],
  'ひょ': ['hyo'],
  'みゃ': ['mya'],
  'みゅ': ['myu'],
  'みょ': ['myo'],
  'りゃ': ['rya'],
  'りゅ': ['ryu'],
  'りょ': ['ryo'],
  'ぎゃ': ['gya'],
  'ぎゅ': ['gyu'],
  'ぎょ': ['gyo'],
  'じゃ': ['ja', 'jya', 'zya'],
  'じゅ': ['ju', 'jyu', 'zyu'],
  'じょ': ['jo', 'jyo', 'zyo'],
  'びゃ': ['bya'],
  'びゅ': ['byu'],
  'びょ': ['byo'],
  'ぴゃ': ['pya'],
  'ぴゅ': ['pyu'],
  'ぴょ': ['pyo'],
  // っ (double consonant - special handling needed)
  'っ': ['ltu', 'xtu'],  // standalone; usually handled by doubling next consonant
  // ー (long vowel)
  'ー': ['-'],
  // 句読点
  '、': [','],
  '。': ['.'],
  // space
  ' ': [' '],
  // Home position single-key practice (Unit 0)
  'a': ['a'],
  's': ['s'],
  'd': ['d'],
  'f': ['f'],
  'j': ['j'],
  'k': ['k'],
  'l': ['l'],
  ';': [';'],
};

// 「ん」の後に続く文字が母音・y・nで始まる場合は nn が必要、それ以外は n 単体で可
function getNNRomaji(text: string, currentIndex: number): string[] {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= text.length) {
    // 末尾のん: n 単体でも可
    return ['nn', 'n'];
  }
  // 次の2文字kanaを確認
  const nextTwoChar = nextIndex + 1 < text.length ? text[nextIndex] + text[nextIndex + 1] : null;
  const nextRomaji = (nextTwoChar && KANA_ROMAJI_MAP[nextTwoChar])
    ? KANA_ROMAJI_MAP[nextTwoChar][0]
    : (KANA_ROMAJI_MAP[text[nextIndex]]?.[0] ?? '');
  const firstChar = nextRomaji[0];
  // 母音・y・n で始まる場合は nn が必須（n だけだと次の文字と合体してしまう）
  if (firstChar === 'a' || firstChar === 'i' || firstChar === 'u' || firstChar === 'e' || firstChar === 'o' || firstChar === 'y' || firstChar === 'n') {
    return ['nn'];
  }
  // スペースや文末の場合も n 単体で可
  return ['nn', 'n'];
}

// Convert a hiragana string to an array of KanaUnits
export function textToKanaUnits(text: string): KanaUnit[] {
  const units: KanaUnit[] = [];
  let i = 0;
  while (i < text.length) {
    // Check for 2-character kana (拗音) first
    if (i + 1 < text.length) {
      const twoChar = text[i] + text[i + 1];
      if (KANA_ROMAJI_MAP[twoChar]) {
        const romaji = KANA_ROMAJI_MAP[twoChar];
        units.push({ kana: twoChar, romaji, displayRomaji: romaji[0] });
        i += 2;
        continue;
      }
    }
    const char = text[i];
    if (char === ' ') {
      units.push({ kana: ' ', romaji: [' '], displayRomaji: ' ' });
    } else if (char === 'ん') {
      const romaji = getNNRomaji(text, i);
      units.push({ kana: 'ん', romaji, displayRomaji: 'n' });
    } else if (char === 'っ') {
      // っ before next kana: double the first consonant
      // Look ahead for next char
      if (i + 1 < text.length) {
        const nextChar = text[i + 1];
        const nextTwoChar = i + 2 < text.length ? text[i + 1] + text[i + 2] : null;
        const nextUnit = nextTwoChar && KANA_ROMAJI_MAP[nextTwoChar]
          ? KANA_ROMAJI_MAP[nextTwoChar][0]
          : (KANA_ROMAJI_MAP[nextChar]?.[0] ?? '');
        const firstConsonant = nextUnit[0];
        if (firstConsonant && firstConsonant !== 'a' && firstConsonant !== 'i' && firstConsonant !== 'u' && firstConsonant !== 'e' && firstConsonant !== 'o') {
          units.push({ kana: 'っ', romaji: [firstConsonant], displayRomaji: firstConsonant });
        } else {
          const fallback = KANA_ROMAJI_MAP['っ'] ?? ['ltu'];
          units.push({ kana: 'っ', romaji: fallback, displayRomaji: fallback[0] });
        }
      } else {
        const fallback = KANA_ROMAJI_MAP['っ'] ?? ['ltu'];
        units.push({ kana: 'っ', romaji: fallback, displayRomaji: fallback[0] });
      }
    } else {
      const romaji = KANA_ROMAJI_MAP[char];
      if (romaji) {
        units.push({ kana: char, romaji, displayRomaji: romaji[0] });
      }
      // skip unknown chars
    }
    i++;
  }
  return units;
}

// Given partial romaji input and expected romaji sequences, determine match state
export type RomajiMatchResult = 'partial' | 'complete' | 'no-match';

export function matchRomaji(typed: string, acceptedSequences: string[]): RomajiMatchResult {
  for (const seq of acceptedSequences) {
    if (seq === typed) return 'complete';
    if (seq.startsWith(typed)) return 'partial';
  }
  return 'no-match';
}

// Get next expected characters (for keyboard highlighting)
export function getNextExpectedChars(acceptedSequences: string[], typed: string): string[] {
  const chars = new Set<string>();
  for (const seq of acceptedSequences) {
    if (seq.startsWith(typed) && seq.length > typed.length) {
      chars.add(seq[typed.length]);
    }
  }
  return Array.from(chars);
}
