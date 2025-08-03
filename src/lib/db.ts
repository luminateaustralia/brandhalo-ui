import { createClient } from '@libsql/client';
import type { BrandProfile } from '@/types/brand';
import type { BrandVoice } from '@/types/brandVoice';

const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

console.log('🔍 Database client created with URL:', 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io');

// Initialize the brand profiles table
export async function initDatabase() {
  console.log('🔍 Initializing database...');
  
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    const testResult = await client.execute('SELECT 1 as test');
    console.log('🔍 Database connection successful:', testResult);
    
    console.log('🔍 Creating brand_profiles table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS brand_profiles (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL UNIQUE,
        brand_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('🔍 Creating brand_voices table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS brand_voices (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        voice_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create an index on organization_id for faster lookups
    console.log('🔍 Creating indexes...');
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_brand_profiles_org_id 
      ON brand_profiles(organization_id)
    `);
    
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_brand_voices_org_id 
      ON brand_voices(organization_id)
    `);
    
    // Check if table exists and show current records
    const tableCheck = await client.execute('SELECT COUNT(*) as count FROM brand_profiles');
    console.log('✅ Database initialized successfully. Current records:', tableCheck.rows[0]);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Brand Profile CRUD operations
export async function createBrandProfile(organizationId: string, brandData: Partial<BrandProfile>) {
  const id = `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('🔍 Creating brand profile for org:', organizationId);
  console.log('🔍 Brand data:', JSON.stringify(brandData, null, 2));
  
  try {
    const result = await client.execute({
      sql: `
        INSERT INTO brand_profiles (id, organization_id, brand_data, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `,
      args: [id, organizationId, JSON.stringify(brandData)]
    });
    
    console.log('🔍 Database insert result:', result);
    return { id, organizationId, brandData };
  } catch (error) {
    console.error('❌ Error creating brand profile:', error);
    throw error;
  }
}

export async function getBrandProfile(organizationId: string) {
  console.log('🔍 Getting brand profile for org:', organizationId);
  
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM brand_profiles WHERE organization_id = ?',
      args: [organizationId]
    });
    
    console.log('🔍 Database query result:', {
      rowsReturned: result.rows.length,
      columns: result.columns
    });
    
    if (result.rows.length === 0) {
      console.log('🔍 No brand profile found for organization:', organizationId);
      return null;
    }
    
    const row = result.rows[0];
    console.log('🔍 Found brand profile:', { id: row.id, organizationId: row.organization_id });
    
    return {
      id: row.id,
      organizationId: row.organization_id,
      brandData: JSON.parse(row.brand_data as string),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('❌ Error getting brand profile:', error);
    throw error;
  }
}

export async function updateBrandProfile(organizationId: string, brandData: Partial<BrandProfile>) {
  console.log('🔍 Updating brand profile for org:', organizationId);
  console.log('🔍 Update data:', JSON.stringify(brandData, null, 2));
  
  try {
    const result = await client.execute({
      sql: `
        UPDATE brand_profiles 
        SET brand_data = ?, updated_at = datetime('now')
        WHERE organization_id = ?
      `,
      args: [JSON.stringify(brandData), organizationId]
    });
    
    console.log('🔍 Database update result:', result);
    console.log('🔍 Rows affected:', result.rowsAffected);
    
    return { organizationId, brandData };
  } catch (error) {
    console.error('❌ Error updating brand profile:', error);
    throw error;
  }
}

export async function deleteBrandProfile(organizationId: string) {
  try {
    await client.execute({
      sql: 'DELETE FROM brand_profiles WHERE organization_id = ?',
      args: [organizationId]
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting brand profile:', error);
    throw error;
  }
}

// Brand Voice CRUD operations
export async function createBrandVoice(organizationId: string, voiceData: Partial<BrandVoice>) {
  const id = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('🔍 Creating brand voice for org:', organizationId);
  console.log('🔍 Voice data:', JSON.stringify(voiceData, null, 2));
  
  try {
    const result = await client.execute({
      sql: `
        INSERT INTO brand_voices (id, organization_id, voice_data, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `,
      args: [id, organizationId, JSON.stringify(voiceData)]
    });
    
    console.log('🔍 Database insert result:', result);
    return { id, organizationId, voiceData };
  } catch (error) {
    console.error('❌ Error creating brand voice:', error);
    throw error;
  }
}

export async function getBrandVoices(organizationId: string) {
  console.log('🔍 Getting brand voices for org:', organizationId);
  
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM brand_voices WHERE organization_id = ? ORDER BY created_at DESC',
      args: [organizationId]
    });
    
    console.log('🔍 Database query result:', {
      rowsReturned: result.rows.length,
      columns: result.columns
    });
    
    return result.rows.map(row => ({
      id: row.id,
      organizationId: row.organization_id,
      voiceData: JSON.parse(row.voice_data as string),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('❌ Error getting brand voices:', error);
    throw error;
  }
}

export async function updateBrandVoice(id: string, voiceData: Partial<BrandVoice>) {
  console.log('🔍 Updating brand voice:', id);
  console.log('🔍 Update data:', JSON.stringify(voiceData, null, 2));
  
  try {
    const result = await client.execute({
      sql: `
        UPDATE brand_voices 
        SET voice_data = ?, updated_at = datetime('now')
        WHERE id = ?
      `,
      args: [JSON.stringify(voiceData), id]
    });
    
    console.log('🔍 Database update result:', result);
    console.log('🔍 Rows affected:', result.rowsAffected);
    
    return { id, voiceData };
  } catch (error) {
    console.error('❌ Error updating brand voice:', error);
    throw error;
  }
}

export async function deleteBrandVoice(id: string) {
  try {
    await client.execute({
      sql: 'DELETE FROM brand_voices WHERE id = ?',
      args: [id]
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting brand voice:', error);
    throw error;
  }
}

// Test function to verify database connectivity
export async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  try {
    const result = await client.execute('SELECT datetime("now") as current_time');
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

export { client };