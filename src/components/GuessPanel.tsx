// Fixed-size panel showing all `total` attempt slots up front. Each slot fills
// in as a guess is made — "Skipped" for an empty guess, green for a winning
// final guess, red otherwise — so the panel never changes size.

interface Props {
  guesses: string[];
  solved: boolean;
  total: number;
}

export function GuessPanel({ guesses, solved, total }: Props) {
  return (
    <section className="rounded-[2px] border border-hairline bg-surface p-4">
      <h2 className="mb-3 font-sans text-meta uppercase text-muted">Guesses</h2>
      <ol className="flex flex-col gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < guesses.length;
          const guess = filled ? guesses[i] : '';
          const skipped = filled && guess === '';
          const correct = solved && filled && i === guesses.length - 1;
          const cls = !filled
            ? 'text-muted/40'
            : correct
              ? 'text-success'
              : skipped
                ? 'text-muted'
                : 'text-danger';
          return (
            <li key={i} className="flex h-6 items-center gap-3 font-mono text-mono">
              <span className="select-none text-muted/60">{String(i + 1).padStart(2, '0')}</span>
              {filled ? (
                <span className={`truncate ${cls}`}>{skipped ? 'Skipped' : guess}</span>
              ) : (
                <span className="redacted-bar h-[10px] w-24 opacity-40" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
