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

-- Create temporary table to store existing data
create table profiles_temp as select * from profiles;

-- Drop existing triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_updated on profiles;

-- Drop existing functions
drop function if exists public.handle_new_user() cascade;
drop function if exists update_user_claims() cascade;

-- Drop and recreate user_type enum
drop type if exists user_type cascade;
create type user_type as enum ('platform_admin', 'platform_agent', 'business_user');

-- Drop and recreate business_role enum
drop type if exists business_role cascade;
create type business_role as enum ('owner', 'admin', 'manager', 'staff', 'stylist', 'receptionist');

-- Recreate profiles table with new structure
create table profiles_new (
  id uuid primary key,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  user_type user_type not null default 'business_user',
  business_id uuid references businesses(id) on delete cascade,
  role business_role,
  platform_role text,
  is_owner boolean not null default false,
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_platform_role check (
    (user_type in ('platform_admin', 'platform_agent') and platform_role is not null) or
    (user_type = 'business_user' and platform_role is null)
  )
);

-- Migrate data from temporary table with safe column checks
do $$
declare
  r record;
  v_user_type user_type;
  v_role business_role;
  v_platform_role text;
begin
  for r in select * from profiles_temp loop
    -- Determine user type
    if exists (
      select 1 from information_schema.columns 
      where table_name = 'profiles_temp' and column_name = 'user_type'
    ) then
      v_user_type := case r.user_type::text
        when 'platform_admin' then 'platform_admin'::user_type
        when 'platform_agent' then 'platform_agent'::user_type
        else 'business_user'::user_type
      end;
    else
      v_user_type := 'business_user'::user_type;
    end if;

    -- Determine role
    if exists (
      select 1 from information_schema.columns 
      where table_name = 'profiles_temp' and column_name = 'role'
    ) then
      v_role := case r.role::text
        when 'admin' then 'admin'::business_role
        when 'manager' then 'manager'::business_role
        when 'staff' then 'staff'::business_role
        when 'stylist' then 'stylist'::business_role
        when 'receptionist' then 'receptionist'::business_role
        else 'staff'::business_role
      end;
    else
      v_role := 'staff'::business_role;
    end if;

    -- Determine platform role
    v_platform_role := case 
      when v_user_type in ('platform_admin', 'platform_agent') then 'admin'
      else null
    end;

    -- Insert into new table
    insert into profiles_new (
      id,
      email,
      first_name,
      last_name,
      user_type,
      business_id,
      role,
      platform_role,
      is_owner,
      status,
      created_at,
      updated_at
    ) values (
      r.id,
      r.email,
      r.first_name,
      r.last_name,
      v_user_type,
      r.business_id,
      v_role,
      v_platform_role,
      coalesce(r.is_owner, false),
      'active',
      coalesce(r.created_at, now()),
      coalesce(r.updated_at, now())
    );
  end loop;
end $$;

-- Drop old table and rename new one
drop table profiles cascade;
alter table profiles_new rename to profiles;

-- Create indexes
create index idx_profiles_business_id on profiles(business_id);
create index idx_profiles_user_type on profiles(user_type);
create index idx_profiles_email on profiles(email);

-- Recreate the profiles view
create view extended_profiles as
select 
  p.*,
  b.name as business_name,
  b.slug as business_slug,
  b.settings as business_settings
from profiles p
left join businesses b on p.business_id = b.id;

-- Create new user handler function
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
    v_platform_role := coalesce(new.raw_user_meta_data->>'platform_role', 'admin');
  end if;

  -- Insert profile
  inser

  -- Modificar la sección de creación del usuario admin al final del archivo:

-- Create platform admin user if not exists
do $$
declare
  v_user_id uuid;
  v_exists boolean;
begin
  -- Check if admin user exists
  select exists(
    select 1 
    from auth.users 
    where email = 'admin@estelia.com'
  ) into v_exists;

  -- Create auth user if not exists
  if not v_exists then
    insert into auth.users (
      id,  -- Explicitly set the ID
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data
    ) values (
      gen_random_uuid(),  -- Generate a new UUID
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
    returning id into v_user_id;

    -- Create profile
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
    );
  end if;
end $$;