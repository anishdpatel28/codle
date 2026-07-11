// The terminal panel: chrome, the hint log, the end-of-round reveal, and the
// command input. Presentational — state via props. Guess history lives in its
// own side panel so this box stays a fixed height.

import type { DailyTerm } from '../data/types';
import type { GameState } from '../game/types';
import { WindowChrome } from './WindowChrome';
import { HintLog } from './HintLog';
import { ResultBanner } from './ResultBanner';
import { CommandInput } from './CommandInput';

interface Props {
  term: DailyTerm;
  state: GameState;
  onSubmit: (guess: string) => void;
  signalLabel: string;
  maxAttempts: number;
  suggestions: string[];
  /** Review mode: never render the input, even mid-round. */
  readOnly?: boolean;
}

export function LogPanel({
  term,
  state,
  onSubmit,
  signalLabel,
  maxAttempts,
  suggestions,
  readOnly = false,
}: Props) {
  const result = state.status === 'won' ? 'won' : state.status === 'lost' ? 'lost' : null;

  return (
    <section className="flex flex-col overflow-hidden rounded-[2px] border border-hairline bg-surface">
      <WindowChrome label={signalLabel} />

      <div className="px-6 py-4">
        <HintLog hints={term.hints} revealedHints={state.revealedHints} />
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
        !readOnly && <CommandInput onSubmit={onSubmit} suggestions={suggestions} />
      )}
    </section>
  );
}
