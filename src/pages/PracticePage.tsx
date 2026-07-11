// Practice mode: a random past transmission (or a specific one linked from the
// archive). Results here never touch the streak (saved with is_practice, which
// the data layer keeps out of the daily score set).

import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { usePractice } from '../hooks/usePractice';
import { useGame } from '../game/useGame';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import { getTermNames } from '../data/queries';

export function PracticePage() {
  const { date } = useParams();
  const { term, loading, error, reroll, canReroll } = usePractice(date);
  const { state, submit } = useGame(term);
  const suggestions = useMemo(() => getTermNames(), []);

  return (
    <Layout>
      <h1 className="mb-2 font-sans text-h1 text-primary">
        Practice <span className="text-accent">signal</span>
      </h1>
      <p className="mb-8 max-w-prose font-sans text-body text-muted">
        A past transmission pulled at random. Nothing you do here affects your
        streak.
      </p>

      <div className="max-w-3xl">
        {loading && <p className="font-mono text-mono text-muted">acquiring signal…</p>}
        {error && <p className="font-mono text-mono text-danger">error: {error}</p>}
        {!loading && !error && !term && (
          <p className="font-mono text-mono text-muted">no past transmissions to practice yet.</p>
        )}
        {term && (
          <LogPanel
            term={term}
            state={state}
            onSubmit={submit}
            signalLabel={`SIGNAL://PRACTICE${date ? `/${date}` : ''}`}
            maxAttempts={MAX_ATTEMPTS}
            suggestions={suggestions}
          />
        )}

        {canReroll && (
          <button
            type="button"
            onClick={reroll}
            className="mt-6 font-mono text-mono text-accent transition-shadow hover:glow-accent"
          >
            &gt; new signal
          </button>
        )}
      </div>
    </Layout>
  );
}
