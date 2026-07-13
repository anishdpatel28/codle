// A dimmed, gently pulsing placeholder block, the atom every loading skeleton is
// built from. Uses the raised-surface / hairline tokens so it reads as part of
// the terminal UI rather than a generic gray box. Callers set size via className.

interface Props {
  className?: string;
  /** `hairline` for placeholders sitting on a raised surface, where the default
   *  raised tone would not contrast. */
  tone?: 'raised' | 'hairline';
}

export function Skeleton({ className = '', tone = 'raised' }: Props) {
  const bg = tone === 'hairline' ? 'bg-hairline' : 'bg-surface-raised';
  return <span aria-hidden className={`block animate-pulse rounded-[2px] ${bg} ${className}`} />;
}
