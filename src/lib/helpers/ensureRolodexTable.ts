import { supabase } from '../supabase';

export async function ensureRolodexTable() {
  try {
    // Check if the table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('rolodex')
      .select('id')
      .limit(1);

    if (checkError && checkError.message.includes('relation "rolodex" does not exist')) {
      // Read and execute the migration
      const response = await fetch('/migrations/007_add_rolodex_table.sql');
      const sqlContent = await response.text();

      const { error: migrationError } = await supabase.rpc('exec_sql', {
        sql: sqlContent
      });

      if (migrationError) {
        throw migrationError;
      }

      console.log('Rolodex table created successfully');
    }
  } catch (error) {
    console.error('Error ensuring rolodex table:', error);
    throw error;
  }
} 