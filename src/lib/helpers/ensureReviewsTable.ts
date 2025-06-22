import { supabase } from '../supabase';

export async function ensureReviewsTable() {
  // Check if the table exists
  const { data: existingTable } = await supabase
    .from('reviews')
    .select('*')
    .limit(1);

  if (existingTable === null) {
    // Create the table if it doesn't exist
    const createTableQuery = `
      create table if not exists public.reviews (
        reviewid integer not null,
        encodedzuid character varying null,
        reviewername character varying null,
        reviewerscreenname character varying null,
        rating integer null,
        comment text null,
        createdate timestamp without time zone null,
        workdescription character varying null,
        localknowledge integer null,
        processexpertise integer null,
        responsiveness integer null,
        negotiationskills integer null,
        reviewerid uuid null,
        constraint reviews_pkey primary key (reviewid),
        constraint reviews_encodedzuid_fkey foreign key (encodedzuid) references agents (encodedzuid),
        constraint reviews_reviewerid_fkey foreign key (reviewerid) references auth.users (id)
      );

      -- Enable RLS
      alter table public.reviews enable row level security;

      -- Create policies
      create policy "Allow public read access"
      on public.reviews
      for select
      to public
      using (true);

      create policy "Allow admin delete access"
      on public.reviews
      for delete
      to authenticated
      using (auth.jwt() ->> 'email' = 'austin@21stmortgage.com');
    `;

    const { error: createError } = await supabase.rpc('exec', { query: createTableQuery });
    if (createError) {
      console.error('Error creating reviews table:', createError);
      throw createError;
    }
  }
} 