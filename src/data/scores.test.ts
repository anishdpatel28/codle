import { describe, it, expect, beforeEach } from 'vitest';
import { saveScore, getScore, getUserScores } from './queries';

// With no Supabase configured (test env), scores are guest-local in localStorage.
describe('local score persistence', () => {
  beforeEach(() => localStorage.clear());

  it('records a completed archive entry with its guess history', async () => {
    await saveScore(null, {
      dailyTermId: 't1',
      attemptsUsed: 3,
      solved: true,
      isPractice: false,
      guesses: ['hash table', '', 'binary search'],
    });
    const s = await getScore(null, 't1');
    expect(s?.solved).toBe(true);
    expect(s?.attemptsUsed).toBe(3);
    expect(s?.guesses).toEqual(['hash table', '', 'binary search']);
  });

  it('returns null for an uncompleted archive entry', async () => {
    await saveScore(null, {
      dailyTermId: 't1',
      attemptsUsed: 1,
      solved: false,
      isPractice: false,
      guesses: [''],
    });
    expect(await getScore(null, 'never-played')).toBeNull();
  });

  it('never records practice results', async () => {
    await saveScore(null, {
      dailyTermId: 't2',
      attemptsUsed: 1,
      solved: true,
      isPractice: true,
      guesses: [],
    });
    expect(await getScore(null, 't2')).toBeNull();
    expect('t2' in (await getUserScores(null))).toBe(false);
  });

  it('upserts: a replay overwrites the prior result for that day', async () => {
    await saveScore(null, {
      dailyTermId: 't3',
      attemptsUsed: 6,
      solved: false,
      isPractice: false,
      guesses: [],
    });
    await saveScore(null, {
      dailyTermId: 't3',
      attemptsUsed: 2,
      solved: true,
      isPractice: false,
      guesses: ['x'],
    });
    const s = await getScore(null, 't3');
    expect(s?.solved).toBe(true);
    expect(s?.attemptsUsed).toBe(2);
  });
});
