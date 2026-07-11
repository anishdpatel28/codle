// The transmission log: revealed hints as decrypting log lines, remaining hints
// as redacted placeholder bars. Only the hint that just unlocked animates.

import { useCallback, useEffect, useRef, useState } from 'react';
import { HintLine } from './HintLine';
import { RedactedLine } from './RedactedLine';

interface Props {
  hints: string[];
  revealedHints: number;
}

export function HintLog({ hints, revealedHints }: Props) {
  const prev = useRef(revealedHints);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (revealedHints > prev.current) setAnimatingIndex(revealedHints - 1);
    prev.current = revealedHints;
  }, [revealedHints]);

  const clearAnimating = useCallback(() => setAnimatingIndex(null), []);

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {hints.map((hint, i) =>
        i < revealedHints ? (
          <HintLine
            key={i}
            index={i + 1}
            hint={hint}
            animate={animatingIndex === i}
            onDone={clearAnimating}
          />
        ) : (
          <RedactedLine key={i} index={i + 1} />
        ),
      )}
    </div>
  );
}
