// React binding over the pure game machine. Owns the per-round state and resets
// it whenever the term changes (new day, new practice pull).

import { useCallback, useEffect, useState } from 'react';
import type { DailyTerm } from '../data/types';
import type { GameState } from './types';
import { initGame, submitGuess } from './gameMachine';

export interface UseGame {
  state: GameState;
  submit: (guess: string) => void;
  reset: () => void;
}

export function useGame(term: DailyTerm | null): UseGame {
  const [state, setState] = useState<GameState>(initGame);

  useEffect(() => {
    setState(initGame());
  }, [term?.id]);

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
