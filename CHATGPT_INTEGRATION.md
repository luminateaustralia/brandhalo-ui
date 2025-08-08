# BrandHalo ChatGPT Integration

This document outlines the implementation of a secure ChatGPT integration that allows ChatGPT users to connect to BrandHalo and access their brand information.

## Overview

The integration follows OpenAI's best practices and enables ChatGPT users to:
- Securely connect to their BrandHalo account using API keys
- Retrieve comprehensive brand profile information
- Use brand data in ChatGPT conversations for content generation, brand analysis, and more

## Implementation Details

### Architecture

```
ChatGPT → OpenAI Actions → BrandHalo API → Database
```

1. **ChatGPT Actions**: Uses OpenAI's Actions framework with custom schema
2. **API Key Authentication**: Secure Bearer token authentication 
3. **Brand Data API**: Dedicated endpoint optimized for ChatGPT consumption
4. **User Management**: UI for users to generate and manage API keys

### API Endpoints

#### 1. API Key Management (`/api/chatgpt/auth`)
- **POST**: Generate new API key
- **GET**: List organization's API keys  
- **DELETE**: Revoke API key

#### 2. Brand Data Access (`/api/chatgpt/brand`)
- **GET**: Retrieve brand profile using API key authentication

#### 3. OpenAI Actions Manifest (`/api/chatgpt/manifest`)
- **GET**: Serve OpenAI Actions schema definition

### Security Features

- **API Key Hashing**: Keys are SHA-256 hashed before storage
- **Organization Isolation**: Keys are scoped to specific organizations
- **Key Rotation**: Users can revoke and regenerate keys
- **Usage Tracking**: Last used timestamps for monitoring
- **Secure Headers**: Proper CORS and authorization headers

### Database Schema

```sql
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    last_used DATETIME NULL,
    created_at DATETIME NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);
```

## Setup Instructions

### 1. Database Migration

Run the SQL migration to create the API keys table:

```bash
# Apply the migration from sql/03_api_keys.sql
```

### 2. User Interface

The API key management interface is available at:
- `/dashboard/settings/chatgpt` - Main management page
- Component: `ApiKeyManager.tsx` - Handles key creation, listing, and revocation

### 3. ChatGPT Configuration

Users can connect ChatGPT by:

1. **Generate API Key**:
   - Go to `/dashboard/settings/chatgpt`
   - Create a new API key with a descriptive name
   - Copy the generated key (shown only once)

2. **Configure ChatGPT Action**:
   - In ChatGPT, create a new GPT or edit existing one
   - Add new Action with schema URL: `https://yourdomain.com/api/chatgpt/manifest`
   - Set authentication to "Bearer" 
   - Paste the API key as the Bearer token

3. **Test Connection**:
   - Ask ChatGPT to retrieve brand information
   - Verify the data is returned correctly

## API Usage Examples

### Authenticate and Get Brand Data

```bash
curl -H "Authorization: Bearer bh_your_api_key_here" \
     https://yourdomain.com/api/chatgpt/brand
```

### Response Format

```json
{
  "company": {
    "name": "Example Corp",
    "industry": "Technology",
    "website": "https://example.com",
    "yearFounded": 2020,
    "size": "Medium"
  },
  "brand": {
    "tagline": "Innovation Simplified",
    "purpose": "To make technology accessible to everyone",
    "mission": "Empowering businesses through simple technology solutions",
    "vision": "A world where technology enhances human potential",
    "values": ["Innovation", "Integrity", "Inclusion"],
    "promise": "Reliable technology solutions that just work"
  },
  "personality": {
    "archetype": "The Creator",
    "traits": ["Innovative", "Reliable", "Approachable"],
    "voiceTone": {
      "primary": "Professional",
      "secondary": "Friendly"
    }
  },
  "visuals": {
    "primaryColors": [
      {"name": "Brand Blue", "hex": "#007bff"}
    ],
    "secondaryColors": [
      {"name": "Accent Gray", "hex": "#6c757d"}
    ],
    "typography": [
      {"name": "Inter", "usage": "Headings"},
      {"name": "Source Sans Pro", "usage": "Body text"}
    ],
    "imageStyle": "Clean, modern, minimalist photography"
  },
  "targetAudience": [
    {
      "name": "Small Business Owners",
      "description": "Entrepreneurs running small to medium businesses",
      "keyNeeds": "Simple, cost-effective technology solutions",
      "demographics": "25-55 years old, business owners and managers"
    }
  ],
  "messaging": {
    "elevatorPitch": "We provide simple technology solutions that help small businesses grow without the complexity.",
    "keyMessages": [
      "Technology should be simple",
      "Focus on growth, not complexity",
      "Your success is our mission"
    ],
    "doNotSay": "Avoid technical jargon, complex explanations"
  },
  "competitors": {
    "primary": [
      {
        "name": "TechSolutions Inc",
        "website": "https://techsolutions.com",
        "positioning": "Enterprise-focused with complex solutions"
      }
    ],
    "differentiators": "We focus on simplicity and ease of use, unlike complex enterprise solutions"
  },
  "compliance": {
    "guidelines": "https://example.com/brand-guidelines.pdf",
    "trademark": "Registered",
    "notes": "Logo usage requires approval for external partnerships"
  }
}
```

## ChatGPT Prompts

Here are example prompts users can use once the integration is set up:

### Brand Information Retrieval
```
"Get my brand information from BrandHalo"
```

### Content Creation
```
"Using my BrandHalo brand profile, write a social media post about our new product launch"
```

### Brand Analysis
```
"Based on my brand personality and values from BrandHalo, how should I position our company in the sustainability market?"
```

### Competitive Analysis
```
"Compare my brand's messaging with our competitors listed in BrandHalo"
```

## Error Handling

The API provides clear error messages for common scenarios:

- **401 Unauthorized**: Invalid or missing API key
- **404 Not Found**: No brand profile exists
- **500 Internal Server Error**: System errors

Example error response:
```json
{
  "error": "No brand profile found for this organization. Please create a brand profile first at https://brandhalo.com/dashboard/brand"
}
```

## Security Considerations

1. **API Key Storage**: Keys are hashed using SHA-256 before database storage
2. **HTTPS Only**: All communication must use HTTPS in production
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Key Rotation**: Encourage users to rotate keys periodically
5. **Audit Logging**: Track API key usage and access patterns

## Monitoring and Analytics

Track the following metrics:
- API key generation frequency
- Brand data access patterns
- Error rates and types
- User adoption and engagement

## Future Enhancements

Potential improvements:
1. **Rate Limiting**: Implement per-key rate limiting
2. **Usage Analytics**: Detailed usage reporting for organizations
3. **Webhook Support**: Real-time brand data updates in ChatGPT
4. **Advanced Permissions**: Fine-grained access control for different data types
5. **Multi-Brand Support**: Support for organizations with multiple brands

## Troubleshooting

### Common Issues

1. **"Invalid API key" errors**:
   - Verify the key format starts with `bh_`
   - Check if the key has been revoked
   - Ensure proper Bearer token format

2. **"Brand profile not found"**:
   - User needs to create a brand profile first
   - Check organization association

3. **CORS errors**:
   - Verify proper CORS headers in API responses
   - Check domain allowlists

### Support

For technical support:
1. Check API key management interface for key status
2. Review server logs for detailed error information
3. Verify brand profile exists in BrandHalo dashboard
4. Test API endpoints directly with curl/Postman

## Compliance and Privacy

- **Data Privacy**: Only brand profile data is accessible via API
- **User Consent**: Users explicitly generate API keys for access
- **Data Retention**: API keys can be revoked immediately
- **GDPR Compliance**: Users can delete their API keys and data access

This integration provides a secure, scalable way for ChatGPT users to access their BrandHalo brand information while maintaining the highest security standards and following OpenAI's best practices.
