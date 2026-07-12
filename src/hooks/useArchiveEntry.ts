// Loads a past term together with the user's saved score for it, for read-only
// archive review.

import { useEffect, useState } from 'react';
import { getDailyTerm, getScore } from '../data/queries';
import { readableError } from '../lib/errors';
import type { DailyTerm, Score } from '../data/types';

export interface ArchiveEntry {
  term: DailyTerm | null;
  score: Score | null;
  loading: boolean;
  error: string | null;
}

export function useArchiveEntry(date: string | undefined, userId: string | null): ArchiveEntry {
  const [term, setTerm] = useState<DailyTerm | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getDailyTerm(date)
      .then(async (t) => {
        if (cancelled) return;
        setTerm(t);
        setScore(t ? await getScore(userId, t.id) : null);
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
  }, [date, userId]);

  return { term, score, loading, error };
}
