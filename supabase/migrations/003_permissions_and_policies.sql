-- Enable RLS on all tables
alter table businesses enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table appointments enable row level security;
alter table sales enable row level security;
alter table service_categories enable row level security;
alter table product_categories enable row level security;
alter table roles enable row level security;
alter table user_roles enable row level security;
alter table inventory_transactions enable row level security;
alter table plans enable row level security;

-- Business policies
create policy "Platform admins can view all businesses"
  on businesses for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'user_type')::text = 'platform_admin'
    )
  );

create policy "Business users can view their own business"
  on businesses for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'business_id')::uuid = businesses.id
    )
  );

-- Profile policies
create policy "Platform admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'user_type')::text = 'platform_admin'
    )
  );

create policy "Business users can view profiles in their business"
  on profiles for select
  using (
    exists (
      select 1 
      from auth.users 
      where auth.users.id = auth.uid() 
      and (auth.users.raw_user_meta_data->>'business_id')::uuid = profiles.business_id
    )
  );

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

-- Business data access policies
create policy "Business data access"
  on clients for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on services for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on products for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on appointments for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on sales for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on service_categories for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on product_categories for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

create policy "Business data access"
  on inventory_transactions for all
  using (
    business_id in (
      select p.business_id 
      from profiles p 
      where p.id = auth.uid()
    )
  );

-- Plans policies
create policy "Anyone can view plans"
  on plans for select
  using (true);

create policy "Only platform admins can manage plans"
  on plans for all
  using (
    exists (
      select 1 
      from profiles 
      where profiles.id = auth.uid() 
      and profiles.user_type = 'platform_admin'
    )
  );