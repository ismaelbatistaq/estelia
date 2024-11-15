-- Disable RLS temporarily for development
alter table businesses disable row level security;
alter table profiles disable row level security;
alter table clients disable row level security;
alter table services disable row level security;
alter table products disable row level security;
alter table appointments disable row level security;
alter table sales disable row level security;
alter table service_categories disable row level security;
alter table product_categories disable row level security;
alter table roles disable row level security;
alter table user_roles disable row level security;

-- Drop all existing policies
do $$
declare
  r record;
begin
  for r in (
    select tablename 
    from pg_tables 
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists "Temporary open access" on %I', r.tablename);
    execute format('drop policy if exists "Allow all access to authenticated users" on %I', r.tablename);
    execute format('drop policy if exists "Business data access" on %I', r.tablename);
  end loop;
end $$;

-- Simplify user creation trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;