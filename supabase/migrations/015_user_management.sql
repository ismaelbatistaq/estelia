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

-- Drop existing triggers and functions
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_updated on profiles;
drop function if exists public.handle_new_user() cascade;
drop function if exists update_user_claims() cascade;

-- Drop and recreate enums
drop type if exists user_type cascade;
create type user_type as enum ('platform_admin', 'platform_agent', 'business_user');

drop type if exists business_role cascade;
create type business_role as enum ('owner', 'admin', 'manager', 'staff', 'stylist', 'receptionist');

-- Drop old profiles table and create new one
drop table profiles cascade;

create table profiles (
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

-- Migrate data from temporary table
insert into profiles (
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
)
select distinct on (t.id)
  t.id,
  t.email,
  t.first_name,
  t.last_name,
  'business_user'::user_type,
  t.business_id,
  'staff'::business_role,
  null,
  coalesce(t.is_owner, false),
  'active',
  coalesce(t.created_at, now()),
  coalesce(t.updated_at, now())
from profiles_temp t
where t.id is not null
on conflict (id) do nothing;

-- Drop temporary table
drop table profiles_temp;

-- Create indexes
create index idx_profiles_business_id on profiles(business_id);
create index idx_profiles_user_type on profiles(user_type);
create index idx_profiles_email on profiles(email);

-- Create the profiles view
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
begin
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
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type,
    case 
      when new.raw_user_meta_data->>'business_id' is not null 
      then (new.raw_user_meta_data->>'business_id')::uuid 
      else null 
    end,
    case
      when new.raw_user_meta_data->>'user_type' = 'business_user'
      then coalesce(new.raw_user_meta_data->>'role', 'staff')::business_role
      else null
    end,
    case
      when new.raw_user_meta_data->>'user_type' in ('platform_admin', 'platform_agent')
      then coalesce(new.raw_user_meta_data->>'platform_role', 'admin')
      else null
    end,
    coalesce((new.raw_user_meta_data->>'is_owner')::boolean,