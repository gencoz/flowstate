create table if not exists public.projects (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '',
  color text not null default 'violet' check (color in ('violet', 'amber', 'sky', 'emerald')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

insert into public.projects (user_id, id, name, description, color)
select distinct user_id, 'flowstate-launch', 'Flowstate launch', 'Build and ship the portfolio-ready product.', 'violet'
from public.tasks
on conflict (user_id, id) do nothing;

alter table public.tasks add column if not exists project_id text;
update public.tasks set project_id = 'flowstate-launch' where project_id is null;
alter table public.tasks alter column project_id set default 'flowstate-launch';
alter table public.tasks alter column project_id set not null;

alter table public.tasks drop constraint if exists tasks_project_fkey;
alter table public.tasks add constraint tasks_project_fkey
foreign key (user_id, project_id) references public.projects(user_id, id) on delete cascade;

alter table public.projects enable row level security;

create policy "Users can read their own projects" on public.projects
for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create their own projects" on public.projects
for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can update their own projects" on public.projects
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own projects" on public.projects
for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.projects to authenticated;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
