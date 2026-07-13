// Loading placeholder for StatsBlock: the "Stats" box with two numeric cells.
// Matches StatsBlock's shape so it swaps out without shifting.

import { Skeleton } from './Skeleton';

export function StatsBlockSkeleton() {
  return (
    <section className="rounded-[2px] border border-hairline bg-surface p-4" aria-busy>
      <h2 className="mb-3 font-sans text-meta uppercase text-muted">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-[28px] w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}
