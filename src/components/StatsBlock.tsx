// Win-rate readout in mono numerals. Subordinate to the log panel.

import type { Stats } from '../data/stats';

interface Props {
  stats: Stats;
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function StatsBlock({ stats }: Props) {
  const cells = [
    { label: 'Win rate', value: stats.played ? pct(stats.winRate) : '—' },
    { label: 'Played', value: String(stats.played) },
  ];

  return (
    <section className="rounded-[2px] border border-hairline bg-surface p-4">
      <h2 className="mb-3 font-sans text-meta uppercase text-muted">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {cells.map((c) => (
          <div key={c.label} className="flex flex-col gap-1">
            <span className="font-mono text-mono-lg font-semibold text-primary">{c.value}</span>
            <span className="font-sans text-meta uppercase text-muted">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
