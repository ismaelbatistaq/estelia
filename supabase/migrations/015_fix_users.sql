-- Drop existing policies and views if they exist to prevent conflicts
DROP VIEW IF EXISTS extended_profiles CASCADE;

-- Remove existing policies related to profiles and other tables affected by user_type
DROP POLICY IF EXISTS "Platform admins can manage marketplace products" ON marketplace_products;
DROP POLICY IF EXISTS "Platform admins can manage all orders" ON marketplace_orders;
DROP POLICY IF EXISTS "Platform admins can manage all order items" ON marketplace_order_items;
DROP POLICY IF EXISTS "Platform admins can manage all status history" ON marketplace_order_status_history;
DROP POLICY IF EXISTS "Platform admins can manage categories" ON marketplace_categories;
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Platform agents can view assigned business profiles" ON profiles;
DROP POLICY IF EXISTS "Business users can view profiles in their business" ON profiles;

-- Step 1: Back up existing profiles data into a temporary table for migration
DROP TABLE IF EXISTS profiles_temp CASCADE;
CREATE TABLE profiles_temp AS
SELECT 
    id,
    email,
    first_name,
    last_name,
    COALESCE(user_type::TEXT, 'business_user') AS user_type,
    business_id,
    COALESCE(role::TEXT, 'staff') AS role,
    NULL::TEXT AS platform_role,  -- Add platform_role as NULL initially
    COALESCE(is_owner, FALSE) AS is_owner,
    COALESCE(status, 'active') AS status,
    COALESCE(created_at, NOW()) AS created_at,
    COALESCE(updated_at, NOW()) AS updated_at
FROM profiles;

-- Step 2: Drop triggers and functions that may conflict with the new schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_user_claims() CASCADE;

-- Step 3: Drop and recreate user_type and business_role enums
DROP TYPE IF EXISTS user_type CASCADE;
CREATE TYPE user_type AS ENUM ('platform_admin', 'platform_agent', 'business_user');

DROP TYPE IF EXISTS business_role CASCADE;
CREATE TYPE business_role AS ENUM ('owner', 'admin', 'manager', 'staff', 'stylist', 'receptionist');

-- Step 4: Drop the existing profiles table and recreate it without constraints for development purposes
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    user_type user_type NOT NULL DEFAULT 'business_user',
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    role business_role,
    platform_role TEXT,
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 5: Migrate data from profiles_temp to the new profiles structure without type conversions
INSERT INTO profiles (id, email, first_name, last_name, user_type, business_id, role, platform_role, is_owner, status, created_at, updated_at)
SELECT 
    id,
    email,
    first_name,
    last_name,
    user_type::user_type,
    business_id,
    role::business_role,
    platform_role,  -- This will remain NULL for now
    is_owner,
    status,
    created_at,
    updated_at
FROM profiles_temp;

-- Step 6: Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Step 7: Recreate the extended_profiles view to integrate business information with profiles
CREATE VIEW extended_profiles AS
SELECT 
    p.*,
    b.name AS business_name,
    b.slug AS business_slug,
    b.settings AS business_settings
FROM profiles p
LEFT JOIN businesses b ON p.business_id = b.id;

-- Clean up temporary table after migration
DROP TABLE IF EXISTS profiles_temp CASCADE;
