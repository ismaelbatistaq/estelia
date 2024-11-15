-- Insert root categories
insert into marketplace_categories (name, description, slug, status) values
('Hair Care', 'Professional hair care products', 'hair-care', 'active'),
('Skin Care', 'Professional skin care products', 'skin-care', 'active'),
('Nail Care', 'Professional nail care products', 'nail-care', 'active'),
('Tools & Equipment', 'Professional salon tools and equipment', 'tools-equipment', 'active');

-- Insert subcategories for Hair Care
with hair_care as (
  select id from marketplace_categories where slug = 'hair-care'
)
insert into marketplace_categories (name, description, slug, parent_id, status)
select
  name,
  description,
  slug,
  hair_care.id,
  'active'
from hair_care,
(values
  ('Shampoo', 'Professional shampoos', 'shampoo'),
  ('Conditioner', 'Professional conditioners', 'conditioner'),
  ('Treatments', 'Hair treatments and masks', 'treatments'),
  ('Styling', 'Hair styling products', 'styling'),
  ('Color', 'Hair color products', 'color')
) as subcategories(name, description, slug);

-- Insert subcategories for Tools & Equipment
with tools as (
  select id from marketplace_categories where slug = 'tools-equipment'
)
insert into marketplace_categories (name, description, slug, parent_id, status)
select
  name,
  description,
  slug,
  tools.id,
  'active'
from tools,
(values
  ('Dryers', 'Professional hair dryers', 'dryers'),
  ('Styling Tools', 'Professional styling tools', 'styling-tools'),
  ('Scissors', 'Professional scissors', 'scissors'),
  ('Chairs & Furniture', 'Salon furniture', 'furniture'),
  ('Accessories', 'Professional accessories', 'accessories')
) as subcategories(name, description, slug);

-- Update existing products with categories
update marketplace_products
set category_id = (
  select id from marketplace_categories 
  where slug = 'shampoo'
)
where category = 'hair' 
and name ilike '%shampoo%';

update marketplace_products
set category_id = (
  select id from marketplace_categories 
  where slug = 'styling-tools'
)
where category = 'tools';