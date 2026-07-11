# codle

A daily decode-the-signal game. Each day there's one computer-science concept —
a data structure, an algorithm, or a core idea — hidden behind a stack of hints
ordered from cryptic to obvious. You get **six attempts**. Guess the term, or
submit an empty line to trade an attempt for the next hint. Solve it in as few
attempts as you can, keep a streak going, and replay past signals in practice
mode.

It reads like watching a transmission get decrypted line by line — a terminal
log, not a letter grid.

## Screenshot

_Screenshot to be added once the final UI ships._

## How it plays

- **6 attempts per round.** The first hint is shown immediately.
- **A wrong guess** costs one attempt and decrypts the next hint. Feedback is
  binary — right or wrong, never letter-by-letter.
- **An empty guess** is an explicit "skip for a hint": same cost as a wrong
  guess, deliberately trading an attempt for information.
- **Solve it** and the full definition plus your attempt count are revealed.
- **Run out** and the answer is revealed with a fail state.
- **Daily** is deterministic per calendar date. **Practice** pulls a random past
  signal and never affects your streak.

## Tech stack

- Vite + React + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) — Google OAuth via Supabase's hosted flow
- Deployed on Vercel

## Local setup

Requires Node 20+.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional for a first run — see below)
cp .env.example .env.local
#   then fill in your Supabase project's URL and anon key

# 3. Start the dev server
npm run dev
```

The app runs **without Supabase configured** in a local fallback mode: the daily
game, archive, and practice all work against a built-in term rotation, with
scores kept in `localStorage`. Sign-in and cross-device persistence require
Supabase (below).

### Environment variables

Set these in `.env.local` (gitignored) for local dev, and in your Vercel project
for deploys. See `.env.example`.

| Variable                 | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL (Project Settings → API)           |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (Project Settings → API)       |

Never commit real keys. Only `.env.example` (placeholders) is tracked.

### Scripts

| Script              | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                                |
| `npm run build`     | Type-check and build for production                      |
| `npm run preview`   | Preview the production build locally                     |
| `npm run lint`      | ESLint                                                   |
| `npm run typecheck` | TypeScript, no emit                                      |
| `npm run gen:seed`  | Regenerate `supabase/migrations/0001_init.sql` seed data |

## Supabase setup

The database schema (tables, row-level security, and a seed of daily terms)
lives in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
Run it in the Supabase SQL editor, then enable the Google auth provider. The
full click-by-click steps are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Continuous integration

GitHub Actions runs lint, type-check, and build on every push and pull request to
`main` — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Deployment

Deployed on Vercel as a static Vite build. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
for the Supabase and Vercel setup, including the required environment variables.

## Project structure

```
src/
  components/  UI only — the terminal log, sidebar, chrome
  game/        guess validation + the attempt/hint state machine
  data/        term bank, seeded date logic, Supabase queries
  hooks/       auth, data loading, the decrypt-reveal animation
  lib/         Supabase client
  pages/       route-level views (daily, archive, practice)
  styles/      design tokens + global CSS
supabase/
  migrations/  Postgres schema, RLS, and seed
```
