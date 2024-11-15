-- Drop existing policies
drop policy if exists "Platform admins can view all businesses" on businesses;
drop policy if exists "Business users can view their own business" on businesses;
drop policy if exists "Platform admins can view all profiles" on profiles;
drop policy if exists "Business users can view profiles in their business" on profiles;

-- Enable RLS
alter table businesses enable row level security;
alter table profiles enable row level security;

-- Business policies
create policy "Anyone can view businesses"
  on businesses for select
  using (true);

create policy "Platform admins can insert businesses"
  on businesses for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'::user_type
    )
  );

create policy "Platform admins can update businesses"
  on businesses for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'::user_type
    )
  );

-- Profile policies
create policy "Anyone can view profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

-- Update profiles view to include business data
create or replace view extended_profiles as
select 
  p.*,
  b.name as business_name,
  b.slug as business_slug,
  b.settings as business_settings
from profiles p
left join businesses b on p.business_id = b.id;