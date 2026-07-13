// Loading placeholder for GuessPanel: the "Guesses" box with one row per attempt.
// Matches GuessPanel's fixed-size shape so it swaps out without shifting.

import { Skeleton } from './Skeleton';

interface Props {
  total: number;
}

export function GuessPanelSkeleton({ total }: Props) {
  return (
    <section className="rounded-[2px] border border-hairline bg-surface p-4" aria-busy>
      <h2 className="mb-3 font-sans text-meta uppercase text-muted">Guesses</h2>
      <ol className="flex flex-col gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <li key={i} className="flex h-6 items-center gap-3">
            <span className="select-none font-mono text-mono text-muted/60">
              {String(i + 1).padStart(2, '0')}
            </span>
            <Skeleton className="h-[10px] w-24" />
          </li>
        ))}
      </ol>
    </section>
  );
}
