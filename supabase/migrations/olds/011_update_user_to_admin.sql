-- Update existing user to platform admin
update profiles
set 
  user_type = 'platform_admin',
  role = 'admin',
  business_id = null
where email = 'admin@demo-salon.estelia.com';

-- Make sure the user has full access
update auth.users
set raw_user_meta_data = jsonb_build_object(
  'user_type', 'platform_admin',
  'role', 'admin'
)
where email = 'admin@demo-salon.estelia.com';