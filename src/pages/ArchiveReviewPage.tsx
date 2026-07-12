// Read-only review of a completed archive entry: the same result screen the user
// saw when they finished it, including their guess history. Not replayable. Same
// two-column layout as the daily page.

import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { Sidebar } from '../components/Sidebar';
import { TwoColumn } from '../components/TwoColumn';
import { useAuth } from '../hooks/authContext';
import { useDashboard } from '../hooks/useDashboard';
import { useArchiveEntry } from '../hooks/useArchiveEntry';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import { reviewState } from '../game/review';

export function ArchiveReviewPage() {
  const { date } = useParams();
  const { user } = useAuth();
  const { term, score, loading, error } = useArchiveEntry(date, user?.id ?? null);
  const { stats } = useDashboard(user?.id ?? null);

  return (
    <Layout>
      <h1 className="mb-8 font-sans text-h1 text-primary">
        Signal <span className="text-accent">review</span>
      </h1>

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
        <TwoColumn
          disclosureLabel="stats & guesses"
          sidebar={
            <Sidebar
              stats={stats}
              guesses={score.guesses}
              solved={score.solved}
              share={{
                label: date ?? term.date,
                status: score.solved ? 'won' : 'lost',
                attemptsUsed: score.attemptsUsed,
                solvedOnAttempt: score.solved ? score.attemptsUsed : null,
                total: MAX_ATTEMPTS,
              }}
            />
          }
          main={
            <LogPanel
              term={term}
              state={reviewState(score, term.hints.length)}
              onSubmit={() => {}}
              signalLabel={`SIGNAL://${date}`}
              maxAttempts={MAX_ATTEMPTS}
              suggestions={[]}
              readOnly
            />
          }
        />
      )}
    </Layout>
  );
}
