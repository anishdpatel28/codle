-- Remove streak from the schema. Streak was a derived UI value, not stored
-- state, but this drops any streak column defensively in case an earlier schema
-- persisted it. Safe to run repeatedly.

alter table public.scores      drop column if exists streak;
alter table public.scores      drop column if exists current_streak;
alter table public.daily_terms drop column if exists streak;
