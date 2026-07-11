// A locked hint: a blacked-out placeholder bar at ~40% opacity. Its presence
// tells the player exactly how many hints remain to be decrypted.

const WIDTHS = ['w-1/2', 'w-3/5', 'w-2/3', 'w-4/5', 'w-1/2', 'w-3/4'];

interface Props {
  index: number;
}

export function RedactedLine({ index }: Props) {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden>
      <span className="font-mono text-mono text-muted/50 select-none">Hint {index}</span>
      <span className={`redacted-bar h-[14px] ${WIDTHS[(index - 1) % WIDTHS.length]}`} />
    </div>
  );
}
