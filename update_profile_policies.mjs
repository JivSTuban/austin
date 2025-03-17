import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updateProfilePolicies = async () => {
  try {
    console.log('Updating profile policies...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Update profile policies to allow reading all profiles
        DROP POLICY IF EXISTS "Users can read their own profile." ON profiles;
        CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);

        -- Keep the update policy
        DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
        CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
      `
    });
    
    if (error) throw error;
    console.log('Profile policies updated successfully');
  } catch (error) {
    console.error('Failed to update profile policies:', error);
    throw error;
  }
};

console.log('Starting profile policies update...');
updateProfilePolicies()
  .then(() => {
    console.log('Profile policies update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });
