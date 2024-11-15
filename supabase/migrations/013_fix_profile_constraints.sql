-- Drop existing role check constraint
alter table profiles drop constraint if exists profiles_role_check;

-- Add new role check constraint with all valid roles
alter table profiles
  add constraint profiles_role_check
  check (role in ('admin', 'manager', 'staff', 'stylist', 'receptionist'));

-- Update existing profiles to use valid roles
update profiles
set role = 'admin'
where role not in ('admin', 'manager', 'staff', 'stylist', 'receptionist');