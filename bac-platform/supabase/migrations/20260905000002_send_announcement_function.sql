-- Fan out platform-wide announcements from a server-side, admin-only RPC.
drop function if exists public.send_announcement(text, text);
create or replace function public.send_announcement(p_title text, p_body text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'admin_required';
  end if;
  if nullif(trim(p_title), '') is null or nullif(trim(p_body), '') is null then
    raise exception 'announcement_content_required';
  end if;
  insert into public.notifications (user_id, type, title, message)
  select id, 'announcement', trim(p_title), trim(p_body)
  from auth.users;
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.send_announcement(text, text) from public;
grant execute on function public.send_announcement(text, text) to authenticated;
