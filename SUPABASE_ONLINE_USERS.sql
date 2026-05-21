create table if not exists public.online_users (
  user_id uuid primary key,
  name text,
  last_seen timestamptz default now()
);

alter table public.online_users enable row level security;

create policy "authenticated users can upsert online presence"
on public.online_users
for all
to authenticated
using (true)
with check (true);
