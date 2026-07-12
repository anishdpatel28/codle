-- Reconcile databases created before `guesses` was added to `scores`.
--
-- The column was introduced by editing 0001_init.sql in place, so databases
-- that had already applied 0001 never gained the column and reject any select
-- that references it (PostgREST 400, "column scores.guesses does not exist").
-- This forward-only migration adds it idempotently; fresh databases already
-- have it from 0001 and are unaffected.

alter table public.scores
  add column if not exists guesses text[] not null default '{}';
