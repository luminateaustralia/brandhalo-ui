import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

// Generate a secure authorization code using Web Crypto API
function generateAuthCode(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}



// Store authorization codes temporarily (in production, use Redis or database)
const authCodes = new Map<string, {
  code: string;
  organizationId: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  expiresAt: number;
}>();

// GET - OAuth authorization endpoint
export async function GET(request: NextRequest) {
  console.log('🔐 OAuth authorization request received');
  
  try {
    const url = new URL(request.url);
    const responseType = url.searchParams.get('response_type');
    const clientId = url.searchParams.get('client_id');
    const redirectUri = url.searchParams.get('redirect_uri');
    const scope = url.searchParams.get('scope') || 'brand:read';
    const state = url.searchParams.get('state');

    // Validate OAuth parameters
    if (responseType !== 'code') {
      const errorUrl = new URL(redirectUri || 'https://chatgpt.com');
      errorUrl.searchParams.set('error', 'unsupported_response_type');
      errorUrl.searchParams.set('error_description', 'Only authorization code flow is supported');
      if (state) errorUrl.searchParams.set('state', state);
      return NextResponse.redirect(errorUrl);
    }

    if (!clientId || !redirectUri) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Missing required parameters: client_id and redirect_uri'
      }, { status: 400 });
    }

    // Validate client (accept ChatGPT, OpenAI, and development clients)
    const validClientPatterns = [
      'chatgpt',
      'openai', 
      'gpt',
      'mcp',
      'connector',
      'dev',
      'test'
    ];
    
    const isValidClient = validClientPatterns.some(pattern => 
      clientId.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!isValidClient) {
      console.log(`Invalid client_id: ${clientId}`);
      const errorUrl = new URL(redirectUri);
      errorUrl.searchParams.set('error', 'invalid_client');
      errorUrl.searchParams.set('error_description', 'Invalid client_id');
      if (state) errorUrl.searchParams.set('state', state);
      return NextResponse.redirect(errorUrl);
    }

    // Check if user is authenticated
    const authResult = await auth();
    if (!authResult?.userId || !authResult?.orgId) {
      // Redirect to login with return URL
      const loginUrl = new URL('/sign-in', request.url);
      loginUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Generate authorization code
    const authCode = generateAuthCode();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store authorization code
    authCodes.set(authCode, {
      code: authCode,
      organizationId: authResult.orgId,
      clientId,
      redirectUri,
      scope,
      expiresAt
    });

    console.log('🔐 Authorization code generated for org:', authResult.orgId);

    // Redirect back to ChatGPT with authorization code
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', authCode);
    if (state) callbackUrl.searchParams.set('state', state);

    return NextResponse.redirect(callbackUrl);

  } catch (error) {
    console.error('Error in OAuth authorization:', error);
    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error during authorization'
    }, { status: 500 });
  }
}
