-- Teacher queue notifications are also supported alongside answer notifications.
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('new_question', 'question_answered', 'announcement'));
