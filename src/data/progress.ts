// Local persistence of in-progress (and finished) rounds, keyed by term id, so a
// guest's play — including guess history — survives reloads and navigation.
// This is independent of auth; completed rounds are also recorded as scores.

import type { GameState } from '../game/types';
import { initGame } from '../game/gameMachine';
import { readStore, writeStore } from './storage';

const KEY = 'codle:progress';

// The transient fields (lastResult flash, feedbackId) are not worth persisting.
interface PersistedRound {
  attemptsUsed: number;
  revealedHints: number;
  status: GameState['status'];
  solvedOnAttempt: number | null;
  guesses: string[];
}

type ProgressMap = Record<string, PersistedRound>;

function readAll(): ProgressMap {
  return readStore<ProgressMap>(KEY, {});
}

function writeAll(map: ProgressMap): void {
  writeStore(KEY, map);
}

export function loadProgress(termId: string): GameState | null {
  const round = readAll()[termId];
  if (!round) return null;
  return {
    ...initGame(),
    attemptsUsed: round.attemptsUsed,
    revealedHints: round.revealedHints,
    status: round.status,
    solvedOnAttempt: round.solvedOnAttempt,
    guesses: round.guesses ?? [],
  };
}

export function saveProgress(termId: string, state: GameState): void {
  const map = readAll();
  map[termId] = {
    attemptsUsed: state.attemptsUsed,
    revealedHints: state.revealedHints,
    status: state.status,
    solvedOnAttempt: state.solvedOnAttempt,
    guesses: state.guesses,
  };
  writeAll(map);
}
