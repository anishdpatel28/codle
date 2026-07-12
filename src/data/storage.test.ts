import { describe, it, expect, beforeEach } from 'vitest';
import { readStore, writeStore, STORAGE_VERSION } from './storage';

const LOCAL_TEST_KEY = 'codle:test';

describe('versioned storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips versioned data', () => {
    writeStore(LOCAL_TEST_KEY, { a: 1 });
    expect(readStore(LOCAL_TEST_KEY, null)).toEqual({ a: 1 });
    const raw = JSON.parse(localStorage.getItem(LOCAL_TEST_KEY) as string);
    expect(raw.v).toBe(STORAGE_VERSION);
  });

  it('returns the fallback and clears an old unversioned shape', () => {
    // Simulate stale data written before schema versioning existed.
    localStorage.setItem(LOCAL_TEST_KEY, JSON.stringify([{ old: true }]));
    expect(readStore(LOCAL_TEST_KEY, 'fallback')).toBe('fallback');
    expect(localStorage.getItem(LOCAL_TEST_KEY)).toBeNull();
  });

  it('drops entries written under a different version', () => {
    localStorage.setItem(LOCAL_TEST_KEY, JSON.stringify({ v: STORAGE_VERSION - 1, data: { a: 1 } }));
    expect(readStore(LOCAL_TEST_KEY, 'fallback')).toBe('fallback');
    expect(localStorage.getItem(LOCAL_TEST_KEY)).toBeNull();
  });

  it('returns the fallback for corrupt JSON without throwing', () => {
    localStorage.setItem(LOCAL_TEST_KEY, '{not json');
    expect(readStore(LOCAL_TEST_KEY, 42)).toBe(42);
  });
});
