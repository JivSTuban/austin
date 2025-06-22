import { supabase } from '../supabase';

export async function ensureListingsTable() {
  // Check if the table exists
  const { data: existingTable } = await supabase
    .from('listings')
    .select('*')
    .limit(1);

  if (existingTable === null) {
    // Create the table if it doesn't exist
    const createTableQuery = `
      create table if not exists public.listings (
        id bigint not null,
        title character varying null,
        address character varying null,
        price numeric null,
        beds integer null,
        baths numeric null,
        last_updated_from_zillow timestamp without time zone null,
        sqft integer null,
        zillow_link text null,
        imagelink text null,
        constraint listings_pkey primary key (id)
      );

      -- Enable RLS
      alter table public.listings enable row level security;

      -- Create policies
      create policy "Allow public read access"
      on public.listings
      for select
      to public
      using (true);

      create policy "Allow admin full access"
      on public.listings
      for all
      to authenticated
      using (auth.jwt() ->> 'email' = 'austin@21stmortgage.com')
      with check (auth.jwt() ->> 'email' = 'austin@21stmortgage.com');
    `;

    const { error: createError } = await supabase.rpc('exec', { query: createTableQuery });
    if (createError) {
      console.error('Error creating listings table:', createError);
      throw createError;
    }
  }
} 