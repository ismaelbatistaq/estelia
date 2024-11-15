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
) on conflict (id) do nothing;

-- Insert test profiles
insert into profiles (id, business_id, email, first_name, last_name, role, user_type, is_owner)
values (
  '123e4567-e89b-12d3-a456-426614174003',
  '123e4567-e89b-12d3-a456-426614174000',
  'admin@demo-salon.estelia.com',
  'Admin',
  'Demo',
  'admin',
  'business_user',
  true
) on conflict (id) do nothing;

-- Insert test service categories
insert into service_categories (business_id, name, description)
values (
  '123e4567-e89b-12d3-a456-426614174000',
  'Corte y Peinado',
  'Servicios de corte y peinado profesional'
) on conflict (business_id, name) do nothing;

-- Insert test services
insert into services (business_id, category_id, name, description, duration, price)
select
  '123e4567-e89b-12d3-a456-426614174000',
  id,
  'Corte y Peinado',
  'Corte de cabello profesional y peinado',
  45,
  800
from service_categories
where business_id = '123e4567-e89b-12d3-a456-426614174000'
and name = 'Corte y Peinado';

-- Insert test product categories
insert into product_categories (business_id, name, description)
values (
  '123e4567-e89b-12d3-a456-426614174000',
  'Shampoo',
  'Shampoos profesionales'
) on conflict (business_id, name) do nothing;

-- Insert test products
insert into products (business_id, category_id, name, description, sku, price, stock)
select
  '123e4567-e89b-12d3-a456-426614174000',
  id,
  'Shampoo Premium',
  'Shampoo profesional para todo tipo de cabello',
  'SH001',
  450,
  25
from product_categories
where business_id = '123e4567-e89b-12d3-a456-426614174000'
and name = 'Shampoo';