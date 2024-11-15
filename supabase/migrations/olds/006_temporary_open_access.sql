-- Temporarily drop all existing policies
do $$
declare
  r record;
begin
  for r in (
    select tablename 
    from pg_tables 
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists "Allow all access to authenticated users" on %I', r.tablename);
    execute format('drop policy if exists "Business data access" on %I', r.tablename);
    execute format('drop policy if exists "Platform admins can view all businesses" on %I', r.tablename);
    execute format('drop policy if exists "Business users can view their own business" on %I', r.tablename);
    execute format('drop policy if exists "Users can view clients in their business" on %I', r.tablename);
  end loop;
end $$;

-- Create open access policy for all tables
do $$
declare
  r record;
begin
  for r in (
    select tablename 
    from pg_tables 
    where schemaname = 'public'
  ) loop
    execute format('create policy "Temporary open access" on %I for all using (true)', r.tablename);
  end loop;
end $$;