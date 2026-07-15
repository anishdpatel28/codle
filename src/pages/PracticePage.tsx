// Practice mode. A random past transmission (no date) never touches scores and
// shows only the guesses panel, since practice is not part of the tracked record.
// A specific date, reached from the archive, records a real result for that day
// and shows the full result screen (stats and share) — identical to revisiting
// the entry later in read-only review.

import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LogPanel } from '../components/LogPanel';
import { LogPanelSkeleton } from '../components/LogPanelSkeleton';
import { GuessPanel } from '../components/GuessPanel';
import { GuessPanelSkeleton } from '../components/GuessPanelSkeleton';
import { StatsBlockSkeleton } from '../components/StatsBlockSkeleton';
import { Sidebar } from '../components/Sidebar';
import { TwoColumn } from '../components/TwoColumn';
import { usePractice } from '../hooks/usePractice';
import { useDashboard } from '../hooks/useDashboard';
import { useGame } from '../game/useGame';
import { useAuth } from '../hooks/authContext';
import { MAX_ATTEMPTS } from '../game/gameMachine';
import { getTermNames, saveScore } from '../data/queries';

export function PracticePage() {
  const { date } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  // location.key changes on every navigation to this route — including clicking
  // "practice" while already here — which re-pulls a fresh random round.
  const { term, loading, error } = usePractice(date, location.key);
  const { stats, reload } = useDashboard(user?.id ?? null);
  const { state, submit } = useGame(term, Boolean(date));
  const suggestions = useMemo(() => getTermNames(), []);

  // A dated replay from the archive is a real result for that day; a random pull
  // is not. Save once when a dated round finishes, then refresh stats so the
  // result screen matches revisiting the entry later.
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
    }).then(reload);
  }, [date, term, state.status, state.attemptsUsed, state.guesses, user?.id, reload]);

  const finished = state.status !== 'playing';
  const solved = state.status === 'won';
  const disclosureLabel = date ? 'stats & guesses' : 'guesses';

  // Dated archive replay: the full result screen, exactly like the review page.
  // Random practice: guesses only.
  const sidebar = date ? (
    <Sidebar
      stats={stats}
      guesses={state.guesses}
      solved={solved}
      share={{
        label: date,
        status: finished ? (state.status as 'won' | 'lost') : null,
        attemptsUsed: state.attemptsUsed,
        solvedOnAttempt: state.solvedOnAttempt,
        total: MAX_ATTEMPTS,
      }}
    />
  ) : (
    <GuessPanel guesses={state.guesses} solved={solved} total={MAX_ATTEMPTS} />
  );

  const sidebarSkeleton = date ? (
    <div className="flex flex-col gap-8">
      <GuessPanelSkeleton total={MAX_ATTEMPTS} />
      <StatsBlockSkeleton />
    </div>
  ) : (
    <GuessPanelSkeleton total={MAX_ATTEMPTS} />
  );

  return (
    <Layout>
      <h1 className="mb-8 font-sans text-h1 text-primary">
        {date ? 'Archived' : 'Practice'}{' '}
        <span className="text-accent">codle</span>
      </h1>

      {loading ? (
        <TwoColumn
          disclosureLabel={disclosureLabel}
          sidebar={sidebarSkeleton}
          main={<LogPanelSkeleton />}
        />
      ) : error ? (
        <p className="font-mono text-mono text-danger">error: {error}</p>
      ) : !term ? (
        <p className="font-mono text-mono text-muted">no past transmissions to practice yet.</p>
      ) : (
        <TwoColumn
          disclosureLabel={disclosureLabel}
          sidebar={sidebar}
          main={
            <LogPanel
              term={term}
              state={state}
              onSubmit={submit}
              signalLabel={date ? `SIGNAL://${date}` : 'SIGNAL://PRACTICE'}
              maxAttempts={MAX_ATTEMPTS}
              suggestions={suggestions}
            />
          }
        />
      )}
    </Layout>
  );
}
