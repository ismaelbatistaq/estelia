-- First drop the view that depends on user_type
drop view if exists extended_profiles;

-- Drop policies that depend on user_type
drop policy if exists "Platform admins can manage marketplace products" on marketplace_products;
drop policy if exists "Platform admins can manage all orders" on marketplace_orders;
drop policy if exists "Platform admins can manage all order items" on marketplace_order_items;
drop policy if exists "Platform admins can manage all status history" on marketplace_order_status_history;
drop policy if exists "Platform admins can manage categories" on marketplace_categories;

-- Now we can safely alter the user_type column
alter table profiles alter column user_type type user_type using user_type::text::user_type;

-- Recreate the view
create view extended_profiles as
select 
  p.*,
  b.name as business_name,
  b.slug as business_slug,
  b.settings as business_settings
from profiles p
left join businesses b on p.business_id = b.id;

-- Recreate the policies with the correct type
create policy "Platform admins can manage marketplace products"
  on marketplace_products for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all orders"
  on marketplace_orders for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all order items"
  on marketplace_order_items for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage all status history"
  on marketplace_order_status_history for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Platform admins can manage categories"
  on marketplace_categories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );