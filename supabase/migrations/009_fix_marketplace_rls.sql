-- Drop existing policies
drop policy if exists "Business users can create orders" on marketplace_orders;
drop policy if exists "Business users can view their orders" on marketplace_orders;
drop policy if exists "Platform admins can view all orders" on marketplace_orders;

-- Create new policies for marketplace orders
create policy "Business users can manage their orders"
  on marketplace_orders for all
  using (
    business_id in (
      select business_id 
      from profiles 
      where profiles.id = auth.uid()
    )
  )
  with check (
    business_id in (
      select business_id 
      from profiles 
      where profiles.id = auth.uid()
    )
  );

create policy "Platform admins can manage all orders"
  on marketplace_orders for all
  using (
    exists (
      select 1 
      from profiles 
      where profiles.id = auth.uid() 
      and profiles.user_type = 'platform_admin'
    )
  );

-- Drop existing policies for order items
drop policy if exists "Business users can create order items" on marketplace_order_items;
drop policy if exists "Business users can view their order items" on marketplace_order_items;
drop policy if exists "Platform admins can view all order items" on marketplace_order_items;

-- Create new policies for order items
create policy "Business users can manage their order items"
  on marketplace_order_items for all
  using (
    order_id in (
      select id 
      from marketplace_orders 
      where business_id in (
        select business_id 
        from profiles 
        where profiles.id = auth.uid()
      )
    )
  )
  with check (
    order_id in (
      select id 
      from marketplace_orders 
      where business_id in (
        select business_id 
        from profiles 
        where profiles.id = auth.uid()
      )
    )
  );

create policy "Platform admins can manage all order items"
  on marketplace_order_items for all
  using (
    exists (
      select 1 
      from profiles 
      where profiles.id = auth.uid() 
      and profiles.user_type = 'platform_admin'
    )
  );

-- Drop existing policies for order status history
drop policy if exists "Business users can view their order status history" on marketplace_order_status_history;
drop policy if exists "Platform admins can manage status history" on marketplace_order_status_history;

-- Create new policies for order status history
create policy "Business users can manage their order status history"
  on marketplace_order_status_history for all
  using (
    order_id in (
      select id 
      from marketplace_orders 
      where business_id in (
        select business_id 
        from profiles 
        where profiles.id = auth.uid()
      )
    )
  )
  with check (
    order_id in (
      select id 
      from marketplace_orders 
      where business_id in (
        select business_id 
        from profiles 
        where profiles.id = auth.uid()
      )
    )
  );

create policy "Platform admins can manage all status history"
  on marketplace_order_status_history for all
  using (
    exists (
      select 1 
      from profiles 
      where profiles.id = auth.uid() 
      and profiles.user_type = 'platform_admin'
    )
  );