import { termBank, type SeedTerm } from './terms';

// Deterministic PRNG so the rotation order is fixed across runs and processes.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list: SeedTerm[], seed: number): SeedTerm[] {
  const out = list.slice();
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ROTATION_SEED = 0x5eed1e;

// The term bank in a fixed shuffled order. A calendar date maps to an index into
// this list modulo its length, so the rotation cycles forever with one term per
// cycle and no adjacent repeats.
export const rotation: SeedTerm[] = shuffle(termBank, ROTATION_SEED);

export function termForIndex(index: number): SeedTerm {
  const len = rotation.length;
  return rotation[((index % len) + len) % len];
}
