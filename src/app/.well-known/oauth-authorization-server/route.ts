import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET - OAuth 2.0 Authorization Server Metadata (RFC 8414)
// MCP Specification: This MUST be at the authorization base URL (root domain)
export async function GET(request: NextRequest) {
  console.log('🔍 MCP OAuth discovery endpoint requested');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  const origin = request.nextUrl.origin;
  
  const metadata = {
    issuer: origin,
    authorization_endpoint: `${origin}/api/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    userinfo_endpoint: `${origin}/api/oauth/userinfo`,
    registration_endpoint: `${origin}/api/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    scopes_supported: ['brand:read'],
    code_challenge_methods_supported: ['plain', 'S256'],
    response_modes_supported: ['query'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    revocation_endpoint: `${origin}/api/oauth/revoke`,
    revocation_endpoint_auth_methods_supported: ['none']
  };

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version',
      'Access-Control-Max-Age': '86400',
    },
  });
}
