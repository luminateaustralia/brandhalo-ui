// OAuth 2.0 utilities for BrandHalo ChatGPT integration

// Import access tokens from the token endpoint
// Note: In production, this should be a shared database/Redis store
let accessTokens: Map<string, {
  token: string;
  organizationId: string;
  clientId: string;
  scope: string;
  expiresAt: number;
  refreshToken: string;
}>;

// Initialize the access tokens map
if (typeof globalThis !== 'undefined') {
  if (!globalThis.accessTokens) {
    globalThis.accessTokens = new Map();
  }
  accessTokens = globalThis.accessTokens;
}

export interface OAuthTokenData {
  token: string;
  organizationId: string;
  clientId: string;
  scope: string;
  expiresAt: number;
  refreshToken: string;
}

/**
 * Validate OAuth 2.0 Bearer token and return organization ID
 */
export async function validateOAuthToken(authHeader: string): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // Handle both OAuth tokens (bht_) and legacy API keys (bh_)
  if (token.startsWith('bht_')) {
    // OAuth access token
    const tokenData = accessTokens?.get(token);
    if (!tokenData) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      accessTokens?.delete(token);
      return null;
    }

    return tokenData.organizationId;
  } else if (token.startsWith('bh_')) {
    // Legacy API key - use existing validation
    const { validateApiKey, updateApiKeyLastUsed } = await import('./db');
    
    // Hash the API key
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const organizationId = await validateApiKey(keyHash);
    
    if (organizationId) {
      await updateApiKeyLastUsed(keyHash);
    }
    
    return organizationId;
  }

  return null;
}

/**
 * Check if a scope is authorized for the given token
 */
export async function checkScope(authHeader: string, requiredScope: string): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);

  if (token.startsWith('bht_')) {
    const tokenData = accessTokens?.get(token);
    if (!tokenData) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      accessTokens?.delete(token);
      return false;
    }

    // Check scope (simple contains check, in production use proper scope parsing)
    return tokenData.scope.includes(requiredScope);
  } else if (token.startsWith('bh_')) {
    // Legacy API keys have full access
    return true;
  }

  return false;
}
