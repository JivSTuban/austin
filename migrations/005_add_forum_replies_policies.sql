-- Enable RLS on forum_replies table
alter table replies enable row level security;

-- Policy to allow anyone to read replies
create policy "Public can read all forum replies"
on replies for select
to authenticated, anon
using (true);

-- Policy to allow authenticated users to insert their own replies
create policy "Authenticated users can create replies"
on replies for insert
to authenticated
with check (author_id = auth.uid());

-- Policy to allow users to update their own replies
create policy "Users can update own replies"
on replies for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- Policy to allow users to delete their own replies
create policy "Users can delete own replies"
on replies for delete
to authenticated
using (author_id = auth.uid());