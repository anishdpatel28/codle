// Data access layer. Falls back to the local rotation and localStorage-backed
// scores when Supabase is not configured.

import { supabase } from '../lib/supabase';
import { termBank } from './terms';
import type { DailyTerm, Score, ScoreInput } from './types';
import { seedTermForDate, seedPastTerms, todayISO } from './dailyTerm';
import { readStore, writeStore } from './storage';

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
  guesses: string[] | null;
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
    guesses: row.guesses ?? [],
    completedAt: row.completed_at,
  };
}

const SCORE_COLUMNS =
  'id, user_id, daily_term_id, attempts_used, solved, is_practice, guesses, completed_at';

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
  return readStore<Score[]>(LOCAL_SCORES_KEY, []);
}

function writeLocalScores(scores: Score[]): void {
  writeStore(LOCAL_SCORES_KEY, scores);
}

function upsertLocalScore(input: ScoreInput): void {
  if (input.isPractice) return;
  const scores = readLocalScores();
  const record: Score = {
    id: `local-${input.dailyTermId}`,
    userId: 'local',
    dailyTermId: input.dailyTermId,
    attemptsUsed: input.attemptsUsed,
    solved: input.solved,
    isPractice: false,
    guesses: input.guesses,
    completedAt: new Date().toISOString(),
  };
  const idx = scores.findIndex((s) => s.dailyTermId === input.dailyTermId && !s.isPractice);
  if (idx >= 0) scores[idx] = record;
  else scores.push(record);
  writeLocalScores(scores);
}

/** True when scores live in localStorage: no backend, or a signed-out guest. */
function scoresAreLocal(userId: string | null): boolean {
  return !supabase || !userId;
}

/**
 * Non-practice daily scores keyed by daily_term_id, for the archive and stats.
 * Signed-in users read from the backend; guests read their local store.
 */
export async function getUserScores(
  userId: string | null,
): Promise<Record<string, Score>> {
  const map: Record<string, Score> = {};

  if (scoresAreLocal(userId)) {
    for (const s of readLocalScores()) {
      if (!s.isPractice) map[s.dailyTermId] = s;
    }
    return map;
  }

  const { data, error } = await supabase!
    .from('scores')
    .select(SCORE_COLUMNS)
    .eq('user_id', userId)
    .eq('is_practice', false);

  if (error) throw error;
  for (const row of data as ScoreRow[]) {
    map[row.daily_term_id] = mapScore(row);
  }
  return map;
}

/** A single non-practice score for a term, for archive review. */
export async function getScore(
  userId: string | null,
  dailyTermId: string,
): Promise<Score | null> {
  if (scoresAreLocal(userId)) {
    return (
      readLocalScores().find((s) => s.dailyTermId === dailyTermId && !s.isPractice) ?? null
    );
  }

  const { data, error } = await supabase!
    .from('scores')
    .select(SCORE_COLUMNS)
    .eq('user_id', userId)
    .eq('daily_term_id', dailyTermId)
    .eq('is_practice', false)
    .maybeSingle();

  if (error) throw error;
  return data ? mapScore(data as ScoreRow) : null;
}

/** Persist a finished round. Practice results are never recorded. */
export async function saveScore(userId: string | null, input: ScoreInput): Promise<void> {
  if (input.isPractice) return;

  if (scoresAreLocal(userId)) {
    upsertLocalScore(input);
    return;
  }

  await upsertRemoteScore(userId as string, input);
}

async function upsertRemoteScore(userId: string, input: ScoreInput): Promise<void> {
  const { data: existing, error: selErr } = await supabase!
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
    guesses: input.guesses,
    completed_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase!
      .from('scores')
      .update(payload)
      .eq('id', (existing as { id: string }).id);
    if (error) throw error;
  } else {
    const { error } = await supabase!.from('scores').insert(payload);
    if (error) throw error;
  }
}

/**
 * On sign-in, carry a guest's locally-saved scores into their account, then
 * clear the local store. Existing account scores are left untouched.
 */
export async function migrateGuestScores(userId: string): Promise<void> {
  if (!supabase) return;
  const local = readLocalScores().filter((s) => !s.isPractice);
  if (local.length === 0) return;

  const existing = await getUserScores(userId);
  for (const s of local) {
    if (existing[s.dailyTermId]) continue;
    await upsertRemoteScore(userId, {
      dailyTermId: s.dailyTermId,
      attemptsUsed: s.attemptsUsed,
      solved: s.solved,
      isPractice: false,
      guesses: s.guesses,
    });
  }
  writeLocalScores([]);
}
