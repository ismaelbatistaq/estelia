-- Drop existing constraints and triggers
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create user types enum if not exists
do $$ begin
  create type user_type as enum ('platform_admin', 'platform_agent', 'business_user');
exception
  when duplicate_object then null;
end $$;

-- Create business user roles enum if not exists
do $$ begin
  create type business_role as enum ('owner', 'admin', 'manager', 'staff', 'stylist', 'receptionist');
exception
  when duplicate_object then null;
end $$;

-- Update profiles table structure
alter table profiles
  alter column user_type type user_type using user_type::text::user_type,
  alter column role type business_role using 
    case role 
      when 'admin' then 'admin'::business_role
      when 'manager' then 'manager'::business_role
      when 'staff' then 'staff'::business_role
      when 'stylist' then 'stylist'::business_role
      when 'receptionist' then 'receptionist'::business_role
      else 'staff'::business_role
    end,
  add column if not exists platform_role text check (
    (user_type in ('platform_admin', 'platform_agent') and platform_role is not null) or
    (user_type = 'business_user' and platform_role is null)
  );

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
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update RLS policies
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