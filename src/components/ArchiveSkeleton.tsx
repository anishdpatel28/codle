// Loading placeholder for the archive list: dimmed rows matching ArchiveRow's
// shape (date + term on the left, status on the right). Row count is an estimate
// of a typical archive; real rows replace these in place once loaded.

import { Skeleton } from './Skeleton';

const ROWS = 8;

export function ArchiveSkeleton() {
  return (
    <div className="max-w-2xl" aria-busy aria-label="Loading archive">
      {Array.from({ length: ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b border-hairline px-2 py-3"
        >
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-[15px] w-[160px]" />
          </div>
          <Skeleton className="h-[15px] w-[96px]" />
        </div>
      ))}
    </div>
  );
}
