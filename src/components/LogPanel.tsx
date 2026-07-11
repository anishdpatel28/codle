// The terminal panel: chrome, the hint log, live feedback, the end-of-round
// reveal, and the command input. Presentational — all state arrives via props.

import type { DailyTerm } from '../data/types';
import type { GameState } from '../game/types';
import { WindowChrome } from './WindowChrome';
import { HintLog } from './HintLog';
import { FeedbackLine } from './FeedbackLine';
import { ResultBanner } from './ResultBanner';
import { CommandInput } from './CommandInput';

interface Props {
  term: DailyTerm;
  state: GameState;
  onSubmit: (guess: string) => void;
  signalLabel: string;
  maxAttempts: number;
  suggestions: string[];
}

export function LogPanel({ term, state, onSubmit, signalLabel, maxAttempts, suggestions }: Props) {
  const finished = state.status !== 'playing';
  const result = state.status === 'won' ? 'won' : state.status === 'lost' ? 'lost' : null;

  return (
    <section className="flex min-h-[540px] flex-col overflow-hidden rounded-[2px] border border-hairline bg-surface">
      <WindowChrome label={signalLabel} />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <HintLog hints={term.hints} revealedHints={state.revealedHints} />
        {!finished && state.lastResult && (
          <div key={state.feedbackId} className="mt-4">
            <FeedbackLine result={state.lastResult} />
          </div>
        )}
      </div>

      {result ? (
        <ResultBanner
          status={result}
          term={term.term}
          definition={term.definition}
          solvedOnAttempt={state.solvedOnAttempt}
          total={maxAttempts}
        />
      ) : (
        <CommandInput onSubmit={onSubmit} suggestions={suggestions} />
      )}
    </section>
  );
}
