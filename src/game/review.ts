// Rebuild a finished GameState from a saved score, for read-only archive review.

import type { GameState } from './types';
import type { Score } from '../data/types';

export function reviewState(score: Score, hintCount: number): GameState {
  return {
    attemptsUsed: score.attemptsUsed,
    revealedHints: score.solved ? Math.min(hintCount, score.attemptsUsed) : hintCount,
    status: score.solved ? 'won' : 'lost',
    solvedOnAttempt: score.solved ? score.attemptsUsed : null,
    lastResult: null,
    feedbackId: 0,
    guesses: score.guesses,
  };
}
