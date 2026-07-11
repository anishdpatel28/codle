# Supabase & Vercel setup

Everything below is done in web dashboards — no secrets ever land in the repo.

## 1. Create the Supabase project

1. Go to <https://supabase.com/dashboard> and **New project**.
2. Pick a name, a strong database password, and a region near your users.
3. Wait for provisioning to finish.

## 2. Run the database migration

1. In the project, open **SQL Editor → New query**.
2. Paste the entire contents of
   [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).
3. **Run** it. This creates the `daily_terms` and `scores` tables, enables
   row-level security, and seeds a daily term for each date over the next year
   from `2026-07-01`.
4. Verify: **Table Editor** should show `daily_terms` populated and an empty
   `scores` table.

> To add more terms or extend the horizon, edit `src/data/terms.ts` (or the
> `HORIZON_DAYS` value in `scripts/gen-seed.mjs`), run `npm run gen:seed`, and
> re-run the migration. It uses `on conflict (date) do nothing`, so existing
> rows are untouched.

## 3. Enable Google OAuth

1. Create a Google OAuth client: <https://console.cloud.google.com/apis/credentials>
   → **Create credentials → OAuth client ID → Web application**.
2. Under **Authorized redirect URIs**, add your Supabase callback:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
   (find it in Supabase under **Authentication → Providers → Google**).
3. Copy the generated **Client ID** and **Client secret**.
4. In Supabase: **Authentication → Providers → Google** → enable it, paste the
   Client ID and secret, **Save**.
5. In **Authentication → URL Configuration**, set the **Site URL** to your
   deployed origin (e.g. `https://codle.vercel.app`) and add
   `http://localhost:5173` to **Redirect URLs** for local development.

## 4. Get your API credentials

**Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

For local dev, put these in `.env.local` (copy from `.env.example`).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and **import** the repository.
3. Vercel auto-detects Vite. Confirm:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Under **Environment Variables**, add both for Production (and Preview):

   | Name                     | Value                          |
   | ------------------------ | ------------------------------ |
   | `VITE_SUPABASE_URL`      | your Supabase project URL      |
   | `VITE_SUPABASE_ANON_KEY` | your Supabase anon/public key  |

5. **Deploy.**
6. Copy the production URL and set it as the Supabase **Site URL** (step 3.5) so
   OAuth redirects resolve. Add the Vercel preview domain to **Redirect URLs**
   too if you want auth on preview deploys.

## Notes

- The anon key is safe to expose in a browser build; row-level security is what
  protects data. Never expose the **service_role** key.
- Client-side routing: this is a SPA. Vercel serves `index.html` for unknown
  paths by default for Vite projects, so deep links like `/archive` work.
