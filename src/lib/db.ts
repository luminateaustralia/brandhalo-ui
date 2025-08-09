import { createClient } from '@libsql/client';
import type { BrandProfile } from '@/types/brand';
import type { BrandVoice } from '@/types/brandVoice';
import type { Persona } from '@/types/persona';

// API Key types
export interface ApiKey {
  id: string;
  organizationId: string;
  keyHash: string;
  name: string;
  lastUsed: string | null;
  createdAt: string;
  isActive: boolean;
}

const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

console.log('🔍 Database client created with URL:', 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io');

// Test database connection
export async function initDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test database connection
    const testResult = await client.execute('SELECT 1 as test');
    console.log('🔍 Database connection successful:', testResult);
    
    // Check if tables exist and show current records
    const tableCheck = await client.execute('SELECT COUNT(*) as count FROM brand_profiles');
    console.log('✅ Database connection verified. Current records:', tableCheck.rows[0]);
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
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

// Persona CRUD operations
export async function createPersona(organizationId: string, personaData: Partial<Persona>) {
  const id = `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('🔍 Creating persona for org:', organizationId);
  console.log('🔍 Persona data:', JSON.stringify(personaData, null, 2));
  
  try {
    await client.execute({
      sql: 'INSERT INTO brand_personas (id, organization_id, persona_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      args: [
        id,
        organizationId,
        JSON.stringify(personaData),
        new Date().toISOString(),
        new Date().toISOString()
      ]
    });
    
    return { id, ...personaData };
  } catch (error) {
    console.error('❌ Error creating persona:', error);
    throw error;
  }
}

export async function getPersonas(organizationId: string) {
  console.log('🔍 Getting personas for org:', organizationId);
  
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM brand_personas WHERE organization_id = ? ORDER BY created_at DESC',
      args: [organizationId]
    });
    
    console.log('🔍 Raw personas result:', result);
    
    return result.rows.map(row => ({
      id: row.id as string,
      organizationId: row.organization_id as string,
      personaData: typeof row.persona_data === 'string' ? JSON.parse(row.persona_data) : row.persona_data,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    }));
  } catch (error) {
    console.error('❌ Error getting personas:', error);
    throw error;
  }
}

export async function getPersona(id: string) {
  console.log('🔍 Getting persona with id:', id);
  
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM brand_personas WHERE id = ?',
      args: [id]
    });
    
    console.log('🔍 Raw persona result:', result);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id as string,
      organizationId: row.organization_id as string,
      personaData: typeof row.persona_data === 'string' ? JSON.parse(row.persona_data) : row.persona_data,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    };
  } catch (error) {
    console.error('❌ Error getting persona:', error);
    throw error;
  }
}

export async function updatePersona(id: string, personaData: Partial<Persona>) {
  console.log('🔍 Updating persona:', id);
  console.log('🔍 Update data:', JSON.stringify(personaData, null, 2));
  
  try {
    await client.execute({
      sql: 'UPDATE brand_personas SET persona_data = ?, updated_at = ? WHERE id = ?',
      args: [
        JSON.stringify(personaData),
        new Date().toISOString(),
        id
      ]
    });
    
    return { id, ...personaData };
  } catch (error) {
    console.error('❌ Error updating persona:', error);
    throw error;
  }
}

export async function deletePersona(id: string) {
  try {
    await client.execute({
      sql: 'DELETE FROM brand_personas WHERE id = ?',
      args: [id]
    });
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting persona:', error);
    throw error;
  }
}

export async function deleteAllPersonas(organizationId: string) {
  console.log('🗑️ Deleting all personas for org:', organizationId);
  
  try {
    const result = await client.execute({
      sql: 'DELETE FROM brand_personas WHERE organization_id = ?',
      args: [organizationId]
    });
    
    console.log('🗑️ Deleted personas result:', result);
    
    return { 
      success: true, 
      deletedCount: result.rowsAffected || 0 
    };
  } catch (error) {
    console.error('❌ Error deleting all personas:', error);
    throw error;
  }
}

// API Key management functions
export async function saveApiKey(apiKey: ApiKey) {
  try {
    await client.execute({
      sql: `
        INSERT INTO api_keys (id, organization_id, key_hash, name, last_used, created_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        apiKey.id,
        apiKey.organizationId,
        apiKey.keyHash,
        apiKey.name,
        apiKey.lastUsed,
        apiKey.createdAt,
        apiKey.isActive ? 1 : 0
      ]
    });
    
    console.log('✅ API key saved successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving API key:', error);
    throw error;
  }
}

export async function getApiKeys(organizationId: string): Promise<Omit<ApiKey, 'keyHash'>[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT id, organization_id, name, last_used, created_at, is_active FROM api_keys WHERE organization_id = ? ORDER BY created_at DESC',
      args: [organizationId]
    });
    
    return result.rows.map(row => ({
      id: row.id as string,
      organizationId: row.organization_id as string,
      name: row.name as string,
      lastUsed: row.last_used as string | null,
      createdAt: row.created_at as string,
      isActive: Boolean(row.is_active)
    }));
  } catch (error) {
    console.error('❌ Error fetching API keys:', error);
    throw error;
  }
}

export async function validateApiKey(keyHash: string): Promise<string | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT organization_id FROM api_keys WHERE key_hash = ? AND is_active = 1',
      args: [keyHash]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0].organization_id as string;
  } catch (error) {
    console.error('❌ Error validating API key:', error);
    return null;
  }
}

export async function updateApiKeyLastUsed(keyHash: string) {
  try {
    await client.execute({
      sql: 'UPDATE api_keys SET last_used = datetime("now") WHERE key_hash = ?',
      args: [keyHash]
    });
  } catch (error) {
    console.error('❌ Error updating API key last used:', error);
    // Don't throw here as this is not critical
  }
}

export async function revokeApiKey(keyId: string, organizationId: string) {
  try {
    const result = await client.execute({
      sql: 'UPDATE api_keys SET is_active = 0 WHERE id = ? AND organization_id = ?',
      args: [keyId, organizationId]
    });
    
    if (result.rowsAffected === 0) {
      throw new Error('API key not found or access denied');
    }
    
    console.log('✅ API key revoked successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error revoking API key:', error);
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