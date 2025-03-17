# Forum Replies Policies

These policies should be applied through the Supabase dashboard or CLI to enable proper permissions for forum replies.

## SQL Commands

```sql
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
```

## How to Apply

1. Go to the Supabase Dashboard
2. Navigate to your project
3. Go to SQL Editor
4. Copy and paste the SQL commands above
5. Click "Run" to execute the policies

## Verification

After applying the policies, you should be able to:
1. Read forum replies without authentication
2. Create new replies when authenticated
3. Update and delete your own replies when authenticated
4. Join with profiles table to get author information

If any of these operations fail, double-check that:
1. RLS is enabled on the forum_replies table
2. All policies are correctly applied
3. The profiles table policies allow reading profiles when joined with forum_replies

## Related Tables

- `forum_replies`
- `profiles`

Note: Make sure the profiles table also has appropriate policies to allow reading user information when joined with forum_replies.
