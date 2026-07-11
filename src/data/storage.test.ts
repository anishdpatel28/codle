import { describe, it, expect, beforeEach } from 'vitest';
import { readStore, writeStore, STORAGE_VERSION } from './storage';

const KEY = 'codle:test';

describe('versioned storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips versioned data', () => {
    writeStore(KEY, { a: 1 });
    expect(readStore(KEY, null)).toEqual({ a: 1 });
    const raw = JSON.parse(localStorage.getItem(KEY) as string);
    expect(raw.v).toBe(STORAGE_VERSION);
  });

  it('returns the fallback and clears an old unversioned shape', () => {
    // Simulate stale data written before schema versioning existed.
    localStorage.setItem(KEY, JSON.stringify([{ old: true }]));
    expect(readStore(KEY, 'fallback')).toBe('fallback');
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('drops entries written under a different version', () => {
    localStorage.setItem(KEY, JSON.stringify({ v: STORAGE_VERSION - 1, data: { a: 1 } }));
    expect(readStore(KEY, 'fallback')).toBe('fallback');
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('returns the fallback for corrupt JSON without throwing', () => {
    localStorage.setItem(KEY, '{not json');
    expect(readStore(KEY, 42)).toBe(42);
  });
});
