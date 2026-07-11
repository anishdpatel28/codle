// Reveals a hint by first filling it with random glyphs, then locking in the
// real characters left-to-right. Returns the display string and how many
// characters have settled.

import { useEffect, useRef, useState } from 'react';
import { scrambleGlyphs, reveal } from '../styles/tokens';

function randomGlyph(): string {
  return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)];
}

/** Real characters up to `settled`, random glyphs after; spaces stay spaces. */
function scrambleString(target: string, settled: number): string {
  let out = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    out += i < settled || ch === ' ' ? ch : randomGlyph();
  }
  return out;
}

export interface DecryptReveal {
  text: string;
  settledCount: number;
  done: boolean;
}

export function useDecryptReveal(target: string, animate: boolean): DecryptReveal {
  const [display, setDisplay] = useState(animate ? '' : target);
  const [settled, setSettled] = useState(animate ? 0 : target.length);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clearAll = () => {
      for (const t of timers.current) {
        clearTimeout(t);
        clearInterval(t);
      }
      timers.current = [];
    };
    clearAll();

    if (!animate) {
      setSettled(target.length);
      setDisplay(target);
      return;
    }

    setSettled(0);
    setDisplay(scrambleString(target, 0));

    // Phase 1: cycle random glyphs across the whole line.
    const scramble = window.setInterval(() => {
      setDisplay(scrambleString(target, 0));
    }, reveal.scrambleTickMs);
    timers.current.push(scramble);

    // Phase 2: lock characters left-to-right in small batches.
    const beginSettle = window.setTimeout(() => {
      clearInterval(scramble);
      let s = 0;
      const settle = window.setInterval(() => {
        s = Math.min(target.length, s + reveal.settlePerTick);
        setSettled(s);
        setDisplay(scrambleString(target, s));
        if (s >= target.length) clearInterval(settle);
      }, reveal.settleTickMs);
      timers.current.push(settle);
    }, reveal.scrambleMs);
    timers.current.push(beginSettle);

    return clearAll;
  }, [target, animate]);

  return { text: display, settledCount: settled, done: settled >= target.length };
}
