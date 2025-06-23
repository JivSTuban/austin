-- Enable RLS on replies table
alter table replies enable row level security;

-- Policy to allow anyone to read replies
create policy "Allow public read access to replies"
on replies for select
to authenticated, anon
using (true);

-- Policy to allow authenticated users to insert their own replies
create policy "Allow authenticated users to insert replies"
on replies for insert
to authenticated
with check (author_id = auth.uid());

-- Policy to read profiles when joined with replies
create policy "Allow public read access to forum reply authors"
on profiles for select
to authenticated, anon
using (true);

-- Policy to join profiles with replies
create policy "Allow profiles to be joined with replies"
on profiles for select
to authenticated, anon
using (
  id in (
    select author_id 
    from replies
  )
);
