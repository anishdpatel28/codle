// Builds the plain-text result a player copies to share. Spoiler-free — a signal
// read, never a letter grid — with a deep link back to the day's archive entry.

import { archiveUrl } from './site';

export interface ShareResult {
  /** The round's ISO date. Drives both the header and the archive deep link. */
  label: string;
  status: 'won' | 'lost';
  attemptsUsed: number;
  solvedOnAttempt: number | null;
  total: number;
}

const KEYCAP = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export function buildShare({ label, status, solvedOnAttempt, total }: ShareResult): string {
  // No per-guess grid: the game reveals hints rather than scoring letters, so the
  // result is a single mark over the fixed attempt total. A keycap is the attempt
  // that solved it; ❌ means lost. Trailing text matches the app's win/loss copy.
  const outcome = status === 'won' ? KEYCAP[solvedOnAttempt ?? 0] : '❌';
  const read = status === 'won' ? 'signal decoded' : 'signal lost';
  return `codle // ${label}\n${outcome}/${KEYCAP[total]} ${read}\n${archiveUrl(label)}`;
}
