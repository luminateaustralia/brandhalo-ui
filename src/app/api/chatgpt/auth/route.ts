import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { initDatabase, saveApiKey, getApiKeys, revokeApiKey, type ApiKey } from '@/lib/db';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// Utility function to hash API keys using Web Crypto API
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a secure API key using Web Crypto API
function generateApiKey(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return 'bh_' + hexString;
}

// Generate a secure random UUID
function generateUUID(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Format as UUID
  return [
    hexString.slice(0, 8),
    hexString.slice(8, 12),
    hexString.slice(12, 16),
    hexString.slice(16, 20),
    hexString.slice(20, 32)
  ].join('-');
}

// POST - Generate new API key for ChatGPT integration
export async function POST(request: NextRequest) {
  console.log('🔑 ChatGPT API Key generation requested');
  try {
    const authResult = await auth();
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!authResult?.orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'API key name is required' 
      }, { status: 400 });
    }

    // Generate new API key
    const apiKey = generateApiKey();
    const keyHash = await hashApiKey(apiKey);
    const keyId = generateUUID();

    // Store in database (you'll need to implement this in your db.ts)
    // For now, we'll create the API key record structure
    const apiKeyRecord: ApiKey = {
      id: keyId,
      organizationId: authResult.orgId,
      keyHash,
      name: name.trim(),
      lastUsed: null,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Save API key to database
    await saveApiKey(apiKeyRecord);

    console.log('🔑 API key generated for org:', authResult.orgId);

    return NextResponse.json({
      id: keyId,
      name: apiKeyRecord.name,
      key: apiKey, // Only returned once during creation
      createdAt: apiKeyRecord.createdAt
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - List API keys for the organization
export async function GET() {
  console.log('🔑 ChatGPT API Keys list requested');
  try {
    const authResult = await auth();
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!authResult?.orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    // Get API keys from database
    const apiKeys = await getApiKeys(authResult.orgId);

    return NextResponse.json(apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      lastUsed: key.lastUsed,
      createdAt: key.createdAt,
      isActive: key.isActive
    })));

  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Revoke an API key
export async function DELETE(request: NextRequest) {
  console.log('🔑 ChatGPT API Key revocation requested');
  try {
    const authResult = await auth();
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!authResult?.orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    const { keyId } = await request.json();
    
    if (!keyId) {
      return NextResponse.json({ 
        error: 'API key ID is required' 
      }, { status: 400 });
    }

    // Revoke API key in database
    await revokeApiKey(keyId, authResult.orgId);

    console.log('🔑 API key revoked:', keyId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
