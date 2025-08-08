-- API Keys table for ChatGPT integration
CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    last_used DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER NOT NULL DEFAULT 1
    
    -- Foreign key constraint if you have an organizations table
    -- FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Index for fast lookups by organization
CREATE INDEX IF NOT EXISTS idx_api_keys_organization ON api_keys(organization_id);

-- Index for fast authentication lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- Index for active keys
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
