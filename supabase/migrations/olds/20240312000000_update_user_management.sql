-- Drop existing tables if they exist
drop table if exists user_roles cascade;
drop table if exists roles cascade;

-- Create user_types enum if it doesn't exist
do $$ begin
  create type user_type as enum ('platform_admin', 'business_user');
exception
  when duplicate_object then null;
end $$;

-- Rename organization_id to business_id in profiles
do $$ begin
  alter table profiles rename column organization_id to business_id;
exception
  when undefined_column then null;
end $$;

-- Update profiles table
alter table profiles
  add column if not exists user_type user_type not null default 'business_user',
  add column if not exists is_owner boolean not null default false,
  add column if not exists permissions jsonb not null default '{}';

-- Add constraints if they don't exist
do $$ begin
  alter table profiles
    add constraint valid_business_user 
    check (
      (user_type = 'business_user' and business_id is not null) or
      (user_type = 'platform_admin' and business_id is null)
    );
exception
  when duplicate_object then null;
end $$;

-- Create roles table for business-level roles
create table if not exists roles (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  permissions jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, name)
);

-- Create user_roles junction table
create table if not exists user_roles (
  user_id uuid references profiles(id) on delete cascade not null,
  role_id uuid references roles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, role_id)
);

-- Drop existing policies
drop policy if exists "Platform admins can view all businesses" on businesses;
drop policy if exists "Business users can view their own business" on businesses;
drop policy if exists "Platform admins can view all profiles" on profiles;
drop policy if exists "Business users can view profiles in their business" on profiles;

-- Update RLS policies
create policy "Platform admins can view all businesses"
  on businesses for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Business users can view their own business"
  on businesses for select
  using (
    id in (
      select business_id from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'business_user'
    )
  );

create policy "Platform admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles admin
      where admin.id = auth.uid()
      and admin.user_type = 'platform_admin'
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