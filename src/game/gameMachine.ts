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
    guesses: [],
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
  const empty = isEmptyGuess(rawGuess);
  // Record the guess; a skip is stored as an empty string.
  const guesses = [...state.guesses, empty ? '' : rawGuess.trim()];

  if (isCorrect(rawGuess, term)) {
    return {
      ...state,
      attemptsUsed,
      status: 'won',
      solvedOnAttempt: attemptsUsed,
      lastResult: 'correct',
      feedbackId,
      guesses,
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
    lastResult: empty ? 'skip' : 'wrong',
    feedbackId,
    guesses,
  };
}
