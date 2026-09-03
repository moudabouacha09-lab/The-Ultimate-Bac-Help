-- Metadata table used by /contribute/upload-lesson, the admin dashboard,
-- and subject pages.
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject_slug text not null,
  units text[],
  file_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists lessons_subject_status_created_idx
  on public.lessons (subject_slug, status, created_at desc);

alter table public.lessons enable row level security;

drop policy if exists "Anyone can view approved lessons" on public.lessons;
create policy "Anyone can view approved lessons"
  on public.lessons for select
  using (
    status = 'approved'
    or auth.uid() = created_by
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Teachers can submit lessons" on public.lessons;
create policy "Teachers can submit lessons"
  on public.lessons for insert to authenticated
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('teacher', 'admin')
    )
  );

drop policy if exists "Owners and admins can update lessons" on public.lessons;
create policy "Owners and admins can update lessons"
  on public.lessons for update to authenticated
  using (
    auth.uid() = created_by
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    auth.uid() = created_by
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete lessons" on public.lessons;
create policy "Admins can delete lessons"
  on public.lessons for delete to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
