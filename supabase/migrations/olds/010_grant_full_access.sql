-- Disable RLS on all tables
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

-- Update handle_new_user function to make users platform admins by default
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    role
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'platform_admin',
    'admin'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();