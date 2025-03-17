-- Enable RLS on forum_replies table
alter table forum_replies enable row level security;

-- Policy to allow anyone to read forum_replies
create policy "Allow public read access to forum_replies"
on forum_replies for select
to authenticated, anon
using (true);

-- Policy to allow authenticated users to insert their own replies
create policy "Allow authenticated users to insert replies"
on forum_replies for insert
to authenticated
with check (author_id = auth.uid());

-- Policy to read profiles when joined with forum_replies
create policy "Allow public read access to forum reply authors"
on profiles for select
to authenticated, anon
using (true);

-- Policy to join profiles with forum_replies
create policy "Allow profiles to be joined with forum_replies"
on profiles for select
to authenticated, anon
using (
  id in (
    select author_id 
    from forum_replies
  )
);
