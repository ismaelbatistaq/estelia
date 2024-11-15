-- Create marketplace categories table
create table marketplace_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  slug text not null unique,
  parent_id uuid references marketplace_categories(id),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create marketplace orders table
create table marketplace_orders (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete restrict not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  tracking_number text,
  estimated_delivery timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create marketplace order items table
create table marketplace_order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references marketplace_orders(id) on delete cascade not null,
  product_id uuid references marketplace_products(id) on delete restrict not null,
  quantity integer not null,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create marketplace order status history table
create table marketplace_order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references marketplace_orders(id) on delete cascade not null,
  status text not null,
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add category_id to marketplace_products
alter table marketplace_products 
  add column category_id uuid references marketplace_categories(id) on delete restrict;

-- Enable RLS
alter table marketplace_categories enable row level security;
alter table marketplace_orders enable row level security;
alter table marketplace_order_items enable row level security;
alter table marketplace_order_status_history enable row level security;

-- Create policies for marketplace categories
create policy "Platform admins can manage categories"
  on marketplace_categories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Anyone can view active categories"
  on marketplace_categories for select
  using (status = 'active');

-- Create policies for marketplace orders
create policy "Platform admins can view all orders"
  on marketplace_orders for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Business users can view their orders"
  on marketplace_orders for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Business users can create orders"
  on marketplace_orders for insert
  with check (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Create policies for order items
create policy "Platform admins can view all order items"
  on marketplace_order_items for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Business users can view their order items"
  on marketplace_order_items for select
  using (
    order_id in (
      select id from marketplace_orders
      where business_id in (
        select business_id from profiles
        where profiles.id = auth.uid()
      )
    )
  );

create policy "Business users can create order items"
  on marketplace_order_items for insert
  with check (
    order_id in (
      select id from marketplace_orders
      where business_id in (
        select business_id from profiles
        where profiles.id = auth.uid()
      )
    )
  );

-- Create policies for order status history
create policy "Platform admins can manage status history"
  on marketplace_order_status_history for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Business users can view their order status history"
  on marketplace_order_status_history for select
  using (
    order_id in (
      select id from marketplace_orders
      where business_id in (
        select business_id from profiles
        where profiles.id = auth.uid()
      )
    )
  );

-- Create indexes
create index idx_marketplace_categories_parent on marketplace_categories(parent_id);
create index idx_marketplace_categories_status on marketplace_categories(status);
create index idx_marketplace_orders_business on marketplace_orders(business_id);
create index idx_marketplace_orders_status on marketplace_orders(status);
create index idx_marketplace_order_items_order on marketplace_order_items(order_id);
create index idx_marketplace_order_items_product on marketplace_order_items(product_id);
create index idx_marketplace_order_status_history_order on marketplace_order_status_history(order_id);