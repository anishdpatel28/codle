export type GameStatus = 'playing' | 'won' | 'lost';

/** Why the last hint unlocked — drives the feedback flash, not scoring. */
export type LastResult = 'wrong' | 'correct' | 'skip' | null;

export interface GameState {
  /** Attempts consumed, 0..MAX_ATTEMPTS. */
  attemptsUsed: number;
  /** Number of hints currently revealed (always >= 1). */
  revealedHints: number;
  status: GameStatus;
  /** Attempt number (1-based) on which the player solved it, else null. */
  solvedOnAttempt: number | null;
  lastResult: LastResult;
  /** Bumped on every submission so the UI can re-trigger reveal animations. */
  feedbackId: number;
}
