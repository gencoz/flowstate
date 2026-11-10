# Flowstate — product case study

## The problem

Small product teams often lose momentum when task tools become heavier than the work itself. Flowstate explores a focused alternative: one project, three clear states and enough context to make the next decision quickly.

## My role

I designed and built the frontend product slice as a junior frontend portfolio project. The goal was not to imitate a large project-management suite, but to demonstrate a complete, defensible workflow with production-minded decisions.

## Core user journey

1. Scan project health through three metrics.
2. Search or filter the board to reduce noise.
3. Create a focused task with priority, tags and a due date.
4. Move it through Backlog, In progress and Done.
5. Edit or delete it from the task detail dialog.

## Key decisions

### A complete vertical slice over feature breadth

CRUD, persistence, errors and responsive behavior are implemented for tasks before adding secondary screens. This makes the main journey demonstrable end to end.

### Repository boundary

The components depend on a `TaskRepository` contract rather than `localStorage` or Supabase directly. Demo mode works with zero setup; Supabase can be enabled without rewriting UI components.

### Optimistic updates with rollback

The board updates immediately. If persistence fails, the previous task list is restored and the user sees an actionable error message. This keeps the interface responsive without hiding failures.

### Anonymous Supabase sessions

Anonymous auth gives every visitor an isolated workspace. Row Level Security ties every operation to `auth.uid()`, avoiding an unsafe public table while keeping the portfolio demo frictionless.

### Test the rules first

Reducer and filtering tests cover the highest-value behavior with low maintenance cost. A focused component test covers the task creation form from the user's perspective.

## Accessibility and UX details

- Every icon-only control has an accessible name.
- The task dialog exposes dialog semantics, initial focus and Escape handling.
- Task status can be changed without drag and drop.
- Destructive actions require explicit confirmation.
- Loading, error and empty states remain visible and understandable.
- Motion respects the operating system's reduced-motion preference.

## Trade-offs

- Native HTML drag and drop keeps dependencies low, but a production version would add richer touch reordering.
- Due dates are free-form for a faster MVP; a later version would store ISO dates and localize display.
- Anonymous authentication is ideal for a demo; a team product would add account recovery, invitations and roles.

## What I would measure next

- Time from opening the board to creating the first task.
- Percentage of created tasks moved to Done.
- Search and filter usage before task updates.
- Failed persistence operations and recovery rate.

## Next iteration

Add multi-project routing, team invitations, activity history and an accessible touch-first drag-and-drop library only after validating the core workflow.
