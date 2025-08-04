import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@libsql/client';

export const runtime = 'edge';

// Database client
const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

interface CustomerData {
  organisationName: string;
  clerk_organisation_id: string;
  brands: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  url: string;
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  console.log('🔍 Customer API POST route called');
  try {
    const authResult = await auth();
    console.log('🔍 POST Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId });
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerData: CustomerData = await request.json();
    console.log('🔍 Customer data received:', customerData);
    
    // Validate required fields
    if (!customerData.organisationName || !customerData.clerk_organisation_id) {
      return NextResponse.json({ 
        error: 'Organisation name and Clerk organisation ID are required' 
      }, { status: 400 });
    }

    // Generate unique customer ID
    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if customer already exists for this Clerk org
      const existingCustomer = await client.execute({
        sql: 'SELECT id FROM customers WHERE clerk_organisation_id = ?',
        args: [customerData.clerk_organisation_id]
      });

      if (existingCustomer.rows.length > 0) {
        console.log('🔍 Customer already exists for Clerk org:', customerData.clerk_organisation_id);
        return NextResponse.json({ 
          error: 'Customer already exists for this organization',
          id: existingCustomer.rows[0].id 
        }, { status: 409 });
      }

      // Create the customer record
      const result = await client.execute({
        sql: `
          INSERT INTO customers (id, organisation_name, clerk_organisation_id, brands, url, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `,
        args: [
          customerId,
          customerData.organisationName,
          customerData.clerk_organisation_id,
          JSON.stringify(customerData.brands),
          customerData.url
        ]
      });
      
      console.log('🔍 Database insert result:', result);
      
      const response = {
        id: customerId,
        organisationName: customerData.organisationName,
        customerId: customerData.clerk_organisation_id,
        brands: customerData.brands,
        url: customerData.url
      };
      
      return NextResponse.json(response, { status: 201 });
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      
      // Handle table doesn't exist error
      if (dbError instanceof Error && dbError.message.includes('no such table')) {
        console.log('🔍 Creating customers table...');
        
        // Create the customers table
        await client.execute(`
          CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            organisation_name TEXT NOT NULL,
            clerk_organisation_id TEXT UNIQUE NOT NULL,
            brands TEXT,
            url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Try the insert again
        const retryResult = await client.execute({
          sql: `
            INSERT INTO customers (id, organisation_name, clerk_organisation_id, brands, url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `,
          args: [
            customerId,
            customerData.organisationName,
            customerData.clerk_organisation_id,
            JSON.stringify(customerData.brands),
            customerData.url
          ]
        });
        
        console.log('🔍 Retry insert result:', retryResult);
        
        const response = {
          id: customerId,
          organisationName: customerData.organisationName,
          customerId: customerData.clerk_organisation_id,
          brands: customerData.brands,
          url: customerData.url
        };
        
        return NextResponse.json(response, { status: 201 });
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}