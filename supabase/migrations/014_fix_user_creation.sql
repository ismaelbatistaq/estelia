-- Add missing indexes and constraints
create index if not exists idx_profiles_business_id on profiles(business_id);
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_user_type on profiles(user_type);

-- Add status column if it doesn't exist
alter table profiles 
  add column if not exists status text not null default 'active' 
  check (status in ('active', 'inactive'));

-- Update the auth trigger to handle all required fields
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    business_id,
    role,
    is_owner,
    status
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type,
    (new.raw_user_meta_data->>'business_id')::uuid,
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    coalesce((new.raw_user_meta_data->>'is_owner')::boolean, false),
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();