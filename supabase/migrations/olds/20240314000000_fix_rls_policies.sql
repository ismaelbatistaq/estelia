-- Drop existing policies
drop policy if exists "Platform admins can view all profiles" on profiles;
drop policy if exists "Business users can view profiles in their business" on profiles;

-- Create new non-recursive policies
create policy "Platform admins can view all profiles"
  on profiles for select
  using (
    auth.jwt() ->> 'user_type' = 'platform_admin'
  );

create policy "Business users can view profiles in their business"
  on profiles for select
  using (
    business_id = (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
      limit 1
    )
  );

-- Update the user_type claim in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, user_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Ensure the trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update existing users with user_type claim
update auth.users
set raw_user_meta_data = raw_user_meta_data || 
  jsonb_build_object(
    'user_type',
    (
      select 
        case when user_type = 'platform_admin' then 'platform_admin'
        else 'business_user'
        end
      from profiles
      where profiles.id = auth.users.id
    )
  );