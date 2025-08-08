import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Type-safe global state management for client registrations
interface GlobalState {
  registeredClients?: Map<string, {
    client_id: string;
    client_name?: string;
    redirect_uris: string[];
    grant_types: string[];
    response_types: string[];
    scope?: string;
    created_at: number;
  }>;
}

const globalState = globalThis as typeof globalThis & GlobalState;

// Initialize the global registeredClients if it doesn't exist
if (!globalState.registeredClients) {
  globalState.registeredClients = new Map();
}

// Generate a secure client ID
function generateClientId(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  return 'mcp_' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// POST - OAuth 2.0 Dynamic Client Registration (RFC 7591)
export async function POST(request: NextRequest) {
  console.log('📝 OAuth dynamic client registration requested');
  
  try {
    const body = await request.json();
    console.log('Registration request:', body);

    // Validate required fields per RFC 7591
    const {
      client_name,
      redirect_uris = [],
      grant_types = ['authorization_code'],
      response_types = ['code'],
      scope = 'brand:read'
    } = body;

    // Validate redirect URIs (MCP spec requires localhost or HTTPS)
    for (const uri of redirect_uris) {
      const url = new URL(uri);
      if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
        return NextResponse.json({
          error: 'invalid_redirect_uri',
          error_description: 'Redirect URIs must be HTTPS or localhost'
        }, { status: 400 });
      }
    }

    // Generate client credentials
    const client_id = generateClientId();
    const client_secret = null; // Public client per MCP spec
    
    // Store client registration
    const clientData = {
      client_id,
      client_name,
      redirect_uris,
      grant_types,
      response_types,
      scope,
      created_at: Date.now()
    };

    globalState.registeredClients!.set(client_id, clientData);

    console.log(`🎯 Registered MCP client: ${client_id}`);

    // Return registration response per RFC 7591
    const response = {
      client_id,
      client_secret, // null for public clients
      client_name,
      redirect_uris,
      grant_types,
      response_types,
      scope,
      token_endpoint_auth_method: 'none' // Public client
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Error in client registration:', error);
    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error during client registration'
    }, { status: 500 });
  }
}

// OPTIONS - Handle preflight requests
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

// Note: globalState is available in this module for client validation
// Access it by importing this module, not by direct export
