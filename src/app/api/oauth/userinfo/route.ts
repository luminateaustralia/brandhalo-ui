import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Access tokens from global storage (shared with token endpoint)

// Type-safe global state management
interface GlobalState {
  accessTokens?: Map<string, {
    token: string;
    organizationId: string;
    clientId: string;
    scope: string;
    expiresAt: number;
    refreshToken: string;
  }>;
}

const globalState = globalThis as typeof globalThis & GlobalState;

// GET - OAuth userinfo endpoint
export async function GET(request: NextRequest) {
  console.log('🔐 OAuth userinfo request received');
  
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Missing or invalid Authorization header'
      }, { status: 401 });
    }

    const accessToken = authHeader.substring(7);

    // Validate access token
    const tokenData = globalState.accessTokens?.get(accessToken);
    if (!tokenData) {
      return NextResponse.json({
        error: 'invalid_token',
        error_description: 'Invalid or expired access token'
      }, { status: 401 });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      globalState.accessTokens?.delete(accessToken);
      return NextResponse.json({
        error: 'invalid_token',
        error_description: 'Access token has expired'
      }, { status: 401 });
    }

    // Return user info (minimal for ChatGPT integration)
    return NextResponse.json({
      sub: tokenData.organizationId,
      name: 'BrandHalo User',
      email: `user@${tokenData.organizationId}.brandhalo.com`,
      organization_id: tokenData.organizationId,
      scope: tokenData.scope
    });

  } catch (error) {
    console.error('Error in OAuth userinfo:', error);
    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error'
    }, { status: 500 });
  }
}
