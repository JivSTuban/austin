import { supabase } from '../supabase';
import { executeSqlMigration } from './migrateDatabase';

/**
 * Checks if the soldproperties table exists and creates it if it doesn't
 */
export const ensureSoldPropertiesTable = async (): Promise<void> => {
  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('soldproperties')
      .select('uuid')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('soldproperties table does not exist, creating it...');
      
      // SQL to create the table and set RLS policies
      const sqlContent = `
      -- Create soldproperties table
      create table if not exists public.soldproperties (
        uuid uuid null default gen_random_uuid(),
        address text not null,
        year integer not null,
        city text not null,
        date_added timestamp without time zone null default now(),
        latest_updated timestamp without time zone null default now()
      );
      
      -- Set RLS policy
      alter table public.soldproperties enable row level security;
      
      -- Create policy for reading sold properties (anyone can view)
      create policy "Anyone can view sold properties"
        on public.soldproperties
        for select
        to authenticated, anon
        using (true);
      
      -- Create policy for inserting sold properties (admin only)
      create policy "Admins can insert sold properties"
        on public.soldproperties
        for insert
        to authenticated
        with check (
          exists (
            select 1 from user_roles
            where user_roles.id = auth.uid() and user_roles.role = 'admin'
          )
        );
      
      -- Create policy for updating sold properties (admin only)
      create policy "Admins can update sold properties"
        on public.soldproperties
        for update
        to authenticated
        using (
          exists (
            select 1 from user_roles
            where user_roles.id = auth.uid() and user_roles.role = 'admin'
          )
        );
      
      -- Create policy for deleting sold properties (admin only)
      create policy "Admins can delete sold properties"
        on public.soldproperties
        for delete
        to authenticated
        using (
          exists (
            select 1 from user_roles
            where user_roles.id = auth.uid() and user_roles.role = 'admin'
          )
        );
      `;
      
      // Execute the SQL
      await executeSqlMigration(sqlContent);
      console.log('soldproperties table created successfully');
    } else {
      console.log('soldproperties table already exists');
    }
  } catch (error) {
    console.error('Error ensuring soldproperties table:', error);
  }
}; 