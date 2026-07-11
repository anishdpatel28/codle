// Practice mode. A random past transmission (no date) never touches scores. A
// specific date, reached from the archive, records a real result for that day so
// the archive reflects it. Practice shows only the guesses panel — no stats or
// history, since practice isn't part of the tracked daily record.

import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { GuessPanel } from '../components/GuessPanel';
import { TwoColumn } from '../components/TwoColumn';
import { usePractice } from '../hooks/usePractice';
import { useGame } from '../game/useGame';
import { useAuth } from '../hooks/authContext';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import { getTermNames, saveScore } from '../data/queries';

export function PracticePage() {
  const { date } = useParams();
  const { user } = useAuth();
  const { term, loading, error, reroll, canReroll } = usePractice(date);
  const { state, submit } = useGame(term, Boolean(date));
  const suggestions = useMemo(() => getTermNames(), []);

  // A dated replay from the archive is a real result for that day; a random pull
  // is not. Save once when a dated round finishes.
  const savedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!date || !term || state.status === 'playing') return;
    if (savedFor.current === term.id) return;
    savedFor.current = term.id;
    void saveScore(user?.id ?? null, {
      dailyTermId: term.id,
      attemptsUsed: state.attemptsUsed,
      solved: state.status === 'won',
      isPractice: false,
      guesses: state.guesses,
    });
  }, [date, term, state.status, state.attemptsUsed, state.guesses, user?.id]);

  return (
    <Layout>
      <h1 className="mb-8 font-sans text-h1 text-primary">
        {date ? 'Archived' : 'Practice'} <span className="text-accent">signal</span>
      </h1>

      {loading && <p className="font-mono text-mono text-muted">acquiring signal…</p>}
      {error && <p className="font-mono text-mono text-danger">error: {error}</p>}
      {!loading && !error && !term && (
        <p className="font-mono text-mono text-muted">no past transmissions to practice yet.</p>
      )}

      {term && (
        <TwoColumn
          disclosureLabel="guesses"
          sidebar={
            <GuessPanel
              guesses={state.guesses}
              solved={state.status === 'won'}
              total={MAX_ATTEMPTS}
            />
          }
          main={
            <>
              <LogPanel
                term={term}
                state={state}
                onSubmit={submit}
                signalLabel={date ? `SIGNAL://${date}` : 'SIGNAL://PRACTICE'}
                maxAttempts={MAX_ATTEMPTS}
                suggestions={suggestions}
              />
              {canReroll && (
                <button
                  type="button"
                  onClick={reroll}
                  className="mt-6 font-mono text-mono text-accent transition-shadow hover:glow-accent"
                >
                  &gt; new signal
                </button>
              )}
            </>
          }
        />
      )}
    </Layout>
  );
}
