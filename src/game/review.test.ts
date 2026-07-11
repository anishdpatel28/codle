import { describe, it, expect } from 'vitest';
import { reviewState } from './review';
import type { Score } from '../data/types';

function score(partial: Partial<Score>): Score {
  return {
    id: 's',
    userId: 'u',
    dailyTermId: 't',
    attemptsUsed: 3,
    solved: true,
    isPractice: false,
    guesses: ['a', '', 'b'],
    completedAt: '',
    ...partial,
  };
}

describe('reviewState', () => {
  it('reconstructs a won round', () => {
    const s = reviewState(score({ solved: true, attemptsUsed: 3 }), 6);
    expect(s.status).toBe('won');
    expect(s.solvedOnAttempt).toBe(3);
    expect(s.revealedHints).toBe(3);
    expect(s.guesses).toEqual(['a', '', 'b']);
  });

  it('reconstructs a lost round with every hint revealed', () => {
    const s = reviewState(score({ solved: false, attemptsUsed: 6 }), 6);
    expect(s.status).toBe('lost');
    expect(s.solvedOnAttempt).toBeNull();
    expect(s.revealedHints).toBe(6);
  });
});
