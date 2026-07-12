// Practice mode loader: a specific past term when a date is given (replay from
// the archive), otherwise a random past term. `seed` re-pulls a fresh random
// term whenever it changes, so re-entering practice starts a new round.

import { useEffect, useState } from 'react';
import { getDailyTerm, getRandomPastTerm } from '../data/queries';
import { readableError } from '../lib/errors';
import type { DailyTerm } from '../data/types';

export interface PracticeState {
  term: DailyTerm | null;
  loading: boolean;
  error: string | null;
}

export function usePractice(date?: string, seed?: string): PracticeState {
  const [term, setTerm] = useState<DailyTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (!cancelled) setError(readableError(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, seed]);

  return { term, loading, error };
}
