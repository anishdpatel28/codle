// React binding over the game machine. Resets when the term changes, and — when
// `persist` is set — restores and saves in-progress state locally by term id.

import { useCallback, useEffect, useState } from 'react';
import type { DailyTerm } from '../data/types';
import type { GameState } from './types';
import { initGame, submitGuess } from './gameMachine';
import { loadProgress, saveProgress } from '../data/progress';

export interface UseGame {
  state: GameState;
  submit: (guess: string) => void;
  reset: () => void;
}

export function useGame(term: DailyTerm | null, persist = false): UseGame {
  const [state, setState] = useState<GameState>(initGame);
  const termId = term?.id ?? null;

  useEffect(() => {
    if (!termId) {
      setState(initGame());
      return;
    }
    setState((persist && loadProgress(termId)) || initGame());
  }, [termId, persist]);

  useEffect(() => {
    if (persist && term) saveProgress(term.id, state);
  }, [persist, term, state]);

  const submit = useCallback(
    (guess: string) => {
      if (!term) return;
      setState((s) => submitGuess(s, guess, term.term, term.hints.length));
    },
    [term],
  );

  const reset = useCallback(() => setState(initGame()), []);

  return { state, submit, reset };
}
