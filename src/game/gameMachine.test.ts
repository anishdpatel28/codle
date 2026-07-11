import { describe, it, expect } from 'vitest';
import { initGame, submitGuess, MAX_ATTEMPTS } from './gameMachine';

const TERM = "Dijkstra's Algorithm";
const HINTS = 6;

describe('submitGuess', () => {
  it('starts with one hint and no guesses', () => {
    const s = initGame();
    expect(s.attemptsUsed).toBe(0);
    expect(s.revealedHints).toBe(1);
    expect(s.guesses).toEqual([]);
    expect(s.status).toBe('playing');
  });

  it('records a wrong guess, spends an attempt, and reveals a hint', () => {
    const s = submitGuess(initGame(), 'hash table', TERM, HINTS);
    expect(s.attemptsUsed).toBe(1);
    expect(s.revealedHints).toBe(2);
    expect(s.status).toBe('playing');
    expect(s.lastResult).toBe('wrong');
    expect(s.guesses).toEqual(['hash table']);
  });

  it('records an empty guess as a skip (empty string)', () => {
    const s = submitGuess(initGame(), '   ', TERM, HINTS);
    expect(s.attemptsUsed).toBe(1);
    expect(s.lastResult).toBe('skip');
    expect(s.guesses).toEqual(['']);
  });

  it('accepts a symbol/case-variant correct guess and wins', () => {
    let s = submitGuess(initGame(), 'nope', TERM, HINTS);
    s = submitGuess(s, 'DIJKSTRAS ALGORITHM!!', TERM, HINTS);
    expect(s.status).toBe('won');
    expect(s.solvedOnAttempt).toBe(2);
    expect(s.guesses).toEqual(['nope', 'DIJKSTRAS ALGORITHM!!']);
  });

  it('loses after six wrong guesses and stops accepting input', () => {
    let s = initGame();
    for (let i = 0; i < MAX_ATTEMPTS; i++) s = submitGuess(s, `wrong${i}`, TERM, HINTS);
    expect(s.status).toBe('lost');
    expect(s.attemptsUsed).toBe(MAX_ATTEMPTS);
    expect(s.guesses).toHaveLength(MAX_ATTEMPTS);

    const after = submitGuess(s, TERM, TERM, HINTS);
    expect(after).toBe(s); // no-op once the round is over
  });
});
