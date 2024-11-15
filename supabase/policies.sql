-- Enable RLS on all tables
alter table businesses enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table appointments enable row level security;
alter table sales enable row level security;

-- Businesses Policies
create policy "Users can view their own business"
on businesses for select
using (
  id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

-- Profiles Policies
create policy "Users can view profiles in their business"
on profiles for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Clients Policies
create policy "Users can view clients in their business"
on clients for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

create policy "Users can insert clients in their business"
on clients for insert
with check (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

create policy "Users can update clients in their business"
on clients for update
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

-- Services Policies
create policy "Users can view services in their business"
on services for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

-- Products Policies
create policy "Users can view products in their business"
on products for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

-- Appointments Policies
create policy "Users can view appointments in their business"
on appointments for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);

-- Sales Policies
create policy "Users can view sales in their business"
on sales for select
using (
  business_id in (
    select business_id 
    from profiles 
    where auth.uid() = profiles.id
  )
);