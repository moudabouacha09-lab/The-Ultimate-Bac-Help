-- Public contributor directory fields. Email addresses remain private because
-- the page only selects display columns.
alter table if exists public.profiles
  add column if not exists title text;

drop policy if exists "Anyone can view contributor profiles" on public.profiles;
create policy "Anyone can view contributor profiles"
  on public.profiles for select
  using (role in ('teacher', 'admin'));
