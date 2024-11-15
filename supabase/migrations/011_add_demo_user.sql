-- Insert demo user for Estelia Demo Salon
do $$
declare
  v_business_id uuid;
begin
  -- Get the demo salon business ID
  select id into v_business_id from businesses where slug = 'demo-salon';

  -- Create demo user account
  insert into auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) values (
    '123e4567-e89b-12d3-a456-426614174010',
    'demo@demo-salon.estelia.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'first_name', 'Demo',
      'last_name', 'User',
      'business_id', v_business_id
    )
  ) on conflict (id) do nothing;

  -- Create demo user profile
  insert into profiles (
    id,
    business_id,
    email,
    first_name,
    last_name,
    role,
    user_type,
    is_owner
  ) values (
    '123e4567-e89b-12d3-a456-426614174010',
    v_business_id,
    'demo@demo-salon.estelia.com',
    'Demo',
    'User',
    'admin',
    'business_user',
    true
  ) on conflict (id) do nothing;

end $$;