-- Storage bucket used by /contribute/upload-lesson.
-- The bucket is public because published lesson cards currently use
-- Supabase getPublicUrl() for previews on subject pages.
insert into storage.buckets (id, name, public)
values ('lesson-files', 'lesson-files', true)
on conflict (id) do update set public = true;

-- Public previews/downloads for lesson files. Upload, update, and delete are
-- restricted to authenticated users and their own user-id folder.
drop policy if exists "Lesson files are publicly readable" on storage.objects;
create policy "Lesson files are publicly readable"
  on storage.objects for select
  using (bucket_id = 'lesson-files');

drop policy if exists "Users can upload their own lesson files" on storage.objects;
create policy "Users can upload their own lesson files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'lesson-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own lesson files" on storage.objects;
create policy "Users can update their own lesson files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'lesson-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'lesson-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own lesson files" on storage.objects;
create policy "Users can delete their own lesson files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'lesson-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
