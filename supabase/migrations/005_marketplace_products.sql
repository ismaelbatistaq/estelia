-- Create marketplace_products table
create table marketplace_products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  brand text not null,
  stock integer not null default 0,
  image_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create business_marketplace_products junction table
create table business_marketplace_products (
  business_id uuid references businesses(id) on delete cascade not null,
  product_id uuid references marketplace_products(id) on delete cascade not null,
  price_override numeric(10,2),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (business_id, product_id)
);

-- Enable RLS
alter table marketplace_products enable row level security;
alter table business_marketplace_products enable row level security;

-- Create policies
create policy "Platform admins can manage marketplace products"
  on marketplace_products for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

create policy "Anyone can view active marketplace products"
  on marketplace_products for select
  using (status = 'active');

create policy "Business users can manage their marketplace products"
  on business_marketplace_products for all
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Create indexes
create index idx_marketplace_products_category on marketplace_products(category);
create index idx_marketplace_products_status on marketplace_products(status);
create index idx_business_marketplace_products_business on business_marketplace_products(business_id);
create index idx_business_marketplace_products_product on business_marketplace_products(product_id);