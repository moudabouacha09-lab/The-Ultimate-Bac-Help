-- Align notification fan-out with the existing schema's required `message` column.
create or replace function public.create_question_answered_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, message, question_id)
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

drop function if exists public.send_announcement(text, text);
create or replace function public.send_announcement(p_title text, p_body text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare inserted_count integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'admin_required';
  end if;
  if nullif(trim(p_title), '') is null or nullif(trim(p_body), '') is null then
    raise exception 'announcement_content_required';
  end if;
  insert into public.notifications (user_id, type, title, message)
  select id, 'announcement', trim(p_title), trim(p_body) from auth.users;
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;
