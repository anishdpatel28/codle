// Practice mode loader: a specific past term when a date is given (replay from
// the archive), otherwise a random past term with a reroll.

import { useEffect, useState } from 'react';
import { getDailyTerm, getRandomPastTerm } from '../data/queries';
import type { DailyTerm } from '../data/types';

export interface PracticeState {
  term: DailyTerm | null;
  loading: boolean;
  error: string | null;
  reroll: () => void;
  canReroll: boolean;
}

export function usePractice(date?: string): PracticeState {
  const [term, setTerm] = useState<DailyTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = date ? getDailyTerm(date) : getRandomPastTerm();
    load
      .then((t) => {
        if (!cancelled) setTerm(t);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, nonce]);

  return {
    term,
    loading,
    error,
    reroll: () => setNonce((n) => n + 1),
    canReroll: !date,
  };
}
