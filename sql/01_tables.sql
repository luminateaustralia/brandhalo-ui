-- Brand Halo Database Tables
-- This file contains all table creation statements for the Brand Halo application

-- Create brand_profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE,
  brand_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create brand_voices table
CREATE TABLE IF NOT EXISTS brand_voices (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  voice_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create brand_personas table
CREATE TABLE IF NOT EXISTS brand_personas (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  persona_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create sign_ups table for capturing interest registrations
CREATE TABLE IF NOT EXISTS sign_ups (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  signup_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);