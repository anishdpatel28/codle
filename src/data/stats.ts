// Pure derivation of win-rate stats from a user's daily scores.
// Practice results never reach here (queries excludes them).

import type { DailyTerm, Score } from './types';

export interface Stats {
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

  return {
    played,
    wins,
    winRate: played === 0 ? 0 : wins / played,
  };
}
