-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create new function that makes business_id optional
alter table profiles alter column business_id drop not null;
alter table profiles drop constraint if exists valid_business_user;

-- Create new user handler function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    business_id
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type,
    case 
      when new.raw_user_meta_data->>'business_id' is not null 
      then (new.raw_user_meta_data->>'business_id')::uuid 
      else null
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update existing profiles to have correct user_type
update profiles 
set user_type = 'platform_admin' 
where business_id is null;