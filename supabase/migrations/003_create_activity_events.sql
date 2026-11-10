create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  task_id text not null,
  task_title text not null,
  action text not null check (action in ('created', 'updated', 'moved', 'deleted')),
  created_at timestamptz not null default now(),
  foreign key (user_id, project_id) references public.projects(user_id, id) on delete cascade
);

create index if not exists activity_events_user_project_created_idx
on public.activity_events (user_id, project_id, created_at desc);

alter table public.activity_events enable row level security;

create policy "Users can read their own activity" on public.activity_events
for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create their own activity" on public.activity_events
for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert on public.activity_events to authenticated;
