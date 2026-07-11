// Pure derivation of streak/win-rate stats from a user's daily scores.
// Practice results never reach here (queries excludes them).

import type { DailyTerm, Score } from './types';

export interface Stats {
  currentStreak: number;
  played: number;
  wins: number;
  winRate: number; // 0..1
}

/**
 * @param terms past daily terms, newest first (index 0 = today)
 * @param scores map of daily_term_id -> the user's score for it
 */
export function computeStats(
  terms: DailyTerm[],
  scores: Record<string, Score>,
): Stats {
  let played = 0;
  let wins = 0;
  for (const term of terms) {
    const s = scores[term.id];
    if (!s) continue;
    played += 1;
    if (s.solved) wins += 1;
  }

  // Current streak: consecutive solved days from the most recent, tolerating a
  // not-yet-played today so the streak doesn't reset before you play.
  let currentStreak = 0;
  for (let i = 0; i < terms.length; i++) {
    const s = scores[terms[i].id];
    if (!s) {
      if (i === 0) continue; // today not played yet — keep looking back
      break;
    }
    if (s.solved) currentStreak += 1;
    else break;
  }

  return {
    currentStreak,
    played,
    wins,
    winRate: played === 0 ? 0 : wins / played,
  };
}
