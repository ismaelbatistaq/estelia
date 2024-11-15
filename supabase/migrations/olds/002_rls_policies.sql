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

-- Business policies
create policy "Anyone can view businesses"
  on businesses for select
  using (true);

create policy "Platform admins can manage businesses"
  on businesses for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'platform_admin'
    )
  );

-- Profile policies
create policy "Anyone can view profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

-- Client policies
create policy "Users can view clients in their business"
  on clients for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Service policies
create policy "Users can view services in their business"
  on services for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Product policies
create policy "Users can view products in their business"
  on products for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Appointment policies
create policy "Users can view appointments in their business"
  on appointments for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Sales policies
create policy "Users can view sales in their business"
  on sales for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Category policies
create policy "Users can view service categories in their business"
  on service_categories for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can view product categories in their business"
  on product_categories for select
  using (
    business_id in (
      select business_id from profiles
      where profiles.id = auth.uid()
    )
  );

-- Create function to handle new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();