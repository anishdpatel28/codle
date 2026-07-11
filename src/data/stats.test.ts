import { describe, it, expect } from 'vitest';
import { computeStats } from './stats';
import type { DailyTerm, Score } from './types';

function term(id: string): DailyTerm {
  return { id, date: id, term: 'x', hints: [], definition: '' };
}

function score(dailyTermId: string, solved: boolean): Score {
  return {
    id: dailyTermId,
    userId: 'u',
    dailyTermId,
    attemptsUsed: solved ? 2 : 6,
    solved,
    isPractice: false,
    guesses: [],
    completedAt: '2026-07-11',
  };
}

describe('computeStats', () => {
  it('counts played and wins and derives a win rate', () => {
    const terms = [term('a'), term('b'), term('c')];
    const scores = { a: score('a', true), b: score('b', false) };
    const stats = computeStats(terms, scores);
    expect(stats.played).toBe(2);
    expect(stats.wins).toBe(1);
    expect(stats.winRate).toBeCloseTo(0.5);
  });

  it('returns a zero win rate with no plays and no streak field', () => {
    const stats = computeStats([term('a')], {});
    expect(stats.played).toBe(0);
    expect(stats.winRate).toBe(0);
    expect('currentStreak' in stats).toBe(false);
  });
});
