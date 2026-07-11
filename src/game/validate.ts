// Guess matching, forgiving about case, punctuation, and whitespace.

/** Lowercase, drop apostrophes, turn other punctuation into spaces, collapse. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    // Delete apostrophes so possessives collapse ("Dijkstra's" -> "dijkstras").
    .replace(/['’`‘]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function isEmptyGuess(value: string): boolean {
  return normalize(value) === '';
}

/** True when the guess matches the term after normalization. */
export function isCorrect(guess: string, term: string): boolean {
  const g = normalize(guess);
  return g !== '' && g === normalize(term);
}
