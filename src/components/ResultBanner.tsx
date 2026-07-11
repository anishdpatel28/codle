// End-of-round reveal: the term, the attempt count, and the definition.

interface Props {
  status: 'won' | 'lost';
  term: string;
  definition: string;
  solvedOnAttempt: number | null;
  total: number;
}

export function ResultBanner({ status, term, definition, solvedOnAttempt, total }: Props) {
  const won = status === 'won';
  return (
    <div className="flex flex-col gap-4 border-t border-hairline px-6 py-6">
      <div className="flex flex-col gap-2">
        <span
          className={`font-sans text-meta uppercase ${won ? 'text-success' : 'text-danger'}`}
        >
          {won ? '// signal decoded' : '// signal lost'}
        </span>
        <span
          className={`font-mono text-mono-lg ${won ? 'text-success glow-accent' : 'text-primary'}`}
        >
          {term}
        </span>
        <span className="font-mono text-meta uppercase text-muted">
          {won ? `decoded in ${solvedOnAttempt}/${total}` : `unsolved · X/${total}`}
        </span>
      </div>
      <p className="max-w-prose font-sans text-body text-primary/90">{definition}</p>
    </div>
  );
}
