import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { initDatabase } from '@/lib/db';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// GET - Retrieve all customers
export async function GET() {
  console.log('🔍 Customers API GET route called');
  try {
    const authResult = await auth();
    console.log('🔍 Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId });
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return empty array since this might be a placeholder endpoint
    // You can implement actual customer fetching logic here
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}