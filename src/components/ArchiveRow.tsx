// One archive entry. Completed days link to a read-only review; unplayed days
// stay redacted with a link into practice.

import { Link } from 'react-router-dom';
import type { DailyTerm, Score } from '../data/types';

interface Props {
  term: DailyTerm;
  score?: Score;
}

export function ArchiveRow({ term, score }: Props) {
  if (score) {
    return (
      <Link
        to={`/archive/${term.date}`}
        className="flex items-center justify-between gap-4 border-b border-hairline px-2 py-3 transition-colors hover:bg-surface-raised"
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-meta uppercase text-muted">{term.date}</span>
          <span className="font-mono text-mono font-medium text-accent">{term.term}</span>
        </div>
        <span className={`font-mono text-mono ${score.solved ? 'text-success' : 'text-danger'}`}>
          {score.solved ? `decoded ${score.attemptsUsed}/6` : 'missed · X/6'}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/practice/${term.date}`}
      className="flex items-center justify-between gap-4 border-b border-hairline px-2 py-3 transition-colors hover:bg-surface-raised"
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-meta uppercase text-muted">{term.date}</span>
        <span className="redacted-bar inline-block h-[14px] w-40" aria-label="not played" />
      </div>
      <span className="font-mono text-mono text-accent">&gt; decode</span>
    </Link>
  );
}
