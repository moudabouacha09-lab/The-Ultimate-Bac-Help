-- ==========================================================
-- Migration: Create Profiles Table & Auth Trigger Function
-- For Supabase Database (Project: The Ultimate BAC Help)
-- ==========================================================

-- 1. Create the `profiles` table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  branch text default 'experimental-science',
  level text default 'mid',
  target_grade numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
-- Allow users to view their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Allow users to update their own profile
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Allow service role and trigger to insert profile
drop policy if exists "Enable insert for authenticated users and trigger" on public.profiles;
create policy "Enable insert for authenticated users and trigger"
  on public.profiles
  for insert
  with check (true);

-- 4. Create Postgres Trigger Function to auto-insert profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, branch, level, target_grade)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'branch', 'experimental-science'),
    coalesce(new.raw_user_meta_data->>'level', 'mid'),
    case 
      when (new.raw_user_meta_data->>'target_grade') is not null and (new.raw_user_meta_data->>'target_grade') ~ '^[0-9]+(\.[0-9]+)?$'
      then (new.raw_user_meta_data->>'target_grade')::numeric
      else null
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    branch = coalesce(excluded.branch, profiles.branch),
    level = coalesce(excluded.level, profiles.level),
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

-- 5. Create Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
