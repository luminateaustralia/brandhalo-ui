# OAuth 2.0 Implementation for BrandHalo ChatGPT Integration

This document explains the OAuth 2.0 authentication wrapper that enables ChatGPT to securely access BrandHalo brand data using industry-standard OAuth flows.

## Overview

The OAuth 2.0 implementation wraps both the ChatGPT Actions API and MCP Connector, providing secure, token-based authentication that ChatGPT supports natively.

## OAuth 2.0 Flow

```
User → ChatGPT → BrandHalo OAuth → User Login → Access Token → Brand Data
```

1. **ChatGPT** initiates OAuth flow when user requests brand data
2. **BrandHalo** redirects to login if user not authenticated
3. **User** logs in via BrandHalo dashboard
4. **Authorization code** generated and returned to ChatGPT
5. **ChatGPT** exchanges code for access token
6. **Access token** used to authenticate API calls

## OAuth Endpoints

### 🔐 **Authorization Endpoint**
```
GET /api/oauth/authorize
```

**Parameters:**
- `response_type=code` (required)
- `client_id` (required) - ChatGPT client identifier
- `redirect_uri` (required) - ChatGPT callback URL
- `scope=brand:read` (optional)
- `state` (optional) - CSRF protection

**Example:**
```
https://yourdomain.com/api/oauth/authorize?response_type=code&client_id=chatgpt&redirect_uri=https://chatgpt.com/callback&scope=brand:read&state=xyz123
```

### 🎫 **Token Endpoint**
```
POST /api/oauth/token
```

**Parameters:**
- `grant_type=authorization_code` (required)
- `code` (required) - Authorization code from authorize endpoint
- `redirect_uri` (required) - Must match authorization request
- `client_id` (required) - ChatGPT client identifier

**Response:**
```json
{
  "access_token": "bht_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "bhr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "scope": "brand:read"
}
```

### 👤 **User Info Endpoint**
```
GET /api/oauth/userinfo
Authorization: Bearer bht_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Response:**
```json
{
  "sub": "org_xxxxxxxxxxxxxxxxxxxxxxxx",
  "name": "BrandHalo User",
  "email": "user@org_xxxxxxxxxxxxxxxxxxxxxxxx.brandhalo.com",
  "organization_id": "org_xxxxxxxxxxxxxxxxxxxxxxxx",
  "scope": "brand:read"
}
```

## Updated API Endpoints

Both API endpoints now support OAuth 2.0 tokens alongside legacy API keys:

### **ChatGPT Actions** (`/api/chatgpt/brand`)
```
GET /api/chatgpt/brand
Authorization: Bearer bht_access_token_here
```

### **MCP Connector** (`/api/mcp/connector`)
```
POST /api/mcp/connector
Authorization: Bearer bht_access_token_here
Content-Type: application/json

{
  "tool": {
    "name": "get_brand_profile",
    "arguments": {}
  }
}
```

## ChatGPT Configuration

### **ChatGPT Actions (Updated)**

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "BrandHalo ChatGPT Integration",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://yourdomain.com"
    }
  ],
  "components": {
    "securitySchemes": {
      "OAuth2": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://yourdomain.com/api/oauth/authorize",
            "tokenUrl": "https://yourdomain.com/api/oauth/token",
            "scopes": {
              "brand:read": "Read brand profile information"
            }
          }
        }
      }
    }
  }
}
```

### **ChatGPT MCP Connector (Updated)**

```json
{
  "name": "BrandHalo",
  "manifest_url": "https://yourdomain.com/api/mcp/manifest",
  "auth": {
    "type": "oauth2",
    "oauth_url": "https://yourdomain.com/api/oauth/authorize",
    "scope": "brand:read"
  }
}
```

## Token Types

### **Access Tokens** (`bht_` prefix)
- **Format:** `bht_` + 64 character hex string
- **Lifetime:** 1 hour (3600 seconds)
- **Usage:** Bearer token for API authentication
- **Scope:** `brand:read` - Read access to brand profile data

### **Refresh Tokens** (`bhr_` prefix)
- **Format:** `bhr_` + 64 character hex string
- **Lifetime:** Long-lived (implementation dependent)
- **Usage:** Obtain new access tokens when expired

### **Legacy API Keys** (`bh_` prefix)
- **Format:** `bh_` + 64 character hex string
- **Lifetime:** Indefinite (until revoked)
- **Usage:** Direct API authentication (still supported)

## Security Features

### 🔒 **Organization Isolation**
- OAuth tokens are bound to specific organizations
- No cross-organization data access possible
- Token validation includes organization context

### 🛡️ **Token Security**
- SHA-256 hashing for secure storage
- Short-lived access tokens (1 hour)
- Secure random token generation using Web Crypto API
- HTTPS-only transmission

### 📊 **Audit & Monitoring**
- All OAuth flows logged with organization context
- Token usage tracking and timestamps
- Failed authentication attempts logged
- Token expiration and cleanup

## Backward Compatibility

The implementation maintains full backward compatibility:

✅ **Legacy API Keys** - Existing `bh_` keys continue working  
✅ **Existing Integrations** - No breaking changes to current setups  
✅ **Gradual Migration** - Users can migrate to OAuth at their own pace  

## Error Handling

### **OAuth Authorization Errors**
```
HTTP 302 Redirect to: https://chatgpt.com/callback?error=invalid_client&error_description=Invalid%20client_id&state=xyz123
```

### **Token Exchange Errors**
```json
{
  "error": "invalid_grant",
  "error_description": "Authorization code has expired"
}
```

### **API Authentication Errors**
```json
{
  "error": "invalid_token",
  "error_description": "Access token has expired"
}
```

## Implementation Benefits

### 🚀 **For ChatGPT Integration**
- **Native Support** - OAuth is ChatGPT's preferred authentication
- **Automatic Token Management** - ChatGPT handles token refresh
- **Better User Experience** - Single sign-on flow
- **Enhanced Security** - Time-limited access tokens

### 🎯 **For BrandHalo**
- **Industry Standard** - OAuth 2.0 is the gold standard
- **Granular Permissions** - Scope-based access control
- **Better Analytics** - Detailed token usage tracking
- **Future-Proof** - Compatible with evolving AI platforms

### 🔐 **Security Improvements**
- **Short-Lived Tokens** - Reduced exposure window
- **Secure Exchange** - Authorization code flow prevents token leakage
- **Audit Trail** - Complete OAuth flow logging
- **Revocation Support** - Immediate token invalidation

## Setup Instructions

### **1. ChatGPT Actions Setup**
1. Use schema URL: `https://yourdomain.com/api/chatgpt/manifest`
2. Select OAuth 2.0 authentication
3. Authorization URL: `https://yourdomain.com/api/oauth/authorize`
4. Token URL: `https://yourdomain.com/api/oauth/token`
5. Scopes: `brand:read`

### **2. ChatGPT MCP Connector Setup**
1. Use manifest URL: `https://yourdomain.com/api/mcp/manifest`
2. OAuth flow will be handled automatically
3. Users will be prompted to authenticate when first accessing

### **3. Testing OAuth Flow**
1. **Trigger Flow**: Ask ChatGPT to get your brand information
2. **Authenticate**: Log in when redirected to BrandHalo
3. **Verify Access**: Confirm ChatGPT receives brand data
4. **Check Tokens**: Monitor OAuth logs for successful flow

## Migration Path

### **Immediate Benefits**
- OAuth endpoints are live and functional
- ChatGPT can now use OAuth for authentication
- Legacy API keys continue working without changes

### **Recommended Migration**
1. **Test OAuth** - Verify OAuth flow works with your ChatGPT setup
2. **Update Configurations** - Switch ChatGPT to use OAuth endpoints
3. **Monitor Usage** - Track OAuth vs API key usage
4. **Educate Users** - Guide users to OAuth-based flows
5. **Optional Deprecation** - Eventually sunset API keys if desired

The OAuth 2.0 implementation provides a modern, secure, and ChatGPT-native authentication method while maintaining full backward compatibility with existing integrations.
