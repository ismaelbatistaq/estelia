-- First, ensure the foreign key constraint is updated
alter table profiles
  drop constraint if exists profiles_organization_id_fkey,
  drop constraint if exists profiles_business_id_fkey;

alter table profiles
  add constraint profiles_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

-- Insert test business
insert into businesses (id, name, slug, settings) values (
  '123e4567-e89b-12d3-a456-426614174000',
  'Estelia Demo Salon',
  'demo-salon',
  '{
    "address": "Calle Principal #123, Santo Domingo",
    "phone": "809-555-0100",
    "email": "info@demo-salon.estelia.com",
    "schedule": {
      "monday": { "open": "08:00", "close": "20:00" },
      "tuesday": { "open": "08:00", "close": "20:00" },
      "wednesday": { "open": "08:00", "close": "20:00" },
      "thursday": { "open": "08:00", "close": "20:00" },
      "friday": { "open": "08:00", "close": "20:00" },
      "saturday": { "open": "09:00", "close": "18:00" },
      "sunday": { "open": null, "close": null }
    }
  }'
);

-- Insert test roles
insert into roles (id, business_id, name, permissions) 
select 
  '123e4567-e89b-12d3-a456-426614174001',
  id,
  'Admin',
  '{
    "clients": { "create": true, "read": true, "update": true, "delete": true },
    "appointments": { "create": true, "read": true, "update": true, "delete": true },
    "services": { "create": true, "read": true, "update": true, "delete": true },
    "products": { "create": true, "read": true, "update": true, "delete": true },
    "sales": { "create": true, "read": true, "update": true, "delete": true },
    "reports": { "view": true },
    "settings": { "manage": true }
  }'
from businesses
where slug = 'demo-salon';

insert into roles (id, business_id, name, permissions)
select 
  '123e4567-e89b-12d3-a456-426614174002',
  id,
  'Stylist',
  '{
    "clients": { "create": true, "read": true, "update": true, "delete": false },
    "appointments": { "create": true, "read": true, "update": true, "delete": false },
    "services": { "read": true },
    "products": { "read": true },
    "sales": { "create": true, "read": true }
  }'
from businesses
where slug = 'demo-salon';

-- Insert test profiles
insert into profiles (id, business_id, email, first_name, last_name, role, user_type, is_owner)
select
  '123e4567-e89b-12d3-a456-426614174003',
  id,
  'admin@demo-salon.estelia.com',
  'Admin',
  'Demo',
  'admin',
  'business_user',
  true
from businesses
where slug = 'demo-salon';

insert into profiles (id, business_id, email, first_name, last_name, role, user_type, is_owner)
select
  '123e4567-e89b-12d3-a456-426614174004',
  id,
  'ana@demo-salon.estelia.com',
  'Ana',
  'Gómez',
  'stylist',
  'business_user',
  false
from businesses
where slug = 'demo-salon';

insert into profiles (id, business_id, email, first_name, last_name, role, user_type, is_owner)
select
  '123e4567-e89b-12d3-a456-426614174005',
  id,
  'carmen@demo-salon.estelia.com',
  'Carmen',
  'Santos',
  'stylist',
  'business_user',
  false
from businesses
where slug = 'demo-salon';

-- Assign roles to users
insert into user_roles (user_id, role_id)
select p.id, r.id
from profiles p
cross join roles r
where p.email = 'admin@demo-salon.estelia.com'
and r.name = 'Admin';

insert into user_roles (user_id, role_id)
select p.id, r.id
from profiles p
cross join roles r
where p.email in ('ana@demo-salon.estelia.com', 'carmen@demo-salon.estelia.com')
and r.name = 'Stylist';

-- Insert test clients
insert into clients (business_id, first_name, last_name, email, phone, preferences)
select
  id,
  'María',
  'Pérez',
  'maria@email.com',
  '809-555-0101',
  '{
    "preferred_stylist": "123e4567-e89b-12d3-a456-426614174004",
    "allergies": [],
    "notes": "Prefiere productos sin sulfatos"
  }'
from businesses
where slug = 'demo-salon';

insert into clients (business_id, first_name, last_name, email, phone, preferences)
select
  id,
  'Laura',
  'Díaz',
  'laura@email.com',
  '809-555-0102',
  '{
    "preferred_stylist": "123e4567-e89b-12d3-a456-426614174005",
    "allergies": ["tintes con parafenilendiamina"],
    "notes": "Sensibilidad en el cuero cabelludo"
  }'
from businesses
where slug = 'demo-salon';

-- Insert test service categories
insert into service_categories (business_id, name, description)
select
  id,
  'Corte y Peinado',
  'Servicios de corte y peinado profesional'
from businesses
where slug = 'demo-salon';

insert into service_categories (business_id, name, description)
select
  id,
  'Color',
  'Servicios de coloración y mechas'
from businesses
where slug = 'demo-salon';

-- Insert test services
insert into services (business_id, category_id, name, description, duration, price) 
select 
  sc.business_id,
  sc.id,
  'Corte y Peinado',
  'Corte de cabello profesional y peinado',
  45,
  800
from service_categories sc
join businesses b on b.id = sc.business_id
where sc.name = 'Corte y Peinado' 
and b.slug = 'demo-salon';

insert into services (business_id, category_id, name, description, duration, price)
select
  sc.business_id,
  sc.id,
  'Tinte',
  'Tinte profesional con productos de alta calidad',
  120,
  2500
from service_categories sc
join businesses b on b.id = sc.business_id
where sc.name = 'Color'
and b.slug = 'demo-salon';

-- Insert test product categories
insert into product_categories (business_id, name, description)
select
  id,
  'Shampoo',
  'Shampoos profesionales'
from businesses
where slug = 'demo-salon';

insert into product_categories (business_id, name, description)
select
  id,
  'Tratamientos',
  'Tratamientos capilares'
from businesses
where slug = 'demo-salon';

-- Insert test products
insert into products (business_id, category_id, name, description, sku, price, stock)
select
  pc.business_id,
  pc.id,
  'Shampoo Premium',
  'Shampoo profesional para todo tipo de cabello',
  'SH001',
  450,
  25
from product_categories pc
join businesses b on b.id = pc.business_id
where pc.name = 'Shampoo'
and b.slug = 'demo-salon';

insert into products (business_id, category_id, name, description, sku, price, stock)
select
  pc.business_id,
  pc.id,
  'Tratamiento Capilar',
  'Tratamiento reparador intensivo',
  'TR001',
  1200,
  15
from product_categories pc
join businesses b on b.id = pc.business_id
where pc.name = 'Tratamientos'
and b.slug = 'demo-salon';