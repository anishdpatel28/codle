import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transformSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const tmpDir = resolve(root, 'scripts/.tmp');
mkdirSync(tmpDir, { recursive: true });

// Transpile a TS module to ESM in the tmp dir and return its file URL.
function emit(rel, rewrite = (s) => s) {
  const ts = readFileSync(resolve(root, rel), 'utf8');
  const js = transformSync(ts, { loader: 'ts', format: 'esm' }).code;
  const out = resolve(tmpDir, rel.replace(/[/.]/g, '_') + '.mjs');
  writeFileSync(out, rewrite(js));
  return pathToFileURL(out).href;
}

const termsUrl = emit('src/data/terms.ts');
const rotationUrl = emit('src/data/rotation.ts', (js) =>
  js.replace(/["']\.\/terms["']/, JSON.stringify(termsUrl)),
);
const { termForIndex } = await import(rotationUrl);
const { assertBalancedSql } = await import(emit('src/data/sqlLint.ts'));

const EPOCH = Date.UTC(2026, 6, 1); // 2026-07-01, matches src/data/dailyTerm.ts
const DAY = 86400000;
const HORIZON_DAYS = 365;

// Dollar-quote every text field ($codle$...$codle$) so apostrophes of any kind —
// straight or curly — can never terminate a literal early, even if a copy-paste
// or editor rewrites the quote characters. The tag must not occur in content.
const DOLLAR_TAG = '$codle$';
function lit(value) {
  const str = String(value);
  if (str.includes(DOLLAR_TAG)) {
    throw new Error(`Text field contains the dollar-quote tag ${DOLLAR_TAG}: ${JSON.stringify(str)}`);
  }
  return `${DOLLAR_TAG}${str}${DOLLAR_TAG}`;
}
// Dates are machine-generated ISO strings with no quotes, so a plain literal is safe.
const dateLit = (d) => `'${d}'`;
const isoDate = (i) => new Date(EPOCH + i * DAY).toISOString().slice(0, 10);

const rows = Array.from({ length: HORIZON_DAYS }, (_, i) => {
  const t = termForIndex(i);
  const hints = `ARRAY[${t.hints.map(lit).join(', ')}]::text[]`;
  return `  (${dateLit(isoDate(i))}, ${lit(t.term)}, ${hints}, ${lit(t.definition)})`;
}).join(',\n');

const insertBlock = `insert into public.daily_terms (date, term, hints, definition) values\n${rows}`;

const initSql = `-- codle schema, row-level security, and seeded daily terms.
-- Run this in the Supabase SQL editor or via the CLI.
-- Text fields are dollar-quoted ($codle$...$codle$) so apostrophes cannot break parsing.

create table if not exists public.daily_terms (
  id          uuid primary key default gen_random_uuid(),
  date        date unique not null,
  term        text not null,
  hints       text[] not null,
  definition  text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.scores (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  daily_term_id  uuid not null references public.daily_terms (id) on delete cascade,
  attempts_used  int not null check (attempts_used between 1 and 6),
  solved         boolean not null default false,
  is_practice    boolean not null default false,
  guesses        text[] not null default '{}',
  completed_at   timestamptz not null default now()
);

-- Add guesses to an already-existing scores table.
alter table public.scores add column if not exists guesses text[] not null default '{}';

-- One daily score per user per term; practice rows are unlimited.
create unique index if not exists scores_user_daily_unique
  on public.scores (user_id, daily_term_id)
  where is_practice = false;

create index if not exists scores_user_idx on public.scores (user_id);

alter table public.daily_terms enable row level security;
alter table public.scores enable row level security;

-- Daily terms are public content.
drop policy if exists "daily_terms readable by all" on public.daily_terms;
create policy "daily_terms readable by all"
  on public.daily_terms for select
  using (true);

-- Scores are private to their owner.
drop policy if exists "scores selectable by owner" on public.scores;
create policy "scores selectable by owner"
  on public.scores for select
  using (auth.uid() = user_id);

drop policy if exists "scores insertable by owner" on public.scores;
create policy "scores insertable by owner"
  on public.scores for insert
  with check (auth.uid() = user_id);

drop policy if exists "scores updatable by owner" on public.scores;
create policy "scores updatable by owner"
  on public.scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

${insertBlock}
on conflict (date) do nothing;
`;

const reseedSql = `-- Re-seed public.daily_terms from the current term bank.
--
-- 0001_init.sql seeds with ON CONFLICT DO NOTHING, so re-running it never
-- changes dates that already exist. This migration upserts instead: it updates
-- the term, hints, and definition for each date in place, keeping each row and
-- its id (so any scores that reference it stay valid). Safe to run repeatedly.
--
-- All text fields are dollar-quoted ($codle$...$codle$) so apostrophes of any
-- kind (straight or curly) can never terminate a literal early.

${insertBlock}
on conflict (date) do update set
  term       = excluded.term,
  hints      = excluded.hints,
  definition = excluded.definition;
`;

// Lint before writing: refuse to emit SQL with an unterminated string literal.
assertBalancedSql(initSql, '0001_init.sql');
assertBalancedSql(reseedSql, '0004_reseed_daily_terms.sql');

const outDir = resolve(root, 'supabase/migrations');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, '0001_init.sql'), initSql);
writeFileSync(resolve(outDir, '0004_reseed_daily_terms.sql'), reseedSql);
console.log(`Wrote 0001_init.sql and 0004_reseed_daily_terms.sql (${HORIZON_DAYS} days).`);
