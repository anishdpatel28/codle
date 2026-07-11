// Terminal window-chrome bar: three small square dots and a mono signal label.

interface Props {
  label: string;
}

export function WindowChrome({ label }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
      <div className="flex gap-1" aria-hidden>
        <span className="h-2 w-2 bg-hairline" />
        <span className="h-2 w-2 bg-hairline" />
        <span className="h-2 w-2 bg-hairline" />
      </div>
      <span className="font-mono text-meta uppercase text-muted">{label}</span>
    </div>
  );
}
