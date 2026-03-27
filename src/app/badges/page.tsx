'use client';
import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import { BADGE_DEFINITIONS, CPS_TIER_LABELS, CPS_TIER_THRESHOLDS } from '@/lib/constants';
import type { BadgeDefinition } from '@/types';
import { useBgm } from '@/hooks/useBgm';

// CPS段階バッジ用カード（最高取得済み段階を1枚表示）
function CpsTierCard({ earnedIds }: { earnedIds: string[] }) {
  // 取得済み最高Tier
  let highestTier = -1;
  for (let i = CPS_TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (earnedIds.includes(`speed_tier_${i}`)) {
      highestTier = i;
      break;
    }
  }

  // 次のTier（未取得）
  const nextTier = highestTier + 1;
  const hasAny = highestTier >= 0;
  const isMaxed = highestTier === CPS_TIER_THRESHOLDS.length - 1;

  const tierInfo = hasAny ? CPS_TIER_LABELS[highestTier] : null;
  const nextInfo = !isMaxed ? CPS_TIER_LABELS[nextTier] : null;

  // グラデーション枠: ゴールド=金, シルバー=銀, ブロンズ=銅, その他=primary
  const getRingClass = (tier: number) => {
    if (tier >= 8) return 'ring-2 ring-yellow-300/60 shadow-[0_0_20px_rgba(253,224,71,0.3)]';
    if (tier >= 7) return 'ring-2 ring-slate-300/60 shadow-[0_0_16px_rgba(203,213,225,0.3)]';
    if (tier >= 6) return 'ring-2 ring-amber-600/60 shadow-[0_0_16px_rgba(217,119,6,0.3)]';
    return 'ring-1 ring-primary/30';
  };

  return (
    <div className={`glass-card rounded-2xl p-5 relative overflow-hidden ${hasAny ? getRingClass(highestTier) : 'opacity-60 ring-1 ring-[#464555]/20'}`}>
      {/* 背景グロー */}
      {hasAny && tierInfo && (
        <div className={`absolute inset-0 ${tierInfo.bg} opacity-30 pointer-events-none`} />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">タイプ速度バッジ</p>
            <h3 className={`font-headline font-bold text-lg ${hasAny && tierInfo ? tierInfo.color : 'text-on-surface-variant'}`}>
              {hasAny && tierInfo ? tierInfo.label : '未取得'}
            </h3>
          </div>
          <span className="text-3xl">
            {hasAny && tierInfo ? tierInfo.icon : '🐢'}
          </span>
        </div>

        {/* 段階バー */}
        <div className="flex gap-1 mb-3">
          {CPS_TIER_THRESHOLDS.map((threshold, i) => {
            const earned = earnedIds.includes(`speed_tier_${i}`);
            const tierStyle = CPS_TIER_LABELS[i];
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  earned
                    ? i >= 8 ? 'bg-yellow-300'
                    : i >= 7 ? 'bg-slate-300'
                    : i >= 6 ? 'bg-amber-600'
                    : tierStyle.color.replace('text-', 'bg-')
                    : 'bg-[#464555]/20'
                }`}
                title={`${threshold} キー/秒`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-body text-xs text-on-surface-variant">
            {hasAny
              ? `${CPS_TIER_THRESHOLDS[highestTier]} キー/秒 達成`
              : '1.0 キー/秒 でアンロック'}
          </p>
          {!isMaxed && nextInfo && (
            <p className="font-label text-[10px] text-on-surface-variant/60">
              次: {nextInfo.icon} {CPS_TIER_THRESHOLDS[nextTier]} キー/秒
            </p>
          )}
          {isMaxed && (
            <p className="font-label text-[10px] text-yellow-300">🏆 MAX</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge, earned }: { badge: BadgeDefinition; earned: boolean }) {
  return (
    <div className={`glass-card rounded-2xl p-5 text-center transition-all ${
      earned
        ? 'ring-1 ring-primary/20'
        : 'opacity-50'
    }`}>
      <span className={`text-4xl block mb-2 ${earned ? '' : 'grayscale'}`}>{badge.icon}</span>
      <p className={`font-headline font-bold text-sm mb-1 ${earned ? 'text-on-surface' : 'text-on-surface-variant'}`}>
        {badge.title}
      </p>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        {earned ? badge.description : badge.condition}
      </p>
    </div>
  );
}

export default function BadgesPage() {
  useBgm();
  const [earnedIds, setEarnedIds] = useState<string[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setEarnedIds(p.badges);
  }, []);

  // CPS段階バッジを除いた通常バッジ
  const normalBadges = BADGE_DEFINITIONS.filter(b => !b.cpsGroupId);
  const earnedNormal = normalBadges.filter(b => earnedIds.includes(b.id));
  const unearnedNormal = normalBadges.filter(b => !earnedIds.includes(b.id));

  // 取得済みCPSバッジの最高段階
  const highestCpsTier = (() => {
    for (let i = CPS_TIER_THRESHOLDS.length - 1; i >= 0; i--) {
      if (earnedIds.includes(`speed_tier_${i}`)) return i;
    }
    return -1;
  })();

  const totalEarned = earnedNormal.length + (highestCpsTier >= 0 ? 1 : 0);
  // total unique badges: normalBadges + 1 CPS card
  const totalUnique = normalBadges.length + 1;

  return (
    <div className="min-h-screen px-8 py-10 space-y-8">
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Header */}
      <section>
        <h1 className="font-headline font-extrabold text-4xl tracking-tight text-on-surface mb-1">バッジ</h1>
        <p className="text-on-surface-variant font-body text-sm">
          <span className="font-bold text-secondary">{totalEarned}</span>
          <span className="text-on-surface-variant"> / {totalUnique} 獲得</span>
        </p>
      </section>

      {/* CPS段階バッジ（常に表示） */}
      <section>
        <h2 className="font-headline font-bold text-lg text-on-surface mb-3">タイプ速度</h2>
        <div className="max-w-sm">
          <CpsTierCard earnedIds={earnedIds} />
        </div>
      </section>

      {/* 獲得済み通常バッジ */}
      {earnedNormal.length > 0 && (
        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">
            獲得済み
            <span className="ml-2 text-sm font-normal text-secondary">{earnedNormal.length}個</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedNormal.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned />
            ))}
          </div>
        </section>
      )}

      {/* 未獲得通常バッジ */}
      {unearnedNormal.length > 0 && (
        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">
            未獲得
            <span className="ml-2 text-sm font-normal text-on-surface-variant">{unearnedNormal.length}個</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {unearnedNormal.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
