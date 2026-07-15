import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ShareCommand } from './ShareCommand';
import { buildShare } from '../lib/share';

describe('buildShare', () => {
  it('includes an archive deep link built from the round date', () => {
    const text = buildShare({
      label: '2026-07-15',
      status: 'won',
      attemptsUsed: 3,
      solvedOnAttempt: 3,
      total: 6,
    });
    expect(text).toContain('https://playcodle.vercel.app/archive/2026-07-15');
  });

  it('shows the solving attempt as a keycap over the fixed total on a win', () => {
    const text = buildShare({
      label: '2026-07-15',
      status: 'won',
      attemptsUsed: 3,
      solvedOnAttempt: 3,
      total: 6,
    });
    expect(text).toContain('3️⃣/6️⃣ signal decoded');
    // No per-guess square grid, from either the emoji or box-character eras.
    expect(text).not.toMatch(/[🟨⬛■□]/u);
    expect(text).not.toContain('signal lost');
  });

  it('shows a cross and "signal lost" on a loss', () => {
    const text = buildShare({
      label: '2026-07-15',
      status: 'lost',
      attemptsUsed: 6,
      solvedOnAttempt: null,
      total: 6,
    });
    expect(text).toContain('❌/6️⃣ signal lost');
    expect(text).not.toContain('signal decoded');
  });
});

describe('ShareCommand', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('holds "copied" for the full window and resets it on repeat clicks', async () => {
    render(
      <ShareCommand label="2026-07-11" status="won" attemptsUsed={3} solvedOnAttempt={3} total={6} />,
    );
    const btn = screen.getByRole('button');
    expect(btn.textContent).toContain('share result');

    await act(async () => {
      fireEvent.click(btn);
    });
    expect(btn.textContent).toContain('copied to clipboard');

    act(() => vi.advanceTimersByTime(3000));
    expect(btn.textContent).toContain('copied to clipboard');

    // Click again before the window elapses — should copy again and restart it.
    await act(async () => {
      fireEvent.click(btn);
    });
    act(() => vi.advanceTimersByTime(3000));
    expect(btn.textContent).toContain('copied to clipboard');

    // Only after a full window from the last click does it revert.
    act(() => vi.advanceTimersByTime(2001));
    expect(btn.textContent).toContain('share result');
  });
});
