// Guards generated/committed SQL against the classic bug where a stray
// apostrophe closes a string literal early, so the rest of the statement is
// misparsed (e.g. "relation ... does not exist"). Scans for any string literal
// that is never properly terminated, handling single-quoted literals (with ''
// escaping), dollar-quoted literals ($tag$...$tag$), and -- line comments.

/** Returns a human-readable problem description, or null if every literal is closed. */
export function firstUnterminatedLiteral(sql: string): string | null {
  const n = sql.length;
  let i = 0;
  const lineAt = (pos: number) => sql.slice(0, pos).split('\n').length;

  while (i < n) {
    const c = sql[i];

    // Line comment: skip to end of line.
    if (c === '-' && sql[i + 1] === '-') {
      const nl = sql.indexOf('\n', i);
      i = nl === -1 ? n : nl + 1;
      continue;
    }

    // Dollar-quoted string: $tag$ ... $tag$ (tag may be empty).
    if (c === '$') {
      const match = /^\$[A-Za-z0-9_]*\$/.exec(sql.slice(i));
      if (match) {
        const tag = match[0];
        const end = sql.indexOf(tag, i + tag.length);
        if (end === -1) return `unterminated dollar-quoted string (${tag}) near line ${lineAt(i)}`;
        i = end + tag.length;
        continue;
      }
    }

    // Single-quoted string: '' is an escaped quote, a lone ' closes it.
    if (c === "'") {
      const start = i;
      i++;
      let closed = false;
      while (i < n) {
        if (sql[i] === "'" && sql[i + 1] === "'") {
          i += 2;
          continue;
        }
        if (sql[i] === "'") {
          i++;
          closed = true;
          break;
        }
        i++;
      }
      if (!closed) return `unterminated single-quoted string near line ${lineAt(start)}`;
      continue;
    }

    i++;
  }

  return null;
}

/** Throws if any string literal in `sql` is unterminated. */
export function assertBalancedSql(sql: string, label = 'SQL'): void {
  const problem = firstUnterminatedLiteral(sql);
  if (problem) throw new Error(`${label}: ${problem}`);
}
