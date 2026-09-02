-- Send an approval email only once for each contributor application.
-- The contributor_applications table is created by the contributor workflow.
do $$
begin
  if to_regclass('public.profiles') is not null then
    alter table public.profiles
      add column if not exists role text default 'student';
  end if;

  if to_regclass('public.contributor_applications') is not null then
    alter table public.contributor_applications
      add column if not exists approval_email_sent_at timestamptz;
  end if;
end;
$$;
