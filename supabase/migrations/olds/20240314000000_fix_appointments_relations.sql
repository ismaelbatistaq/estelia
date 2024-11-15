-- Drop existing constraints if they exist
alter table appointments 
  drop constraint if exists appointments_service_id_fkey,
  drop constraint if exists appointments_stylist_id_fkey,
  drop constraint if exists appointments_client_id_fkey;

-- Update appointments table structure
alter table appointments
  add column if not exists business_id uuid references businesses(id) on delete cascade,
  add column if not exists start_time timestamp with time zone,
  add column if not exists end_time timestamp with time zone,
  add column if not exists status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'));

-- Add foreign key constraints
alter table appointments
  add constraint appointments_client_id_fkey 
    foreign key (client_id) references clients(id) on delete restrict,
  add constraint appointments_stylist_id_fkey 
    foreign key (stylist_id) references profiles(id) on delete restrict;

-- Create appointment_services junction table if it doesn't exist
create table if not exists appointment_services (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid references appointments(id) on delete cascade not null,
  service_id uuid references services(id) on delete restrict not null,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better performance
create index if not exists idx_appointments_business_id on appointments(business_id);
create index if not exists idx_appointments_client_id on appointments(client_id);
create index if not exists idx_appointments_stylist_id on appointments(stylist_id);
create index if not exists idx_appointment_services_appointment_id on appointment_services(appointment_id);
create index if not exists idx_appointment_services_service_id on appointment_services(service_id);