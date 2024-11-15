-- Drop existing policies
drop policy if exists "Users can view clients in their business" on clients;
drop policy if exists "Users can view services in their business" on services;
drop policy if exists "Users can view products in their business" on products;
drop policy if exists "Users can view appointments in their business" on appointments;
drop policy if exists "Users can view sales in their business" on sales;
drop policy if exists "Users can view service categories in their business" on service_categories;
drop policy if exists "Users can view product categories in their business" on product_categories;

-- Create simpler policies that allow business users to access their data
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