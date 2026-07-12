// The daily challenge. Wires the daily term, the game machine, and the dashboard
// together, persists the result once per day, and lays out the asymmetric
// log + sidebar composition.

import { useEffect, useMemo, useRef } from 'react';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { Sidebar } from '../components/Sidebar';
import { TwoColumn } from '../components/TwoColumn';
import { useAuth } from '../hooks/authContext';
import { useDaily } from '../hooks/useDaily';
import { useDashboard } from '../hooks/useDashboard';
import { useGame } from '../game/useGame';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import { todayISO } from '../data/dailyTerm';
import { getTermNames, saveScore } from '../data/queries';

export function DailyPage() {
  const today = todayISO();
  const { user } = useAuth();
  const { term, loading, error } = useDaily(today);
  const { stats, reload } = useDashboard(user?.id ?? null);
  const { state, submit } = useGame(term, true);
  const suggestions = useMemo(() => getTermNames(), []);

  // Persist the finished round exactly once, then refresh stats.
  const savedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!term || state.status === 'playing') return;
    if (savedFor.current === term.id) return;
    savedFor.current = term.id;
    void saveScore(user?.id ?? null, {
      dailyTermId: term.id,
      attemptsUsed: state.attemptsUsed,
      solved: state.status === 'won',
      isPractice: false,
      guesses: state.guesses,
    }).then(reload);
  }, [term, state.status, state.attemptsUsed, state.guesses, user?.id, reload]);

  const finished = state.status !== 'playing';
  const sidebar = (
    <Sidebar
      stats={stats}
      guesses={state.guesses}
      solved={state.status === 'won'}
      share={{
        label: today,
        status: finished ? (state.status as 'won' | 'lost') : null,
        attemptsUsed: state.attemptsUsed,
        solvedOnAttempt: state.solvedOnAttempt,
        total: MAX_ATTEMPTS,
      }}
    />
  );

  return (
    <Layout>
      <h1 className="mb-8 font-sans text-h1 text-primary">
        Today&rsquo;s <span className="text-accent">codle</span>
      </h1>

      <TwoColumn
        sidebar={sidebar}
        main={
          <>
            {loading && <p className="font-mono text-mono text-muted">acquiring signal…</p>}
            {error && <p className="font-mono text-mono text-danger">error: {error}</p>}
            {!loading && !error && !term && (
              <p className="font-mono text-mono text-muted">
                no signal is scheduled for {today}. check back tomorrow.
              </p>
            )}
            {term && (
              <LogPanel
                term={term}
                state={state}
                onSubmit={submit}
                signalLabel={`SIGNAL://${today}`}
                maxAttempts={MAX_ATTEMPTS}
                suggestions={suggestions}
              />
            )}
          </>
        }
      />
    </Layout>
  );
}
