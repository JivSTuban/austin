import { supabase } from '../supabase';
import fs from 'fs';
import path from 'path';

async function applyForumPolicies() {
  try {
    // Enable RLS
    await supabase.from('replies').select('*').limit(0);
    
    // Create read access policy
    await supabase.rpc('create_forum_replies_policies', {
      policy_statements: [
        // Public read access
        `
        create policy "Public can read all forum replies"
        on replies for select
        to authenticated, anon
        using (true)
        `,
        // Authenticated user insert
        `
        create policy "Authenticated users can create replies"
        on replies for insert
        to authenticated
        with check (author_id = auth.uid())
        `,
        // User update own replies
        `
        create policy "Users can update own replies"
        on replies for update
        to authenticated
        using (author_id = auth.uid())
        with check (author_id = auth.uid())
        `,
        // User delete own replies
        `
        create policy "Users can delete own replies"
        on replies for delete
        to authenticated
        using (author_id = auth.uid())
        `
      ]
    });

    console.log('Successfully applied forum replies policies');
  } catch (error) {
    console.error('Error applying forum policies:', error);
    throw error;
  }
}

// First create the required function in the database
async function createPolicyFunction() {
  try {
    await supabase.rpc('create_policy_function', {
      function_definition: `
        CREATE OR REPLACE FUNCTION create_forum_replies_policies(policy_statements text[])
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Enable RLS on replies
          ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
          
          -- Apply each policy statement
          FOR i IN 1..array_length(policy_statements, 1) LOOP
            EXECUTE policy_statements[i];
          END LOOP;
        END;
        $$;
      `
    });
  } catch (error) {
    console.error('Error creating policy function:', error);
    throw error;
  }
}

// Run the migration
async function runMigration() {
  try {
    await createPolicyFunction();
    await applyForumPolicies();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  process.exit(0);
}

runMigration();
