// Running list of this round's guesses in submission order. A skip (empty guess)
// shows as "Skipped"; a winning final guess reads green, others red.

interface Props {
  guesses: string[];
  solved: boolean;
}

export function GuessHistory({ guesses, solved }: Props) {
  if (guesses.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4">
      <span className="font-sans text-meta uppercase text-muted">Guesses</span>
      <ol className="flex flex-col gap-1">
        {guesses.map((g, i) => {
          const skipped = g === '';
          const correct = solved && i === guesses.length - 1;
          const cls = correct ? 'text-success' : skipped ? 'text-muted' : 'text-danger';
          return (
            <li key={i} className="flex items-baseline gap-3 font-mono text-mono">
              <span className="select-none text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className={cls}>{skipped ? 'Skipped' : g}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
