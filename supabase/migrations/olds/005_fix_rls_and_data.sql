-- Drop all existing RLS policies
do $$
declare
  r record;
begin
  for r in (
    select tablename 
    from pg_tables 
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists "Business data access" on %I', r.tablename);
  end loop;
end $$;

-- Enable RLS on all tables
alter table businesses enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table appointments enable row level security;
alter table sales enable row level security;
alter table service_categories enable row level security;
alter table product_categories enable row level security;

-- Create simple policies for all tables
create policy "Allow all access to authenticated users"
  on businesses for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on profiles for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on clients for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on services for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on appointments for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on sales for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on service_categories for all
  using (auth.role() = 'authenticated');

create policy "Allow all access to authenticated users"
  on product_categories for all
  using (auth.role() = 'authenticated');

-- Insert more test data
insert into clients (business_id, first_name, last_name, email, phone)
select 
  b.id,
  'Juan',
  'Pérez',
  'juan@test.com',
  '809-555-0103'
from businesses b
where b.slug = 'demo-salon'
on conflict do nothing;

insert into services (business_id, name, description, duration, price)
select
  b.id,
  'Manicure',
  'Manicure profesional',
  45,
  600
from businesses b
where b.slug = 'demo-salon'
on conflict do nothing;

insert into products (business_id, name, description, sku, price, stock)
select
  b.id,
  'Acondicionador Premium',
  'Acondicionador profesional',
  'AC001',
  400,
  20
from businesses b
where b.slug = 'demo-salon'
on conflict do nothing;

-- Insert test appointments
insert into appointments (business_id, client_id, stylist_id, start_time, end_time, status)
select
  b.id,
  c.id,
  p.id,
  now(),
  now() + interval '1 hour',
  'scheduled'
from 
  businesses b,
  clients c,
  profiles p
where 
  b.slug = 'demo-salon'
  and c.business_id = b.id
  and p.business_id = b.id
limit 1
on conflict do nothing;

-- Insert test sales
insert into sales (business_id, client_id, staff_id, subtotal, tax, total, payment_method)
select
  b.id,
  c.id,
  p.id,
  1000,
  180,
  1180,
  'cash'
from 
  businesses b,
  clients c,
  profiles p
where 
  b.slug = 'demo-salon'
  and c.business_id = b.id
  and p.business_id = b.id
limit 1
on conflict do nothing;