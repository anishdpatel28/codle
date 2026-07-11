// A revealed hint as a decrypting log line, with a scanline sweep on settle.

import { useEffect, useState } from 'react';
import { useDecryptReveal } from '../hooks/useDecryptReveal';

interface Props {
  index: number;
  hint: string;
  animate: boolean;
  onDone?: () => void;
}

export function HintLine({ index, hint, animate, onDone }: Props) {
  const { text, settledCount, done } = useDecryptReveal(hint, animate);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (!animate || !done) return;
    onDone?.();
    setGlow(true);
    const t = window.setTimeout(() => setGlow(false), 400);
    return () => clearTimeout(t);
  }, [animate, done, onDone]);

  const settled = text.slice(0, settledCount);
  const scrambling = text.slice(settledCount);

  return (
    <div className="relative flex items-start gap-3 overflow-hidden py-2">
      <span className="font-mono text-mono text-muted select-none">Hint {index}</span>
      <p className="font-mono text-mono">
        <span className={glow ? 'text-primary glow-accent' : 'text-primary'}>{settled}</span>
        <span className="text-accent">{scrambling}</span>
      </p>
      {animate && done && (
        <span className="animate-scanline-sweep pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-accent" />
      )}
    </div>
  );
}
