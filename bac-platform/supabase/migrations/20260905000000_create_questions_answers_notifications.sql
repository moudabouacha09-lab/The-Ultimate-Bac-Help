-- Student questions, teacher answers, and the single notification type
-- currently supported by the application.
alter table if exists public.profiles
  add column if not exists subjects text[] not null default '{}';

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  subject_slug text not null,
  unit text,
  question_text text not null check (char_length(trim(question_text)) > 0),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  answered_by uuid not null references public.profiles(id) on delete cascade,
  answer_text text not null check (char_length(trim(answer_text)) > 0),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type = 'question_answered'),
  title text not null,
  body text not null,
  question_id uuid references public.questions(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists questions_subject_created_idx on public.questions(subject_slug, created_at desc);
create index if not exists questions_student_created_idx on public.questions(student_id, created_at desc);
create index if not exists answers_question_created_idx on public.answers(question_id, created_at asc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

create or replace function public.enforce_daily_question_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.questions q where q.student_id = new.student_id and q.created_at >= date_trunc('day', now())) >= 3 then
    raise exception 'daily_question_limit';
  end if;
  return new;
end;
$$;

drop trigger if exists daily_question_limit on public.questions;
create trigger daily_question_limit before insert on public.questions
for each row execute function public.enforce_daily_question_limit();

alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Questions are publicly readable" on public.questions;
create policy "Questions are publicly readable" on public.questions for select using (true);

drop policy if exists "Students can ask questions" on public.questions;
create policy "Students can ask questions" on public.questions for insert to authenticated
  with check (auth.uid() = student_id);

drop policy if exists "Answers are publicly readable" on public.answers;
create policy "Answers are publicly readable" on public.answers for select using (true);

drop policy if exists "Teachers can answer questions" on public.answers;
create policy "Teachers can answer questions" on public.answers for insert to authenticated
  with check (
    auth.uid() = answered_by
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher', 'admin'))
  );

drop policy if exists "Users can read their notifications" on public.notifications;
create policy "Users can read their notifications" on public.notifications for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can mark their notifications read" on public.notifications;
create policy "Users can mark their notifications read" on public.notifications for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.create_question_answered_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, question_id)
  select q.student_id,
    'question_answered',
    'تمت الإجابة عن سؤالك',
    'أضاف أحد الأساتذة إجابة جديدة إلى سؤالك.',
    q.id
  from public.questions q
  where q.id = new.question_id;
  return new;
end;
$$;

drop trigger if exists question_answered_notification on public.answers;
create trigger question_answered_notification
  after insert on public.answers
  for each row execute function public.create_question_answered_notification();
