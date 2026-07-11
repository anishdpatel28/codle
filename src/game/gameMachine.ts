// Pure reducers for the round. Six attempts; a wrong or empty guess costs one
// attempt and reveals the next hint; a correct guess ends the round.

import type { GameState } from './types';
import { isCorrect, isEmptyGuess } from './validate';

export const MAX_ATTEMPTS = 6;

export function initGame(): GameState {
  return {
    attemptsUsed: 0,
    revealedHints: 1,
    status: 'playing',
    solvedOnAttempt: null,
    lastResult: null,
    feedbackId: 0,
  };
}

/**
 * Apply a submitted guess against the answer.
 *
 * @param totalHints number of hints available for the term (caps reveals)
 */
export function submitGuess(
  state: GameState,
  rawGuess: string,
  term: string,
  totalHints: number,
): GameState {
  if (state.status !== 'playing') return state;

  const feedbackId = state.feedbackId + 1;
  const attemptsUsed = state.attemptsUsed + 1;

  if (isCorrect(rawGuess, term)) {
    return {
      ...state,
      attemptsUsed,
      status: 'won',
      solvedOnAttempt: attemptsUsed,
      lastResult: 'correct',
      feedbackId,
    };
  }

  // Wrong guess or an intentional empty skip — same cost, reveal the next hint.
  const revealedHints = Math.min(totalHints, state.revealedHints + 1);
  const status = attemptsUsed >= MAX_ATTEMPTS ? 'lost' : 'playing';

  return {
    ...state,
    attemptsUsed,
    revealedHints,
    status,
    lastResult: isEmptyGuess(rawGuess) ? 'skip' : 'wrong',
    feedbackId,
  };
}

/** Attempts remaining, for the signal-block meter. */
export function attemptsRemaining(state: GameState): number {
  return MAX_ATTEMPTS - state.attemptsUsed;
}
