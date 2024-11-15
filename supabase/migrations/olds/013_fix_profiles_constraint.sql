-- Add unique constraint for email in profiles
alter table profiles 
  add constraint profiles_email_unique unique (email);

-- Re-run test data insertion
do $$ 
declare
  v_business_id uuid;
  v_service_category_id uuid;
  v_product_category_id uuid;
begin
  -- Get the demo salon business ID
  select id into v_business_id from businesses where slug = 'demo-salon';

  -- Insert service categories if they don't exist
  insert into service_categories (id, business_id, name, description)
  values (
    uuid_generate_v4(),
    v_business_id,
    'Corte y Peinado',
    'Servicios de corte y peinado profesional'
  ) on conflict (business_id, name) do nothing
  returning id into v_service_category_id;

  -- Insert services
  insert into services (business_id, category_id, name, description, duration, price)
  values
    (v_business_id, v_service_category_id, 'Corte de Cabello', 'Corte profesional', 45, 800),
    (v_business_id, v_service_category_id, 'Peinado', 'Peinado profesional', 30, 600),
    (v_business_id, v_service_category_id, 'Tinte', 'Coloración completa', 120, 2500)
  on conflict do nothing;

  -- Insert product categories if they don't exist
  insert into product_categories (id, business_id, name, description)
  values (
    uuid_generate_v4(),
    v_business_id,
    'Cuidado del Cabello',
    'Productos para el cuidado del cabello'
  ) on conflict (business_id, name) do nothing
  returning id into v_product_category_id;

  -- Insert products
  insert into products (business_id, category_id, name, description, sku, price, stock)
  values
    (v_business_id, v_product_category_id, 'Shampoo Premium', 'Shampoo profesional', 'SH001', 450, 25),
    (v_business_id, v_product_category_id, 'Acondicionador Premium', 'Acondicionador profesional', 'AC001', 400, 20),
    (v_business_id, v_product_category_id, 'Tratamiento Capilar', 'Tratamiento reparador', 'TR001', 800, 15)
  on conflict do nothing;

  -- Insert stylists
  insert into profiles (id, business_id, email, first_name, last_name, role, user_type)
  values
    (uuid_generate_v4(), v_business_id, 'ana@demo-salon.estelia.com', 'Ana', 'Gómez', 'stylist', 'business_user'),
    (uuid_generate_v4(), v_business_id, 'carmen@demo-salon.estelia.com', 'Carmen', 'Santos', 'stylist', 'business_user')
  on conflict (email) do nothing;

end $$;