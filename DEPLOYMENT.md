# Flowstate deployment runbook

This runbook keeps deployment repeatable and separates code changes from account-specific actions.

## 1. Local preflight

Use Node 24 and npm 11, then run:

```bash
npm ci
npm run lint
npm run test:coverage
npm run build
```

Do not deploy if any command fails.

## 2. Create the Supabase project

1. Create a new Supabase project.
2. In Authentication settings, enable Anonymous Sign-Ins.
3. For a public demo, enable CAPTCHA or Turnstile to limit anonymous-user abuse.
4. Copy the project URL and publishable/anon key. Never use the service-role key in the browser.

## 3. Apply the database migration

Install or run the current Supabase CLI, authenticate and link the repository:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref YOUR_PROJECT_REF
```

Review the pending remote change first:

```bash
npx supabase@latest db push --remote --dry-run
```

Only after checking the target project and SQL plan, apply it:

```bash
npx supabase@latest db push --remote
```

The migration creates the `tasks` table, enables RLS and restricts every operation to the authenticated owner.

## 4. Verify Supabase mode locally

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
```

Run `npm run dev`, create a task, reload and confirm that it remains. In Supabase, verify that the row has the anonymous user's `user_id`.

## 5. Publish the Git repository

Create a repository named `flowstate`, add it as `origin` and push the `main` branch. Keep `.env.local` untracked.

The included GitHub Actions workflow runs install, lint, coverage and production build on pushes and pull requests.

## 6. Deploy on Vercel

Import the Git repository into Vercel. Next.js should be detected automatically. Add the three public environment variables from step 4 to Production and Preview.

Deploy the `main` branch. Git integration will then create previews for branches and production deployments for changes merged into `main`.

## 7. Production verification

- Open the production URL in a private browser window.
- Create, edit, move and delete a task.
- Reload and confirm persistence.
- Test a narrow mobile viewport and keyboard-only navigation.
- Check the browser console for errors.
- Run Lighthouse and record accessibility, performance and best-practice results.
- Add the live URL and final screenshots to `README.md`, `CASE_STUDY.md` and your portfolio.

## Rollback

- Frontend: promote the previous successful Vercel deployment or revert the Git commit.
- Database: create a new forward migration that reverses the schema change; do not edit an already-applied migration.
