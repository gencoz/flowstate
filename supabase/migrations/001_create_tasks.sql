create table if not exists public.tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  title text not null check (char_length(title) between 1 and 140),
  description text not null default '',
  status text not null check (status in ('backlog', 'in-progress', 'done')),
  priority text not null check (priority in ('low', 'medium', 'high')),
  tags text[] not null default '{}',
  due_date text not null default 'No date',
  assignees jsonb not null default '[]'::jsonb,
  comments integer not null default 0 check (comments >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.tasks enable row level security;

drop policy if exists "Users can read their own tasks" on public.tasks;
create policy "Users can read their own tasks" on public.tasks
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own tasks" on public.tasks;
create policy "Users can create their own tasks" on public.tasks
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks" on public.tasks
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks" on public.tasks
for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.tasks to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks
for each row execute function public.set_updated_at();
