-- Drop existing policies
drop policy if exists "Platform admins can view all profiles" on profiles;
drop policy if exists "Business users can view profiles in their business" on profiles;
drop policy if exists "Platform admins can view all businesses" on businesses;
drop policy if exists "Business users can view their own business" on businesses;

-- Create new non-recursive policies for profiles
create policy "Platform admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'user_type')::text = 'platform_admin'
    )
  );

create policy "Business users can view profiles in their business"
  on profiles for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'business_id')::uuid = profiles.business_id
    )
  );

-- Create new policies for businesses
create policy "Platform admins can view all businesses"
  on businesses for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'user_type')::text = 'platform_admin'
    )
  );

create policy "Business users can view their own business"
  on businesses for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'business_id')::uuid = businesses.id
    )
  );

-- Update user claims function
create or replace function update_user_claims()
returns trigger as $$
begin
  update auth.users set raw_user_meta_data = 
    coalesce(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'user_type', new.user_type,
      'business_id', new.business_id
    )
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updating user claims
drop trigger if exists on_profile_updated on profiles;
create trigger on_profile_updated
  after insert or update on profiles
  for each row
  execute function update_user_claims();