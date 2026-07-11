// Compact signal-history heat strip: one small square per past day, colored
// solved / missed / unplayed. A heat-strip, not a calendar grid.

import type { DailyTerm, Score } from '../data/types';

interface Props {
  terms: DailyTerm[];
  scores: Record<string, Score>;
}

export function ArchiveStrip({ terms, scores }: Props) {
  // Oldest -> newest, left -> right; cap to the most recent stretch.
  const recent = terms.slice(0, 84).reverse();

  return (
    <section className="rounded-[2px] border border-hairline bg-surface p-4">
      <h2 className="mb-3 font-sans text-meta uppercase text-muted">Signal history</h2>
      <div className="flex flex-wrap gap-1">
        {recent.map((t) => {
          const s = scores[t.id];
          const cls = s ? (s.solved ? 'bg-success' : 'bg-danger') : 'bg-hairline';
          const status = s
            ? s.solved
              ? `decoded ${s.attemptsUsed}/6`
              : 'missed'
            : 'not played';
          return (
            <span
              key={t.id}
              title={`${t.date} · ${status}`}
              className={`h-4 w-4 rounded-[1px] ${cls}`}
            />
          );
        })}
        {recent.length === 0 && (
          <span className="font-mono text-mono text-muted">no signals archived yet</span>
        )}
      </div>
    </section>
  );
}
