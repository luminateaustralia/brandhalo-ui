import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  createBrandProfile, 
  getBrandProfile, 
  updateBrandProfile, 
  deleteBrandProfile,
  initDatabase 
} from '@/lib/db';
import { BrandProfile } from '@/types/brand';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// GET - Retrieve brand profile for the current organization
export async function GET(request: NextRequest) {
  console.log('🔍 Brand API GET route called');
  try {
    const authResult = await auth();
    const searchOrgId = request.nextUrl.searchParams.get('orgId');
    const effectiveOrgId = searchOrgId || authResult?.orgId;
    console.log('🔍 Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId, searchOrgId, effectiveOrgId });

    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!effectiveOrgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    const brandProfile = await getBrandProfile(effectiveOrgId);
    
    if (!brandProfile) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 });
    }

    return NextResponse.json(brandProfile);
  } catch (error) {
    console.error('Error fetching brand profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new brand profile
export async function POST(request: NextRequest) {
  console.log('🔍 Brand API POST route called');
  try {
    let orgId = null;
    let userId = null;
    try {
      const authResult = await auth();
      orgId = authResult?.orgId;
      userId = authResult?.userId;
      console.log('🔍 POST Auth result:', { orgId, userId });
    } catch (error) {
      console.error('🔍 POST Auth error:', error);
      throw error;
    }
    
    if (!orgId || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const brandData: BrandProfile = await request.json();
    
    // Validate that required fields are present
    if (!brandData.companyInfo?.companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Check if brand profile already exists for this organization
    const existingProfile = await getBrandProfile(orgId);
    if (existingProfile) {
      return NextResponse.json({ error: 'Brand profile already exists for this organization' }, { status: 409 });
    }

    const result = await createBrandProfile(orgId, brandData);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating brand profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update existing brand profile
export async function PUT(request: NextRequest) {
  console.log('🔍 Brand API PUT route called');
  try {
    let orgId = null;
    let userId = null;
    try {
      const authResult = await auth();
      orgId = authResult?.orgId;
      userId = authResult?.userId;
      console.log('🔍 PUT Auth result:', { orgId, userId });
    } catch (error) {
      console.error('🔍 PUT Auth error:', error);
      throw error;
    }
    
    if (!orgId || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const brandData: BrandProfile = await request.json();
    
    // Validate that required fields are present
    if (!brandData.companyInfo?.companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Check if brand profile exists
    const existingProfile = await getBrandProfile(orgId);
    if (!existingProfile) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 });
    }

    const result = await updateBrandProfile(orgId, brandData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating brand profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete brand profile
export async function DELETE() {
  try {
    const { orgId, userId } = await auth();
    
    if (!orgId || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if brand profile exists
    const existingProfile = await getBrandProfile(orgId);
    if (!existingProfile) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 });
    }

    const result = await deleteBrandProfile(orgId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting brand profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}