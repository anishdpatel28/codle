// One archive entry. Unplayed days stay redacted with a link into practice.

import { Link } from 'react-router-dom';
import type { DailyTerm, Score } from '../data/types';

interface Props {
  term: DailyTerm;
  score?: Score;
}

export function ArchiveRow({ term, score }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline py-3">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-meta uppercase text-muted">{term.date}</span>
        {score ? (
          <span className="font-mono text-mono font-medium text-accent">{term.term}</span>
        ) : (
          <span className="redacted-bar inline-block h-[14px] w-40" aria-label="not played" />
        )}
      </div>
      <div className="flex items-center gap-4">
        {score ? (
          <span
            className={`font-mono text-mono ${score.solved ? 'text-success' : 'text-danger'}`}
          >
            {score.solved ? `decoded ${score.attemptsUsed}/6` : 'missed · X/6'}
          </span>
        ) : (
          <Link
            to={`/practice/${term.date}`}
            className="font-mono text-mono text-accent transition-shadow hover:glow-accent"
          >
            &gt; decode
          </Link>
        )}
      </div>
    </div>
  );
}
