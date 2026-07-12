// Loads past terms and the user's scores, and derives stats. Shared by the
// sidebar and archive.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPastTerms, getUserScores } from '../data/queries';
import { readableError } from '../lib/errors';
import { computeStats, type Stats } from '../data/stats';
import type { DailyTerm, Score } from '../data/types';

export interface Dashboard {
  terms: DailyTerm[];
  scores: Record<string, Score>;
  stats: Stats;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useDashboard(userId: string | null): Dashboard {
  const [terms, setTerms] = useState<DailyTerm[]>([]);
  const [scores, setScores] = useState<Record<string, Score>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getPastTerms(), getUserScores(userId)])
      .then(([t, s]) => {
        if (cancelled) return;
        setTerms(t);
        setScores(s);
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
  }, [userId, nonce]);

  const stats = useMemo(() => computeStats(terms, scores), [terms, scores]);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { terms, scores, stats, loading, error, reload };
}
