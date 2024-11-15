-- Update column names in all related tables
alter table clients
  rename column organization_id to business_id;

alter table services
  rename column organization_id to business_id;

alter table products
  rename column organization_id to business_id;

alter table sales
  rename column organization_id to business_id;

alter table appointments
  rename column organization_id to business_id;

alter table service_categories
  rename column organization_id to business_id;

alter table product_categories
  rename column organization_id to business_id;

-- Update foreign key constraints
alter table clients
  drop constraint if exists clients_organization_id_fkey,
  add constraint clients_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table services
  drop constraint if exists services_organization_id_fkey,
  add constraint services_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table products
  drop constraint if exists products_organization_id_fkey,
  add constraint products_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table sales
  drop constraint if exists sales_organization_id_fkey,
  add constraint sales_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table appointments
  drop constraint if exists appointments_organization_id_fkey,
  add constraint appointments_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table service_categories
  drop constraint if exists service_categories_organization_id_fkey,
  add constraint service_categories_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;

alter table product_categories
  drop constraint if exists product_categories_organization_id_fkey,
  add constraint product_categories_business_id_fkey
  foreign key (business_id)
  references businesses(id)
  on delete cascade;