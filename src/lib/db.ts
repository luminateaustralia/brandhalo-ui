import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

// Initialize the brand profiles table
export async function initDatabase() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS brand_profiles (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL UNIQUE,
        brand_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create an index on organization_id for faster lookups
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_brand_profiles_org_id 
      ON brand_profiles(organization_id)
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Brand Profile CRUD operations
export async function createBrandProfile(organizationId: string, brandData: any) {
  const id = `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    await client.execute({
      sql: `
        INSERT INTO brand_profiles (id, organization_id, brand_data, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `,
      args: [id, organizationId, JSON.stringify(brandData)]
    });
    
    return { id, organizationId, brandData };
  } catch (error) {
    console.error('Error creating brand profile:', error);
    throw error;
  }
}

export async function getBrandProfile(organizationId: string) {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM brand_profiles WHERE organization_id = ?',
      args: [organizationId]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      organizationId: row.organization_id,
      brandData: JSON.parse(row.brand_data as string),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('Error getting brand profile:', error);
    throw error;
  }
}

export async function updateBrandProfile(organizationId: string, brandData: any) {
  try {
    await client.execute({
      sql: `
        UPDATE brand_profiles 
        SET brand_data = ?, updated_at = datetime('now')
        WHERE organization_id = ?
      `,
      args: [JSON.stringify(brandData), organizationId]
    });
    
    return { organizationId, brandData };
  } catch (error) {
    console.error('Error updating brand profile:', error);
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

export { client };