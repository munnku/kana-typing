import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'よくある質問',
  description: 'KANAXに関するよくある質問（FAQ）。ログイン不要？スマホ対応？進捗が消えた？ローマ字入力とかな入力の違いなど、疑問にお答えします。',
  keywords: ['タイピング練習 FAQ', 'ひらがな入力 質問', 'ローマ字入力 かな入力 違い', 'タイピング 進捗 保存'],
  alternates: { canonical: 'https://kana-typing.vercel.app/faq' },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
