import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Utility function to hash API keys using Web Crypto API
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a secure access token using Web Crypto API
function generateAccessToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return 'bht_' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a secure refresh token
function generateRefreshToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return 'bhr_' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Access authorization codes from the authorize endpoint
// In production, this should be shared storage (Redis/database)
declare global {
  var authCodes: Map<string, {
    code: string;
    organizationId: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    expiresAt: number;
  }> | undefined;
}

// Initialize the global authCodes if it doesn't exist
if (typeof globalThis !== 'undefined' && !globalThis.authCodes) {
  globalThis.authCodes = new Map();
}

const authCodes = globalThis.authCodes!;

// Store access tokens (in production, use database)
const accessTokens = new Map<string, {
  token: string;
  organizationId: string;
  clientId: string;
  scope: string;
  expiresAt: number;
  refreshToken: string;
}>();

// POST - OAuth token endpoint
export async function POST(request: NextRequest) {
  console.log('🔐 OAuth token request received');
  
  try {
    const formData = await request.formData();
    const grantType = formData.get('grant_type')?.toString();
    const code = formData.get('code')?.toString();
    const redirectUri = formData.get('redirect_uri')?.toString();
    const clientId = formData.get('client_id')?.toString();
    const clientSecret = formData.get('client_secret')?.toString();

    // Validate grant type
    if (grantType !== 'authorization_code') {
      return NextResponse.json({
        error: 'unsupported_grant_type',
        error_description: 'Only authorization_code grant type is supported'
      }, { status: 400 });
    }

    // Validate required parameters
    if (!code || !redirectUri || !clientId) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Missing required parameters'
      }, { status: 400 });
    }

    // Retrieve and validate authorization code
    const authData = authCodes.get(code);
    if (!authData) {
      return NextResponse.json({
        error: 'invalid_grant',
        error_description: 'Invalid or expired authorization code'
      }, { status: 400 });
    }

    // Check if code has expired
    if (Date.now() > authData.expiresAt) {
      authCodes.delete(code);
      return NextResponse.json({
        error: 'invalid_grant',
        error_description: 'Authorization code has expired'
      }, { status: 400 });
    }

    // Validate client and redirect URI
    if (authData.clientId !== clientId || authData.redirectUri !== redirectUri) {
      return NextResponse.json({
        error: 'invalid_grant',
        error_description: 'Client ID or redirect URI mismatch'
      }, { status: 400 });
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();
    const expiresIn = 3600; // 1 hour
    const expiresAt = Date.now() + (expiresIn * 1000);

    // Store access token
    accessTokens.set(accessToken, {
      token: accessToken,
      organizationId: authData.organizationId,
      clientId: authData.clientId,
      scope: authData.scope,
      expiresAt,
      refreshToken
    });

    // Clean up authorization code (one-time use)
    authCodes.delete(code);

    console.log('🔐 Access token generated for org:', authData.organizationId);

    // Return OAuth token response
    return NextResponse.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: authData.scope
    });

  } catch (error) {
    console.error('Error in OAuth token exchange:', error);
    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error during token exchange'
    }, { status: 500 });
  }
}

// Export the access tokens map for use in other modules
export { accessTokens };
