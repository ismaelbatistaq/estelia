-- Create user_type enum
create type user_type as enum ('platform_admin', 'business_user');

-- Profiles
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text not null default 'user',
  user_type user_type not null default 'business_user',
  is_owner boolean not null default false,
  permissions jsonb default '{}',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_business_user check (
    (user_type = 'business_user' and business_id is not null) or
    (user_type = 'platform_admin' and business_id is null)
  )
);

-- Roles
create table roles (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  permissions jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, name)
);

-- User Roles junction table
create table user_roles (
  user_id uuid references profiles(id) on delete cascade not null,
  role_id uuid references roles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, role_id)
);

-- Create indexes
create index idx_profiles_business_id on profiles(business_id);
create index idx_profiles_email on profiles(email);
create index idx_roles_business_id on roles(business_id);

-- Function to handle new user creation
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

-- Function to update user claims
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

-- Create triggers
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_profile_updated on profiles;
create trigger on_profile_updated
  after insert or update on profiles
  for each row
  execute function update_user_claims();