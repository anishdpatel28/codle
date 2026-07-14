import { describe, it, expect } from 'vitest';
import { termBank } from './terms';
import { rotation, termForIndex } from './rotation';

const HINTS_PER_TERM = 6;

describe('term bank', () => {
  it('is large enough for a long, non-repetitive rotation', () => {
    // Guards against an edit accidentally truncating the bank.
    expect(termBank.length).toBeGreaterThanOrEqual(200);
  });

  it('gives every term exactly six hints and a definition', () => {
    for (const t of termBank) {
      expect(t.hints, `${t.id} hints`).toHaveLength(HINTS_PER_TERM);
      for (const [i, hint] of t.hints.entries()) {
        expect(typeof hint, `${t.id} hint ${i + 1}`).toBe('string');
        expect(hint.trim(), `${t.id} hint ${i + 1} is non-empty`).not.toBe('');
      }
      expect(typeof t.definition, `${t.id} definition`).toBe('string');
      expect(t.definition.trim(), `${t.id} definition is non-empty`).not.toBe('');
      expect(t.term.trim(), `${t.id} term is non-empty`).not.toBe('');
    }
  });

  it('uses unique kebab-case ids and unique display terms', () => {
    const ids = termBank.map((t) => t.id);
    const terms = termBank.map((t) => t.term);
    expect(new Set(ids).size, 'unique ids').toBe(ids.length);
    expect(new Set(terms).size, 'unique terms').toBe(terms.length);
    for (const id of ids) {
      expect(id, `${id} is kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('never spells its own term inside a hint', () => {
    for (const t of termBank) {
      const needle = new RegExp(
        `\\b${t.term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      );
      for (const [i, hint] of t.hints.entries()) {
        expect(needle.test(hint.toLowerCase()), `${t.id} hint ${i + 1} names the term`).toBe(
          false,
        );
      }
    }
  });
});

describe('daily rotation', () => {
  it('is a permutation covering every term exactly once', () => {
    expect(rotation).toHaveLength(termBank.length);
    expect(new Set(rotation.map((t) => t.id)).size).toBe(termBank.length);
  });

  it('cycles deterministically and wraps in both directions', () => {
    const len = termBank.length;
    expect(termForIndex(0).id).toBe(termForIndex(len).id);
    expect(termForIndex(1).id).toBe(termForIndex(len + 1).id);
    expect(termForIndex(-1).id).toBe(termForIndex(len - 1).id);
  });

  it('yields all distinct terms across one full cycle', () => {
    const len = termBank.length;
    const seen = new Set(Array.from({ length: len }, (_, i) => termForIndex(i).id));
    expect(seen.size).toBe(len);
  });
});
