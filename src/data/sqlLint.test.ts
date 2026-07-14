import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { firstUnterminatedLiteral } from './sqlLint';

describe('sqlLint', () => {
  it('flags an unescaped single quote that closes a literal early', () => {
    // The apostrophe in "it's" closes the literal, misparsing the rest.
    expect(firstUnterminatedLiteral("insert into t values ('it's broken');")).not.toBeNull();
  });

  it('accepts a properly escaped single quote', () => {
    expect(firstUnterminatedLiteral("select 'it''s fine';")).toBeNull();
  });

  it('accepts dollar-quoted text containing straight and curly apostrophes', () => {
    expect(firstUnterminatedLiteral('select $codle$it\'s and it’s$codle$;')).toBeNull();
  });

  it('ignores apostrophes inside line comments', () => {
    expect(firstUnterminatedLiteral("-- keeping each row's id\nselect 1;")).toBeNull();
  });

  it('flags an unterminated dollar-quoted string', () => {
    expect(firstUnterminatedLiteral('select $codle$oops;')).not.toBeNull();
  });
});

describe('committed migrations', () => {
  const dir = resolve(process.cwd(), 'supabase/migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql'));

  it('has migration files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s has no unterminated string literals', (file) => {
    const sql = readFileSync(resolve(dir, file), 'utf8');
    expect(firstUnterminatedLiteral(sql)).toBeNull();
  });
});
