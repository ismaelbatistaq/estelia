-- Insert test marketplace products
insert into marketplace_products (name, description, price, category, brand, stock, image_url, status) values
(
  'Shampoo Profesional',
  'Shampoo profesional para todo tipo de cabello',
  450.00,
  'hair',
  'L''Oréal',
  100,
  'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500',
  'active'
),
(
  'Acondicionador Profesional',
  'Acondicionador profesional para cabello dañado',
  400.00,
  'hair',
  'L''Oréal',
  100,
  'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500',
  'active'
),
(
  'Secador Profesional',
  'Secador de cabello profesional de alto rendimiento',
  4500.00,
  'tools',
  'Babyliss PRO',
  50,
  'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500',
  'active'
),
(
  'Plancha de Cabello',
  'Plancha profesional con control de temperatura',
  3500.00,
  'tools',
  'GHD',
  50,
  'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500',
  'active'
),
(
  'Kit de Tintes',
  'Kit completo de tintes profesionales',
  2800.00,
  'hair',
  'Wella',
  75,
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500',
  'active'
);

-- Insert test business marketplace products
insert into business_marketplace_products (business_id, product_id)
select 
  b.id,
  mp.id
from businesses b
cross join marketplace_products mp
where b.slug = 'demo-salon';