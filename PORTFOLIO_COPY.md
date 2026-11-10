# Portfolio copy — Flowstate

## Project card

**Flowstate — SaaS Kanban workspace**

A responsive project workspace that helps small product teams plan, prioritize and ship work without unnecessary complexity.

**Next.js · TypeScript · Tailwind CSS · Supabase · Vitest**

## Short portfolio description

Flowstate is a complete frontend product slice built around a three-stage Kanban workflow. I implemented typed domain logic, CRUD interactions, search and filters, optimistic updates with rollback, responsive and accessible UI, zero-setup demo persistence and an optional Supabase backend protected by Row Level Security.

## What I owned

- Product scope and interaction design
- Responsive component architecture
- Typed task domain and state transitions
- Demo and Supabase repository implementations
- Error, loading, empty and destructive states
- Unit and component testing
- Technical documentation and product case study

## Strong interview walkthrough

1. Start with the product problem, not the stack.
2. Create a task and explain why this is the core vertical slice.
3. Move it without drag and drop to demonstrate accessible alternatives.
4. Open the repository boundary and explain demo mode versus Supabase.
5. Show optimistic rollback and discuss what happens when persistence fails.
6. Open the reducer tests and explain why pure rules are tested first.
7. End with one trade-off: native drag and drop is lightweight, but touch reordering is the next production improvement.

## One-minute interview pitch

“I built Flowstate to show more than a polished dashboard. I wanted one workflow that was complete from UI to persistence. The board supports the full task lifecycle, optimistic updates and recovery from failed saves. I separated persistence behind a repository, so the same components work immediately with local demo data or with Supabase and Row Level Security. I also tested the domain rules separately from the UI because those tests are faster and less fragile. The main trade-off was keeping native drag and drop for a small bundle while preserving a status selector for keyboard and mobile users.”

## Suggested repository topics

`nextjs` · `typescript` · `tailwindcss` · `supabase` · `kanban` · `vitest` · `frontend-portfolio` · `saas`

