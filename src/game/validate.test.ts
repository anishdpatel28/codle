import { describe, it, expect } from 'vitest';
import { normalize, isEmptyGuess, isCorrect, isValidTerm } from './validate';

const TERMS = ['Binary Search', "Dijkstra's Algorithm", 'Hash Table'];

describe('normalize', () => {
  it('ignores case, punctuation, symbols, and extra whitespace', () => {
    expect(normalize('  DIJKSTRAS   ALGORITHM!!  ')).toBe('dijkstras algorithm');
    expect(normalize("Dijkstra's Algorithm")).toBe('dijkstras algorithm');
    expect(normalize('Big-O')).toBe('big o');
  });

  it('reduces empty/symbol-only input to an empty string', () => {
    expect(normalize('   ')).toBe('');
    expect(normalize('!@#$%')).toBe('');
  });
});

describe('isEmptyGuess', () => {
  it('treats whitespace/symbols as empty (a skip)', () => {
    expect(isEmptyGuess('')).toBe(true);
    expect(isEmptyGuess('   ')).toBe(true);
    expect(isEmptyGuess('!!!')).toBe(true);
    expect(isEmptyGuess('a')).toBe(false);
  });
});

describe('isCorrect', () => {
  it('matches regardless of case, punctuation, and apostrophes', () => {
    expect(isCorrect("DIJKSTRAS ALGORITHM!!", "Dijkstra's Algorithm")).toBe(true);
    expect(isCorrect('binary   search', 'Binary Search')).toBe(true);
    expect(isCorrect('hash map', 'Hash Table')).toBe(false);
    expect(isCorrect('', 'Binary Search')).toBe(false);
  });
});

describe('isValidTerm', () => {
  it('accepts any known term under symbol/case variation', () => {
    expect(isValidTerm("dijkstra's algorithm", TERMS)).toBe(true);
    expect(isValidTerm('DIJKSTRAS ALGORITHM!!', TERMS)).toBe(true);
    expect(isValidTerm('binary search', TERMS)).toBe(true);
  });

  it('rejects unknown text and empty input', () => {
    expect(isValidTerm('asdf', TERMS)).toBe(false);
    expect(isValidTerm('', TERMS)).toBe(false);
    expect(isValidTerm('   ', TERMS)).toBe(false);
  });
});
