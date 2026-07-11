// Versioned localStorage access. Every entry is wrapped as { v, data }. On read,
// a missing/mismatched version means the stored shape predates a schema change,
// so that entry is dropped and the caller gets its fallback — this keeps stale
// dev/test data from crashing the app or rendering a blank page.
//
// Bump STORAGE_VERSION whenever the persisted shape changes incompatibly.

export const STORAGE_VERSION = 2;

interface Envelope<T> {
  v: number;
  data: T;
}

export function readStore<T>(key: string, fallback: T): T {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return fallback;
  }
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Partial<Envelope<T>>;
    if (!parsed || typeof parsed !== 'object' || parsed.v !== STORAGE_VERSION) {
      // Unknown/old shape — discard just this entry.
      localStorage.removeItem(key);
      return fallback;
    }
    return parsed.data as T;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return fallback;
  }
}

export function writeStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ v: STORAGE_VERSION, data }));
  } catch {
    // storage unavailable — nothing persists, which is acceptable
  }
}
