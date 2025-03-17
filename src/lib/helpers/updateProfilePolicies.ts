import { executeSqlMigration } from './migrateDatabase';
import fs from 'fs';
import path from 'path';

export const updateProfilePolicies = async (): Promise<void> => {
  try {
    console.log('Updating profile policies...');
    
    const sqlContent = `
    -- Update profile policies to allow reading all profiles
    DROP POLICY IF EXISTS "Users can read their own profile." ON profiles;
    CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);

    -- Keep the update policy
    DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
    CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
    `;
    
    await executeSqlMigration(sqlContent);
    console.log('Profile policies updated successfully');
  } catch (error) {
    console.error('Failed to update profile policies:', error);
    throw error;
  }
};
