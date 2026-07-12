// Loads the daily term for a given calendar date.

import { useEffect, useState } from 'react';
import { getDailyTerm } from '../data/queries';
import { readableError } from '../lib/errors';
import type { DailyTerm } from '../data/types';

export interface DailyState {
  term: DailyTerm | null;
  loading: boolean;
  error: string | null;
}

export function useDaily(dateISO: string): DailyState {
  const [term, setTerm] = useState<DailyTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getDailyTerm(dateISO)
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
  }, [dateISO]);

  return { term, loading, error };
}
