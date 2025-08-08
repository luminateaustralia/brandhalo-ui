import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';



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

// Type-safe global state management
interface GlobalState {
  authCodes?: Map<string, {
    code: string;
    organizationId: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    expiresAt: number;
    codeChallenge?: string;
    codeChallengeMethod?: string;
  }>;
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

// Initialize the global authCodes if it doesn't exist
if (!globalState.authCodes) {
  globalState.authCodes = new Map();
}

// Initialize the global accessTokens if it doesn't exist
if (!globalState.accessTokens) {
  globalState.accessTokens = new Map();
}

const authCodes = globalState.authCodes;
const accessTokens = globalState.accessTokens;

// POST - OAuth token endpoint
export async function POST(request: NextRequest) {
  console.log('🔐 OAuth token request received');
  
  try {
    const formData = await request.formData();
    const grantType = formData.get('grant_type')?.toString();
    const code = formData.get('code')?.toString();
    const redirectUri = formData.get('redirect_uri')?.toString();
    const clientId = formData.get('client_id')?.toString();
    const codeVerifier = formData.get('code_verifier')?.toString();

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

    // Validate PKCE code verifier if code challenge was provided
    if (authData.codeChallenge) {
      if (!codeVerifier) {
        return NextResponse.json({
          error: 'invalid_request',
          error_description: 'Code verifier required for PKCE'
        }, { status: 400 });
      }

      // Verify code challenge
      let expectedChallenge = codeVerifier;
      if (authData.codeChallengeMethod === 'S256') {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        expectedChallenge = btoa(String.fromCharCode(...hashArray))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      }

      if (expectedChallenge !== authData.codeChallenge) {
        return NextResponse.json({
          error: 'invalid_grant',
          error_description: 'Invalid code verifier'
        }, { status: 400 });
      }
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

// OPTIONS - Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Note: accessTokens map is available in this module for token validation
// In production, this should be stored in a database or Redis
