// Loading placeholder for the LogPanel: window-chrome bar, six hint log lines,
// and the command-input row — the same shape LogPanel renders once the term
// loads, so the skeleton swaps out with no layout shift.

import { Skeleton } from './Skeleton';

// Mirrors RedactedLine's staggered widths so the log reads as varied text.
const HINT_WIDTHS = ['w-1/2', 'w-3/5', 'w-2/3', 'w-4/5', 'w-1/2', 'w-3/4'];

export function LogPanelSkeleton() {
  return (
    <section
      className="flex flex-col overflow-hidden rounded-[2px] border border-hairline bg-surface"
      aria-busy
      aria-label="Loading signal"
    >
      {/* chrome bar: real static dots, placeholder for the signal label */}
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <div className="flex gap-1" aria-hidden>
          <span className="h-2 w-2 bg-hairline" />
          <span className="h-2 w-2 bg-hairline" />
          <span className="h-2 w-2 bg-hairline" />
        </div>
        <Skeleton className="h-3 w-[160px]" />
      </div>

      {/* hint log */}
      <div className="flex flex-col divide-y divide-hairline px-6 py-4">
        {HINT_WIDTHS.map((w, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="h-[14px] w-14 shrink-0" />
            <Skeleton className={`h-[14px] ${w}`} />
          </div>
        ))}
      </div>

      {/* command-input row (sits on a raised surface, so use the hairline tone) */}
      <div className="border-t border-hairline bg-surface-raised px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="select-none font-mono text-mono text-accent">&gt;</span>
          <Skeleton tone="hairline" className="h-4 w-[160px]" />
        </div>
      </div>
    </section>
  );
}
