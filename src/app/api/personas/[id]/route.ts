import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  updatePersona, 
  deletePersona, 
  getPersona,
  initDatabase 
} from '@/lib/db';
import { PersonaFormData } from '@/types/persona';

export const runtime = 'edge';

// PUT - Update existing persona
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 Persona API PUT route called for ID:', id);
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

    const personaData: PersonaFormData = await request.json();
    
    // Validate that required fields are present
    if (!personaData.name || !personaData.occupation || !personaData.age) {
      return NextResponse.json({ error: 'Name, occupation, and age are required' }, { status: 400 });
    }

    // Check if persona exists and belongs to the user's organization
    const existingPersona = await getPersona(id);
    if (!existingPersona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    if (existingPersona.organizationId !== orgId) {
      return NextResponse.json({ error: 'Unauthorized - persona does not belong to your organization' }, { status: 403 });
    }

    // Add updated timestamp
    const completePersonaData = {
      ...personaData,
      id: id,
      updatedAt: new Date().toISOString()
    };

    const result = await updatePersona(id, completePersonaData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete persona
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 Persona API DELETE route called for ID:', id);
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

    // Check if persona exists and belongs to the user's organization
    const existingPersona = await getPersona(id);
    if (!existingPersona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    if (existingPersona.organizationId !== orgId) {
      return NextResponse.json({ error: 'Unauthorized - persona does not belong to your organization' }, { status: 403 });
    }

    const result = await deletePersona(id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting persona:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
