-- Brand Halo Database Indexes
-- This file contains all index creation statements for the Brand Halo application

-- Create index on brand_profiles organization_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_profiles_org_id 
ON brand_profiles(organization_id);

-- Create index on brand_voices organization_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_voices_org_id 
ON brand_voices(organization_id);

-- Create index on customers clerk_organisation_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_org_id 
ON customers(clerk_organisation_id);