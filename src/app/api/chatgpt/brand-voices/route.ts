import { NextRequest, NextResponse } from 'next/server';
import { getBrandVoices, initDatabase } from '@/lib/db';
import { validateOAuthToken } from '@/lib/oauth';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// GET - Retrieve brand voices using OAuth token
export async function GET(request: NextRequest) {
  console.log('🤖 ChatGPT Brand Voices API called');

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

    console.log('🤖 Valid token for organization (brand-voices):', organizationId);

    const voiceEntities = await getBrandVoices(organizationId);
    const voices = voiceEntities.map((v) => v.voiceData);

    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error in ChatGPT brand voices API:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}


