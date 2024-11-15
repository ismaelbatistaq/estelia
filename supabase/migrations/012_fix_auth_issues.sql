-- Drop and recreate the auth trigger to properly handle new users
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create improved user handler function
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
    is_owner
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type,
    (new.raw_user_meta_data->>'business_id')::uuid,
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    coalesce((new.raw_user_meta_data->>'is_owner')::boolean, false)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update demo user's password to be properly hashed
update auth.users
set encrypted_password = crypt('demo123', gen_salt('bf'))
where email = 'demo@demo-salon.estelia.com';

-- Ensure demo user is confirmed
update auth.users
set email_confirmed_at = now(),
    confirmation_token = null,
    recovery_token = null
where email = 'demo@demo-salon.estelia.com';