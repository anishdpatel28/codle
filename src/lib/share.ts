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

export function buildShare({
  label,
  status,
  attemptsUsed,
  solvedOnAttempt,
  total,
}: ShareResult): string {
  // Emoji squares render as plain text, so a shared result pastes anywhere (texts,
  // Discord) with no image. Amber marks an attempt spent, black one still unused —
  // the same signal/dim language the rest of the app uses.
  const spent = '🟨'.repeat(attemptsUsed);
  const unused = '⬛'.repeat(Math.max(0, total - attemptsUsed));
  const read = status === 'won' ? `${solvedOnAttempt}/${total} decoded` : `X/${total} signal lost`;
  return `codle // ${label}\n${spent}${unused} ${read}\n${archiveUrl(label)}`;
}
