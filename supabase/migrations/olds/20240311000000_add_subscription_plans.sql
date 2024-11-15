-- Drop existing tables if they exist
drop table if exists plans cascade;

-- Create plans table
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

-- Add subscription fields to businesses
alter table businesses 
add column if not exists subscription_id uuid references plans(id),
add column if not exists subscription_status text default 'active' check (subscription_status in ('active', 'past_due', 'canceled')),
add column if not exists subscription_start_date timestamp with time zone,
add column if not exists subscription_end_date timestamp with time zone,
add column if not exists usage_stats jsonb default '{
  "users": 0,
  "clients": 0,
  "appointments": 0,
  "products": 0,
  "services": 0,
  "storage": 0
}'::jsonb;

-- Insert default plans
insert into plans (name, description, price, interval, features, limits) values
(
  'Free',
  'Perfect for trying out Estelia',
  0,
  'monthly',
  '{
    "appointments": true,
    "client_management": true,
    "pos": true,
    "basic_reports": true
  }',
  '{
    "users": 2,
    "clients": 50,
    "appointments": 100,
    "products": 20,
    "services": 10,
    "storage": 100
  }'
),
(
  'Pro',
  'For growing salons',
  2999,
  'monthly',
  '{
    "appointments": true,
    "client_management": true,
    "pos": true,
    "advanced_reports": true,
    "inventory_management": true,
    "marketing_tools": true
  }',
  '{
    "users": 10,
    "clients": 500,
    "appointments": 1000,
    "products": 200,
    "services": 50,
    "storage": 1000
  }'
),
(
  'Enterprise',
  'For large salons and chains',
  9999,
  'monthly',
  '{
    "appointments": true,
    "client_management": true,
    "pos": true,
    "advanced_reports": true,
    "inventory_management": true,
    "marketing_tools": true,
    "api_access": true,
    "priority_support": true,
    "custom_branding": true
  }',
  '{
    "users": null,
    "clients": null,
    "appointments": null,
    "products": null,
    "services": null,
    "storage": null
   }'
);