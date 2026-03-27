'use client';
import { usePathname } from 'next/navigation';
import { AdUnit } from './AdUnit';

const AD_SLOT_MENU = 'PLACEHOLDER';

/**
 * メニュー系ページの右サイド固定広告（スクロール追従）
 * レッスン・テスト・結果・広告ゲートページでは非表示
 */
const LESSON_PATHS = ['/lessons/', '/results/', '/ad-gate'];

export function SidebarAd() {
  const pathname = usePathname();
  const isLessonPage = LESSON_PATHS.some(p => pathname.startsWith(p));
  if (isLessonPage) return null;

  return (
    <div className="hidden xl:block flex-shrink-0 w-[176px]">
      <div className="sticky top-8">
        <AdUnit slot={AD_SLOT_MENU} format="vertical" />
      </div>
    </div>
  );
}
