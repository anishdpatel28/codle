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
  const out = resolve(tmpDir, rel.replace(/[\/.]/g, '_') + '.mjs');
  writeFileSync(out, rewrite(js));
  return pathToFileURL(out).href;
}

const termsUrl = emit('src/data/terms.ts');
const rotationUrl = emit('src/data/rotation.ts', (js) =>
  js.replace(/["']\.\/terms["']/, JSON.stringify(termsUrl)),
);
const { termForIndex } = await import(rotationUrl);

const EPOCH = Date.UTC(2026, 6, 1); // 2026-07-01, matches src/data/dailyTerm.ts
const DAY = 86400000;
const HORIZON_DAYS = 365;

const sqlStr = (s) => `'${String(s).replace(/'/g, "''")}'`;
const isoDate = (i) => new Date(EPOCH + i * DAY).toISOString().slice(0, 10);

const rows = Array.from({ length: HORIZON_DAYS }, (_, i) => {
  const t = termForIndex(i);
  const hints = `ARRAY[${t.hints.map(sqlStr).join(', ')}]::text[]`;
  return `  (${sqlStr(isoDate(i))}, ${sqlStr(t.term)}, ${hints}, ${sqlStr(t.definition)})`;
}).join(',\n');

const sql = `-- codle schema, row-level security, and seeded daily terms.
-- Run this in the Supabase SQL editor or via the CLI.

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
  completed_at   timestamptz not null default now()
);

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

insert into public.daily_terms (date, term, hints, definition) values
${rows}
on conflict (date) do nothing;
`;

const outDir = resolve(root, 'supabase/migrations');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, '0001_init.sql'), sql);
console.log(`Wrote supabase/migrations/0001_init.sql (${HORIZON_DAYS} days).`);
