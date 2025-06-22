-- Create rolodex table
create table public.rolodex (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying null,
  company character varying null,
  number_1 character varying null,
  number_2 character varying null,
  email character varying null,
  notes text null,
  area character varying null,
  website character varying null,
  category character varying null,
  date_added timestamp without time zone null default now(),
  last_updated timestamp without time zone null default now(),
  constraint rolodex_pkey primary key (id)
);

-- Enable RLS
alter table public.rolodex enable row level security;

-- Create policies
create policy "Enable read access for authenticated users only" on public.rolodex
  for select
  to authenticated
  using (true);

create policy "Enable insert for admin users only" on public.rolodex
  for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'austin@21stmortgage.com');

create policy "Enable update for admin users only" on public.rolodex
  for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'austin@21stmortgage.com')
  with check (auth.jwt() ->> 'email' = 'austin@21stmortgage.com');

create policy "Enable delete for admin users only" on public.rolodex
  for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'austin@21stmortgage.com'); 