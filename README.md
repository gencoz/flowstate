# Flowstate

[Live demo](https://flowstate-one-kappa.vercel.app/) · [Source code](https://github.com/gencoz/flowstate) · [![CI](https://github.com/gencoz/flowstate/actions/workflows/ci.yml/badge.svg)](https://github.com/gencoz/flowstate/actions/workflows/ci.yml)

Flowstate is a focused Kanban workspace for SaaS product teams. It is a frontend portfolio project built as a complete product slice: typed domain logic, responsive UI, CRUD, optimistic updates, persistence, error recovery, automated tests and a Supabase backend protected by Row Level Security.

## Live project

- **Try the product:** [flowstate-one-kappa.vercel.app](https://flowstate-one-kappa.vercel.app/)
- **Review the code:** [github.com/gencoz/flowstate](https://github.com/gencoz/flowstate)
- **Production data:** Supabase with anonymous authentication and per-user RLS policies
- **Delivery:** Vercel deploys the production branch; GitHub Actions validates every push and pull request

The live demo creates a temporary authenticated user in the browser. Tasks persist across reloads for that browser session and remain isolated from other visitors.

## Why this project exists

Junior portfolios often show isolated screens. Flowstate demonstrates the decisions behind a real workflow: how data moves through the interface, what happens when persistence fails, how the same UI supports demo and production data, and how critical behavior is tested.

Read the [implementation roadmap](./ROADMAP.md), the recruiter-facing [product case study](./CASE_STUDY.md), the ready-to-use [portfolio copy](./PORTFOLIO_COPY.md), the concise [deployment runbook](./DEPLOYMENT.md) and the beginner-friendly [step-by-step publishing guide](./JUNIOR_DEPLOYMENT_GUIDE.md).

## Product capabilities

- Three-column Kanban board with desktop drag and drop
- Accessible status selector as a non-drag alternative
- Create, edit and delete task workflow
- Search across title, description, task ID and tags
- Priority and tag filters with clear/reset behavior
- Project metrics for total, active and completed work
- Optimistic updates with rollback and visible error feedback
- Responsive navigation and mobile board layout
- Zero-setup demo persistence in `localStorage`
- Optional Supabase persistence with anonymous auth and Row Level Security
- Reducer, filter and task-form tests

## Architecture

```text
app/                     Next.js routes, metadata and global styles
components/              Product UI and interaction boundaries
hooks/use-task-board.ts  Orchestrates state and persistence
lib/tasks/               Pure rules and repository implementations
lib/supabase/            Supabase client creation
supabase/migrations/     Database schema and RLS policies
```

The UI depends on a small `TaskRepository` contract:

```text
TaskDialog / Board
        ↓
useTaskBoard (optimistic state + rollback)
        ↓
TaskRepository
   ↙             ↘
localStorage     Supabase + RLS
```

This keeps demo setup frictionless and prevents backend-specific logic from leaking into components.

## Run locally

Requirements: Node.js 24 and npm 11. The exact versions are declared in `.nvmrc`, `package.json` and `package-lock.json` so local development and CI use the same toolchain.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Windows note

If installation stops at `reify moves`, place the project in a short path outside protected folders such as Documents or OneDrive, then verify `npm --version` is 11 or newer.

```powershell
mkdir "$HOME\dev" -ErrorAction SilentlyContinue
Copy-Item flowstate "$HOME\dev\flowstate" -Recurse
cd "$HOME\dev\flowstate"
npm install
```

## Quality commands

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
```

The portfolio-ready quality gate is: lint passes, all tests pass and the production build completes. GitHub Actions repeats this gate on every push and pull request.

Current verified results:

| Check | Result |
| --- | --- |
| ESLint | Passes with zero errors and zero warnings |
| Automated tests | 7/7 passing |
| Statement coverage | 94.11% |
| Function coverage | 100% |
| Production build | Next.js build completed successfully |

The project currently stays on ESLint 9 because the lint plugins bundled with Next.js 16 declare compatibility with ESLint 9. Upgrade to ESLint 10 when that peer dependency range is officially supported.

## Data modes

### Demo mode

Demo mode is the default and needs no account or environment variables. Tasks are stored in the browser and can be restored with **Reset demo**.

```env
NEXT_PUBLIC_DATA_MODE=demo
```

### Supabase mode

1. Create a Supabase project.
2. Run `supabase/migrations/001_create_tasks.sql` in the SQL editor or with the Supabase CLI.
3. Enable Anonymous Sign-Ins in the project authentication settings.
4. Copy `.env.example` to `.env.local`.
5. Set the following values:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Anonymous visitors receive an authenticated Supabase session. RLS policies restrict every task query to `auth.uid() = user_id`. For a public deployment, also enable CAPTCHA/Turnstile and plan cleanup of abandoned anonymous users as described in the [Supabase anonymous auth guide](https://supabase.com/docs/guides/auth/auth-anonymous).

## Testing strategy

- **Reducer tests** verify add, update and delete transitions without rendering React.
- **Filter tests** verify search and combined filters as pure functions.
- **Component test** completes the creation form through accessible labels and buttons.

Pure logic is tested first because it is fast and stable. UI tests are reserved for behavior the user directly experiences.

## Key trade-offs

- Native drag and drop avoids a large dependency; touch-first reordering is a future enhancement.
- Free-form due dates keep the MVP quick; a production version would store ISO dates and localize presentation.
- Anonymous authentication makes the demo immediate; a team product would add durable accounts, invitations and roles.

## Portfolio presentation checklist

- [x] Deploy the demo and add its URL near the title.
- [x] Link the public repository and live product.
- [x] Publish an automated CI quality gate.
- Add one desktop and one mobile screenshot.
- Link the repository and live demo from the portfolio project card.
- Use `CASE_STUDY.md` as the basis for the project page and interview walkthrough.
- Explain one trade-off and one failure state during the demo, not only the happy path.
