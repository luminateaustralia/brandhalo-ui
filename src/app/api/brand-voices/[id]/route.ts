import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  updateBrandVoice, 
  deleteBrandVoice,
  initDatabase
} from '@/lib/db';
import { BrandVoiceFormData } from '@/types/brandVoice';

// PUT - Update existing brand voice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 Brand Voice API PUT route called for ID:', id);
  try {
    // Ensure database is initialized
    await initDatabase();
    
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

    const voiceData: BrandVoiceFormData = await request.json();
    
    // Validate that required fields are present
    if (!voiceData.name || !voiceData.jobTitle || !voiceData.email) {
      return NextResponse.json({ error: 'Name, job title, and email are required' }, { status: 400 });
    }

    // Add updated timestamp
    const completeVoiceData = {
      ...voiceData,
      id: id,
      updatedAt: new Date().toISOString()
    };

    const result = await updateBrandVoice(id, completeVoiceData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating brand voice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete brand voice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 Brand Voice API DELETE route called for ID:', id);
  try {
    // Ensure database is initialized
    await initDatabase();
    
    let orgId = null;
    let userId = null;
    try {
      const authResult = await auth();
      orgId = authResult?.orgId;
      userId = authResult?.userId;
      console.log('🔍 DELETE Auth result:', { orgId, userId });
    } catch (error) {
      console.error('🔍 DELETE Auth error:', error);
      throw error;
    }
    
    if (!orgId || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const result = await deleteBrandVoice(id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting brand voice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}