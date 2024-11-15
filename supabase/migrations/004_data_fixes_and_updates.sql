-- Insert default subscription plans
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

-- Insert demo business
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

-- Insert demo roles
insert into roles (id, business_id, name, permissions) values
(
  '123e4567-e89b-12d3-a456-426614174001',
  '123e4567-e89b-12d3-a456-426614174000',
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
),
(
  '123e4567-e89b-12d3-a456-426614174002',
  '123e4567-e89b-12d3-a456-426614174000',
  'Stylist',
  '{
    "clients": { "create": true, "read": true, "update": true, "delete": false },
    "appointments": { "create": true, "read": true, "update": true, "delete": false },
    "services": { "read": true },
    "products": { "read": true },
    "sales": { "create": true, "read": true }
  }'
);

-- Insert demo profiles
insert into profiles (id, business_id, email, first_name, last_name, role, user_type, is_owner) values
(
  '123e4567-e89b-12d3-a456-426614174003',
  '123e4567-e89b-12d3-a456-426614174000',
  'admin@demo-salon.estelia.com',
  'Admin',
  'Demo',
  'admin',
  'business_user',
  true
),
(
  '123e4567-e89b-12d3-a456-426614174004',
  '123e4567-e89b-12d3-a456-426614174000',
  'ana@demo-salon.estelia.com',
  'Ana',
  'Gómez',
  'stylist',
  'business_user',
  false
),
(
  '123e4567-e89b-12d3-a456-426614174005',
  '123e4567-e89b-12d3-a456-426614174000',
  'carmen@demo-salon.estelia.com',
  'Carmen',
  'Santos',
  'stylist',
  'business_user',
  false
);

-- Assign roles to users
insert into user_roles (user_id, role_id) values
('123e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174001'),
('123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174002'),
('123e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174002');

-- Create function to get current business_id
create or replace function get_current_business_id()
returns uuid as $$
begin
  return (
    select business_id
    from profiles
    where id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer;

-- Create trigger for updated_at columns
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
do $$
declare
  t text;
begin
  for t in (
    select table_name 
    from information_schema.columns 
    where column_name = 'updated_at' 
    and table_schema = 'public'
  )
  loop
    execute format('
      create trigger update_%I_updated_at
        before update on %I
        for each row
        execute function update_updated_at_column();
    ', t, t);
  end loop;
end $$;