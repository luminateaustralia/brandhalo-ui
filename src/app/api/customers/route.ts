import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { initDatabase } from '@/lib/db';
import { createClient } from '@libsql/client';

// Database client
const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

// SECURITY: Get customers filtered by organization ID
async function getCustomersForOrganization(orgId: string) {
  console.log('🔍 Getting customers for org:', orgId);
  
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM customers WHERE clerk_organisation_id = ?',
      args: [orgId]
    });
    
    console.log('🔍 Found customers:', result.rows.length);
    
    return result.rows.map(row => ({
      id: row.id,
      organisationName: row.organisation_name,
      customerId: row.clerk_organisation_id,
      brands: row.brands ? JSON.parse(row.brands as string) : [],
      url: row.url,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('❌ Error getting customers for organization:', error);
    throw error;
  }
}

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// GET - Retrieve customers for the current organization ONLY
export async function GET() {
  console.log('🔍 Customers API GET route called');
  try {
    const authResult = await auth();
    console.log('🔍 Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId });
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authResult?.orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    // SECURITY: Only return customers for the authenticated user's organization
    const customers = await getCustomersForOrganization(authResult.orgId);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}