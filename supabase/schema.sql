-- Drop existing tables if they exist (in reverse order of dependencies)
drop table if exists inventory_transactions cascade;
drop table if exists sale_items cascade;
drop table if exists sales cascade;
drop table if exists appointment_services cascade;
drop table if exists appointments cascade;
drop table if exists workstations cascade;
drop table if exists products cascade;
drop table if exists product_categories cascade;
drop table if exists services cascade;
drop table if exists service_categories cascade;
drop table if exists clients cascade;
drop table if exists profiles cascade;
drop table if exists organizations cascade;

-- Drop existing functions and triggers
drop function if exists update_updated_at_column cascade;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Organizations (Multi-tenant support)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  settings jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles (Staff members and admins)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text not null check (role in ('admin', 'stylist', 'receptionist')),
  avatar_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  address text,
  birth_date date,
  preferences jsonb default '{}',
  notes text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Service Categories
create table service_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, name)
);

-- Services
create table services (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  category_id uuid references service_categories(id) on delete set null,
  name text not null,
  description text,
  duration integer not null, -- in minutes
  price numeric(10,2) not null,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Categories
create table product_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, name)
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  category_id uuid references product_categories(id) on delete set null,
  name text not null,
  description text,
  sku text,
  price numeric(10,2) not null,
  stock integer not null default 0,
  min_stock integer not null default 5,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, sku)
);

-- Workstations
create table workstations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  status text default 'available' check (status in ('available', 'occupied', 'maintenance')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  stylist_id uuid references profiles(id) on delete restrict not null,
  workstation_id uuid references workstations(id) on delete restrict,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointment Services
create table appointment_services (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid references appointments(id) on delete cascade not null,
  service_id uuid references services(id) on delete restrict not null,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sales
create table sales (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  appointment_id uuid references appointments(id) on delete set null,
  staff_id uuid references profiles(id) on delete restrict not null,
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null,
  total numeric(10,2) not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer')),
  status text default 'completed' check (status in ('pending', 'completed', 'refunded')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sale Items
create table sale_items (
  id uuid primary key default uuid_generate_v4(),
  sale_id uuid references sales(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict,
  service_id uuid references services(id) on delete restrict,
  quantity integer not null,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (
    (product_id is not null and service_id is null) or
    (product_id is null and service_id is not null)
  )
);

-- Inventory Transactions
create table inventory_transactions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  type text not null check (type in ('purchase', 'sale', 'adjustment')),
  quantity integer not null,
  reference_id uuid, -- Can reference a sale_id or purchase_id
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;
alter table workstations enable row level security;
alter table appointments enable row level security;
alter table appointment_services enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table inventory_transactions enable row level security;

-- Create policies for each table (example for organizations)
create policy "Users can view their own organization."
  on organizations for select
  using (id in (
    select organization_id from profiles
    where id = auth.uid()
  ));

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_organizations_updated_at
  before update on organizations
  for each row
  execute function update_updated_at_column();

-- Add similar triggers for other tables with updated_at column