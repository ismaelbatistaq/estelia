-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Make all profile columns nullable except id
alter table profiles 
  alter column email drop not null,
  alter column first_name drop not null,
  alter column last_name drop not null,
  alter column role drop not null,
  alter column user_type drop not null;

-- Remove all constraints from profiles
alter table profiles 
  drop constraint if exists profiles_business_id_fkey,
  drop constraint if exists valid_business_user,
  drop constraint if exists profiles_email_key;

-- Create simplified user handler
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();