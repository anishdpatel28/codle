// Read-only review of a completed archive entry: the same result screen the user
// saw when they finished it, including their guess history. Not replayable.

import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { useAuth } from '../hooks/authContext';
import { useArchiveEntry } from '../hooks/useArchiveEntry';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import type { GameState } from '../game/types';
import type { Score } from '../data/types';

function reviewState(score: Score, hintCount: number): GameState {
  return {
    attemptsUsed: score.attemptsUsed,
    revealedHints: score.solved ? Math.min(hintCount, score.attemptsUsed) : hintCount,
    status: score.solved ? 'won' : 'lost',
    solvedOnAttempt: score.solved ? score.attemptsUsed : null,
    lastResult: null,
    feedbackId: 0,
    guesses: score.guesses,
  };
}

export function ArchiveReviewPage() {
  const { date } = useParams();
  const { user } = useAuth();
  const { term, score, loading, error } = useArchiveEntry(date, user?.id ?? null);

  return (
    <Layout>
      <h1 className="mb-2 font-sans text-h1 text-primary">
        Signal <span className="text-accent">review</span>
      </h1>
      <Link
        to="/archive"
        className="mb-8 inline-block font-mono text-mono text-muted transition-colors hover:text-primary"
      >
        &gt; back to archive
      </Link>

      <div className="max-w-3xl">
        {loading && <p className="font-mono text-mono text-muted">loading…</p>}
        {error && <p className="font-mono text-mono text-danger">error: {error}</p>}
        {!loading && !error && !term && (
          <p className="font-mono text-mono text-muted">no signal for {date}.</p>
        )}
        {term && !loading && !score && (
          <p className="font-mono text-mono text-muted">
            you haven&rsquo;t decoded this signal yet —{' '}
            <Link to={`/practice/${date}`} className="text-accent hover:glow-accent">
              &gt; decode
            </Link>
          </p>
        )}
        {term && score && (
          <LogPanel
            term={term}
            state={reviewState(score, term.hints.length)}
            onSubmit={() => {}}
            signalLabel={`SIGNAL://${date}`}
            maxAttempts={MAX_ATTEMPTS}
            suggestions={[]}
            readOnly
          />
        )}
      </div>
    </Layout>
  );
}
