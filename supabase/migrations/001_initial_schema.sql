-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Organizations/Businesses
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  settings jsonb default '{}',
  subscription_id uuid,
  subscription_status text default 'active' check (subscription_status in ('active', 'past_due', 'canceled')),
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  usage_stats jsonb default '{
    "users": 0,
    "clients": 0,
    "appointments": 0,
    "products": 0,
    "services": 0,
    "storage": 0
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscription Plans
create table plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  interval text not null check (interval in ('monthly', 'yearly')),
  features jsonb not null default '{}'::jsonb,
  limits jsonb not null default '{
    "users": null,
    "clients": null,
    "appointments": null,
    "products": null,
    "services": null,
    "storage": null
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add foreign key for subscription
alter table businesses
  add constraint businesses_subscription_id_fkey
  foreign key (subscription_id)
  references plans(id)
  on delete set null;

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
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
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, name)
);

-- Services
create table services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  category_id uuid references service_categories(id) on delete set null,
  name text not null,
  description text,
  duration integer not null,
  price numeric(10,2) not null,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Categories
create table product_categories (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, name)
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
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
  unique(business_id, sku)
);

-- Workstations
create table workstations (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  status text default 'available' check (status in ('available', 'occupied', 'maintenance')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
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
  business_id uuid references businesses(id) on delete cascade not null,
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
  business_id uuid references businesses(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  type text not null check (type in ('purchase', 'sale', 'adjustment')),
  quantity integer not null,
  reference_id uuid,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_clients_business_id on clients(business_id);
create index idx_services_business_id on services(business_id);
create index idx_products_business_id on products(business_id);
create index idx_appointments_business_id on appointments(business_id);
create index idx_sales_business_id on sales(business_id);
create index idx_inventory_transactions_business_id on inventory_transactions(business_id);
create index idx_appointments_client_id on appointments(client_id);
create index idx_appointments_stylist_id on appointments(stylist_id);
create index idx_appointment_services_appointment_id on appointment_services(appointment_id);
create index idx_appointment_services_service_id on appointment_services(service_id);