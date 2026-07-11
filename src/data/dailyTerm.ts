import { termForIndex } from './rotation';
import type { DailyTerm } from './types';

// Day 0 of the rotation. The seed migration uses the same epoch.
const EPOCH_ISO = '2026-07-01';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dayNumber(dateISO: string): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const [ey, em, ed] = EPOCH_ISO.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed)) / MS_PER_DAY);
}

export function seedTermForDate(dateISO: string): DailyTerm {
  const seed = termForIndex(dayNumber(dateISO));
  return {
    id: `local-${dateISO}`,
    date: dateISO,
    term: seed.term,
    hints: seed.hints,
    definition: seed.definition,
  };
}

// Every day from the epoch through `uptoISO`, newest first, for the archive.
export function seedPastTerms(uptoISO: string = todayISO()): DailyTerm[] {
  const days = dayNumber(uptoISO);
  if (days < 0) return [];
  const out: DailyTerm[] = [];
  for (let n = days; n >= 0; n--) {
    const d = new Date(Date.UTC(2026, 6, 1) + n * MS_PER_DAY);
    out.push(seedTermForDate(toISODate(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))));
  }
  return out;
}
