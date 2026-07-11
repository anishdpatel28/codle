// Data access layer. Falls back to the local rotation and localStorage-backed
// scores when Supabase is not configured.

import { supabase } from '../lib/supabase';
import { termBank } from './terms';
import type { DailyTerm, Score, ScoreInput } from './types';
import { seedTermForDate, seedPastTerms, todayISO } from './dailyTerm';

/** Every valid answer, for the guess-input autocomplete. */
export function getTermNames(): string[] {
  return termBank.map((t) => t.term);
}

interface DailyTermRow {
  id: string;
  date: string;
  term: string;
  hints: string[];
  definition: string;
}

interface ScoreRow {
  id: string;
  user_id: string;
  daily_term_id: string;
  attempts_used: number;
  solved: boolean;
  is_practice: boolean;
  completed_at: string;
}

function mapTerm(row: DailyTermRow): DailyTerm {
  return {
    id: row.id,
    date: row.date,
    term: row.term,
    hints: row.hints,
    definition: row.definition,
  };
}

function mapScore(row: ScoreRow): Score {
  return {
    id: row.id,
    userId: row.user_id,
    dailyTermId: row.daily_term_id,
    attemptsUsed: row.attempts_used,
    solved: row.solved,
    isPractice: row.is_practice,
    completedAt: row.completed_at,
  };
}

// ---------------------------------------------------------------------------
// Daily terms
// ---------------------------------------------------------------------------

export async function getDailyTerm(dateISO: string): Promise<DailyTerm | null> {
  if (!supabase) return seedTermForDate(dateISO);

  const { data, error } = await supabase
    .from('daily_terms')
    .select('id, date, term, hints, definition')
    .eq('date', dateISO)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTerm(data as DailyTermRow) : null;
}

/** Past daily terms (date on or before `uptoISO`), newest first. */
export async function getPastTerms(
  uptoISO: string = todayISO(),
): Promise<DailyTerm[]> {
  if (!supabase) return seedPastTerms(uptoISO);

  const { data, error } = await supabase
    .from('daily_terms')
    .select('id, date, term, hints, definition')
    .lte('date', uptoISO)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data as DailyTermRow[]).map(mapTerm);
}

/** A random past term for practice mode. Never returns today's puzzle spoiler. */
export async function getRandomPastTerm(): Promise<DailyTerm | null> {
  const past = await getPastTerms(todayISO());
  if (past.length === 0) return null;
  return past[Math.floor(Math.random() * past.length)];
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

const LOCAL_SCORES_KEY = 'codle:scores';

function readLocalScores(): Score[] {
  try {
    const raw = localStorage.getItem(LOCAL_SCORES_KEY);
    return raw ? (JSON.parse(raw) as Score[]) : [];
  } catch {
    return [];
  }
}

function writeLocalScores(scores: Score[]): void {
  localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(scores));
}

/**
 * Non-practice daily scores for a user, keyed by daily_term_id. Used by the
 * archive and streak stats. Practice results are intentionally excluded.
 */
export async function getUserScores(
  userId: string | null,
): Promise<Record<string, Score>> {
  if (!supabase) {
    const map: Record<string, Score> = {};
    for (const s of readLocalScores()) {
      if (!s.isPractice) map[s.dailyTermId] = s;
    }
    return map;
  }
  if (!userId) return {};

  const { data, error } = await supabase
    .from('scores')
    .select('id, user_id, daily_term_id, attempts_used, solved, is_practice, completed_at')
    .eq('user_id', userId)
    .eq('is_practice', false);

  if (error) throw error;

  const map: Record<string, Score> = {};
  for (const row of data as ScoreRow[]) {
    map[row.daily_term_id] = mapScore(row);
  }
  return map;
}

/**
 * Persist a finished round. Daily results upsert one row per user+term;
 * practice results are stored separately and never affect streaks.
 */
export async function saveScore(
  userId: string | null,
  input: ScoreInput,
): Promise<void> {
  if (!supabase) {
    const scores = readLocalScores();
    if (!input.isPractice) {
      const idx = scores.findIndex(
        (s) => s.dailyTermId === input.dailyTermId && !s.isPractice,
      );
      const record: Score = {
        id: `local-${input.dailyTermId}`,
        userId: 'local',
        dailyTermId: input.dailyTermId,
        attemptsUsed: input.attemptsUsed,
        solved: input.solved,
        isPractice: false,
        completedAt: new Date().toISOString(),
      };
      if (idx >= 0) scores[idx] = record;
      else scores.push(record);
    }
    writeLocalScores(scores);
    return;
  }

  // Practice results are never persisted to the signed-in account's streak set.
  if (!userId || input.isPractice) return;

  const { data: existing, error: selErr } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', userId)
    .eq('daily_term_id', input.dailyTermId)
    .eq('is_practice', false)
    .maybeSingle();

  if (selErr) throw selErr;

  const payload = {
    user_id: userId,
    daily_term_id: input.dailyTermId,
    attempts_used: input.attemptsUsed,
    solved: input.solved,
    is_practice: false,
    completed_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from('scores')
      .update(payload)
      .eq('id', (existing as { id: string }).id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('scores').insert(payload);
    if (error) throw error;
  }
}
