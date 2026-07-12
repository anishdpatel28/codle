import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { usePractice } from './usePractice';
import type { DailyTerm } from '../data/types';

const getRandomPastTerm = vi.fn();
const getDailyTerm = vi.fn();

vi.mock('../data/queries', () => ({
  getRandomPastTerm: () => getRandomPastTerm(),
  getDailyTerm: (date: string) => getDailyTerm(date),
}));

function term(id: string): DailyTerm {
  return { id, date: '2026-01-01', term: id, hints: [], definition: '' };
}

describe('usePractice', () => {
  beforeEach(() => {
    cleanup();
    getRandomPastTerm.mockReset();
    getDailyTerm.mockReset();
  });

  it('pulls a fresh random term whenever the seed changes', async () => {
    getRandomPastTerm.mockResolvedValueOnce(term('first')).mockResolvedValueOnce(term('second'));

    const { result, rerender } = renderHook(({ seed }) => usePractice(undefined, seed), {
      initialProps: { seed: 'a' },
    });

    await waitFor(() => expect(result.current.term?.id).toBe('first'));

    // A new seed (as a navigation would supply) re-pulls a new round.
    rerender({ seed: 'b' });
    await waitFor(() => expect(result.current.term?.id).toBe('second'));
    expect(getRandomPastTerm).toHaveBeenCalledTimes(2);
  });

  it('loads the given date without rerolling for a dated replay', async () => {
    getDailyTerm.mockResolvedValue(term('dated'));

    const { result } = renderHook(() => usePractice('2026-07-11', 'seed-1'));

    await waitFor(() => expect(result.current.term?.id).toBe('dated'));
    expect(getDailyTerm).toHaveBeenCalledWith('2026-07-11');
    expect(getRandomPastTerm).not.toHaveBeenCalled();
  });
});
