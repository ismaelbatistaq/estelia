-- Drop existing views and policies first
drop view if exists extended_profiles;

-- Drop all policies that depend on user_type
drop policy if exists "Platform admins can manage marketplace products" on marketplace_products;
drop policy if exists "Platform admins can manage all orders" on marketplace_orders;
drop policy if exists "Platform admins can manage all order items" on marketplace_order_items;
drop policy if exists "Platform admins can manage all status history" on marketplace_order_status_history;
drop policy if exists "Platform admins can manage categories" on marketplace_categories;
drop policy if exists "Platform admins can view all profiles" on profiles;
drop policy if exists "Platform agents can view assigned business profiles" on profiles;
drop policy if exists "Business users can view profiles in their business" on profiles;

-- Drop and recreate user_type enum with all values
drop type if exists user_type cascade;
create type user_type as enum ('platform_admin', 'platform_agent', 'business_user');

-- Drop and recreate business_role enum with all values
drop type if exists business_role cascade;
create type business_role as enum ('owner', 'admin', 'manager', 'staff', 'stylist', 'receptionist');

-- Add new columns with new types
alter table profiles 
  add column if not exists new_user_type user_type,
  add column if not exists new_role business_role,
  add column if not exists platform_role text,
  add column if not exists status text default 'active';

-- Migrate data from old columns to new ones if they exist
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'user_type') then
    update profiles set
      new_user_type = case user_type::text
        when 'platform_admin' then 'platform_admin'::user_type
        when 'platform_agent' then 'platform_agent'::user_type
        else 'business_user'::user_type
      end;
  end if;

  if exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
    update profiles set
      new_role = case role::text
        when 'admin' then 'admin'::business_role
        when 'manager' then 'manager'::business_role
        when 'staff' then 'staff'::business_role
        when 'stylist' then 'stylist'::business_role
        when 'receptionist' then 'receptionist'::business_role
        else 'staff'::business_role
      end;
  end if;
end $$;

-- Drop old columns if they exist
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'user_type') then
    alter table profiles drop column user_type;
  end if;

  if exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
    alter table profiles drop column role;
  end if;
end $$;

-- Rename new columns to final names
alter table profiles 
  rename column new_user_type to user_type;

alter table profiles 
  rename column new_role to role;

-- Set not null constraint on user_type
alter table profiles 
  alter column user_type set not null,
  alter column user_type set default 'business_user';

-- Add constraint for platform_role
alter table profiles
  drop constraint if exists check_platform_role,
  add constraint check_platform_role check (
    (user_type in ('platform_admin', 'platform_agent') and platform_role is not null) or
    (user_type = 'business_user' and platform_role is null)
  );

-- Recreate the profiles view
create view extended_profiles as
select 
  p.*,
  b.name as business_name,
  b.slug as business_slug,
  b.settings as business_settings
from profiles p
left join businesses b on p.business_id = b.id;

-- Create improved user handler function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_user_type user_type;
  v_business_role business_role;
  v_platform_role text;
begin
  -- Determine user type and role
  v_user_type := coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type;
  
  if v_user_type = 'business_user' then
    v_business_role := coalesce(new.raw_user_meta_data->>'role', 'staff')::business_role;
    v_platform_role := null;
  else
    v_business_role := null;
    v_platform_role := coalesce(new.raw_user_meta_data->>'platform_role', 'agent');
  end if;

  -- Insert profile
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    business_id,
    role,
    platform_role,
    is_owner,
    status
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    v_user_type,
    case 
      when v_user_type = 'business_user' 
      then (new.raw_user_meta_data->>'business_id')::uuid 
      else null 
    end,
    v_business_role,
    v_platform_role,
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

-- Recreate all policies
create policy "Platform admins can manage marketplace products"
  on marketplace_products for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all orders"
  on marketplace_orders for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all order items"
  on marketplace_order_items for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all status history"
  on marketplace_order_status_history for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage categories"
  on marketplace_categories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform agents can view assigned business profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_agent'
    )
  );

create policy "Business users can view profiles in their business"
  on profiles for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'business_user'
    )
  );

-- Create platform admin user if not exists
do $$
declare
  v_user_id uuid;
begin
  -- Create auth user if not exists
  insert into auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) values (
    'admin@estelia.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'user_type', 'platform_admin',
      'platform_role', 'admin',
      'first_name', 'Platform',
      'last_name', 'Admin'
    )
  )
  on conflict (email) do nothing
  returning id into v_user_id;

  -- Create profile if not exists
  if v_user_id is not null then
    insert into profiles (
      id,
      email,
      first_name,
      last_name,
      user_type,
      platform_role,
      status
    ) values (
      v_user_id,
      'admin@estelia.com',
      'Platform',
      'Admin',
      'platform_admin',
      'admin',
      'active'
    )
    on conflict (id) do nothing;
  end if;
end $$;