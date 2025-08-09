import { NextRequest, NextResponse } from 'next/server';
import { getPersonas, initDatabase } from '@/lib/db';
import { validateOAuthToken } from '@/lib/oauth';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// GET - Retrieve brand personas using OAuth token
export async function GET(request: NextRequest) {
  console.log('🤖 ChatGPT Personas API called');

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'Missing or invalid Authorization header. Expected: Bearer <token>'
      }, { status: 401 });
    }

    const organizationId = await validateOAuthToken(authHeader);
    if (!organizationId) {
      return NextResponse.json({
        error: 'Invalid or expired access token'
      }, { status: 401 });
    }

    console.log('🤖 Valid token for organization (personas):', organizationId);

    const personasEntities = await getPersonas(organizationId);
    const personas = personasEntities.map((p) => p.personaData);

    return NextResponse.json(personas);
  } catch (error) {
    console.error('Error in ChatGPT personas API:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}


