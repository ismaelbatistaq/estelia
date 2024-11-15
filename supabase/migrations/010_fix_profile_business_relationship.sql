-- Drop existing foreign key if it exists
alter table profiles
  drop constraint if exists profiles_business_id_fkey;

-- Add the correct foreign key constraint
alter table profiles
  add constraint profiles_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

-- Update the profiles view to use the correct join
drop view if exists extended_profiles;
create view extended_profiles as
select 
  p.*,
  b.name as business_name,
  b.slug as business_slug,
  b.settings as business_settings
from profiles p
left join businesses b on p.business_id = b.id;

-- Update the auth user handler to include business relationship
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    business_id
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'business_user')::user_type,
    case 
      when new.raw_user_meta_data->>'business_id' is not null 
      then (new.raw_user_meta_data->>'business_id')::uuid 
      else null
    end
  );
  return new;
end;
$$ language plpgsql security definer;