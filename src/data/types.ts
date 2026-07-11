// Shared data-model types. Mirrors the Supabase schema in
// supabase/migrations/0001_init.sql.

export interface DailyTerm {
  id: string;
  /** ISO calendar date, YYYY-MM-DD. Unique per daily term. */
  date: string;
  term: string;
  /** Hints ordered most obscure/abstract -> most obvious. */
  hints: string[];
  definition: string;
}

export interface Score {
  id: string;
  userId: string;
  dailyTermId: string;
  attemptsUsed: number;
  solved: boolean;
  isPractice: boolean;
  completedAt: string;
}

/** Payload written when a round finishes. */
export interface ScoreInput {
  dailyTermId: string;
  attemptsUsed: number;
  solved: boolean;
  isPractice: boolean;
}
