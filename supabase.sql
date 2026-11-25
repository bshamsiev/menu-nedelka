create table if not exists public.family_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.family_state enable row level security;
grant select, insert, update on public.family_state to anon;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'family_state' and policyname = 'family read') then
    create policy "family read" on public.family_state for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'family_state' and policyname = 'family insert') then
    create policy "family insert" on public.family_state for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'family_state' and policyname = 'family update') then
    create policy "family update" on public.family_state for update to anon using (true) with check (true);
  end if;
end $$;
