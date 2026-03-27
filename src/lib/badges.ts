import type { UserProgress, BadgeDefinition, SessionResult } from '@/types';
import { BADGE_DEFINITIONS, CPS_TIER_THRESHOLDS } from './constants';

export function evaluateBadges(
  result: SessionResult,
  progress: UserProgress,
  prevProgress: UserProgress
): BadgeDefinition[] {
  const newBadges: BadgeDefinition[] = [];
  const alreadyEarned = new Set(prevProgress.badges);

  const check = (id: string, condition: boolean) => {
    if (condition && !alreadyEarned.has(id)) {
      const def = BADGE_DEFINITIONS.find(b => b.id === id);
      if (def) newBadges.push(def);
    }
  };

  // first_lesson
  check('first_lesson', progress.totalSessions === 1);

  // CPS tier badges (9段階)
  CPS_TIER_THRESHOLDS.forEach((threshold, i) => {
    check(`speed_tier_${i}`, result.kpm >= threshold);
  });

  // perfect lesson
  check('perfect_lesson', result.accuracy === 100);

  // streak badges
  check('streak_7', progress.streakDays >= 7);
  check('streak_30', progress.streakDays >= 30);

  // dedicated
  check('dedicated', progress.totalSessions >= 10);

  // all_stars (10 lessons with 3 stars)
  const threeStarCount = Object.values(progress.lessons).filter(l => l.stars === 3).length;
  check('all_stars', threeStarCount >= 10);

  // graduate (all lessons completed)
  const completedCount = Object.values(progress.lessons).filter(l => l.completed).length;
  check('graduate', completedCount >= 27);

  // aiueo_master: Unit 1 test cleared
  const aiueoTest = progress.lessons['u1-test'];
  check('aiueo_master', aiueoTest?.completed === true);

  // home_row_master: all Unit 0 lessons with stars >= 2
  const unit0Ids = ['u0-l01', 'u0-l02'];
  const homeRowMastered = unit0Ids.every(id => (progress.lessons[id]?.stars ?? 0) >= 2);
  check('home_row_master', homeRowMastered);

  // dakuten_master: Unit 10 cleared
  const unit10Done = ['u10-l01', 'u10-l02', 'u10-test'].every(
    id => progress.lessons[id]?.completed === true
  );
  check('dakuten_master', unit10Done);

  return newBadges;
}

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.id === id);
}

export function getEarnedBadges(progress: UserProgress): BadgeDefinition[] {
  return progress.badges
    .map(id => getBadgeById(id))
    .filter((b): b is BadgeDefinition => b !== undefined);
}
