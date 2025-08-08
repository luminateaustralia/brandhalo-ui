# ChatGPT MCP Connector for BrandHalo

This document explains how to set up and use the **ChatGPT MCP Connector** that allows ChatGPT to communicate with BrandHalo brand data through the Model Context Protocol (MCP).

## Overview

The ChatGPT MCP Connector acts as a bridge between ChatGPT and your BrandHalo brand data, using OpenAI's new MCP integration feature. This provides a more sophisticated integration than standard Actions, allowing for richer context and tool interactions.

## Architecture

```
ChatGPT → MCP Connector API → BrandHalo Database
```

1. **ChatGPT** calls the MCP Connector with tool requests
2. **MCP Connector** authenticates and processes the request
3. **BrandHalo Database** provides the brand data
4. **Response** flows back to ChatGPT with structured data

## Available MCP Tools

### 🛠️ **Tool Functions**

| Tool Name | Description | Use Case |
|-----------|-------------|----------|
| `get_brand_profile` | Complete brand information | Full brand context for content |
| `get_brand_summary` | Concise brand overview | Quick brand reference |
| `get_brand_voice_guide` | Voice & tone guidelines | Content creation guidance |
| `get_target_audience` | Audience segments | Targeted messaging |

## Setup Instructions

### 1. **MCP Connector URLs**

Your ChatGPT MCP Connector is available at these endpoints:

```
Manifest URL: https://yourdomain.com/api/mcp/manifest
OpenAPI Spec: https://yourdomain.com/api/mcp/openapi.json
Connector API: https://yourdomain.com/api/mcp/connector
```

### 2. **ChatGPT Configuration**

To set up the MCP Connector in ChatGPT:

1. **Access ChatGPT Settings**
   - Go to ChatGPT settings
   - Navigate to "MCP Servers" or "Connectors" section

2. **Add New MCP Connector**
   ```json
   {
     "name": "BrandHalo",
     "manifest_url": "https://yourdomain.com/api/mcp/manifest",
     "auth": {
       "type": "bearer",
       "token": "bh_your_api_key_here"
     }
   }
   ```

3. **Authentication Setup**
   - **Type:** Bearer Token
   - **Token:** Your BrandHalo API key (from `/dashboard/settings/chatgpt`)
   - **Format:** `bh_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. **API Key Generation**

1. Visit `/dashboard/settings/chatgpt` in BrandHalo
2. Click "Create New API Key"
3. Enter a name (e.g., "ChatGPT MCP Connector")
4. Copy the generated key (starts with `bh_`)
5. Store securely - it's only shown once

## Usage Examples

### Basic Tool Calls

**Get Complete Brand Profile:**
```
Use the get_brand_profile tool to retrieve all my brand information.
```

**Get Brand Summary:**
```
Call get_brand_summary to get a concise overview of my brand.
```

**Get Voice Guidelines:**
```
Use get_brand_voice_guide to understand my brand's voice and tone.
```

**Get Target Audience:**
```
Retrieve my target audience information with get_target_audience.
```

### Advanced Usage

**Content Creation:**
```
Using my brand profile from the MCP connector, write a blog post about [topic] that aligns with my brand voice and targets my key audience segments.
```

**Brand Analysis:**
```
Compare my brand positioning with competitors using the brand data from the MCP connector.
```

**Marketing Materials:**
```
Create a social media campaign using my brand voice guidelines and target audience data from the MCP connector.
```

## API Reference

### MCP Tool Call Format

**Request:**
```json
{
  "tool": {
    "name": "get_brand_profile",
    "arguments": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "tool": "get_brand_profile",
  "result": {
    "company": {
      "name": "Example Corp",
      "industry": "Technology",
      "website": "https://example.com",
      "yearFounded": 2020,
      "size": "Medium"
    },
    "brand": {
      "tagline": "Innovation Simplified",
      "purpose": "Making technology accessible",
      "mission": "Empowering businesses...",
      "vision": "A world where...",
      "values": ["Innovation", "Integrity", "Inclusion"],
      "promise": "Reliable solutions that work"
    },
    "personality": {
      "archetype": "The Creator",
      "traits": ["Innovative", "Reliable", "Approachable"],
      "voiceTone": {
        "primary": "Professional",
        "secondary": "Friendly"
      }
    }
    // ... additional brand data
  }
}
```

### Available Tools

#### `get_brand_profile`
**Description:** Retrieve complete brand profile information  
**Arguments:** None  
**Returns:** Full brand data object with all information

#### `get_brand_summary`
**Description:** Get concise brand overview  
**Arguments:** None  
**Returns:** Key brand information (name, tagline, purpose, values, traits, elevator pitch)

#### `get_brand_voice_guide`
**Description:** Get brand voice and tone guidelines  
**Arguments:** None  
**Returns:** Voice guidance (archetype, traits, tone, key messages, words to avoid)

#### `get_target_audience`
**Description:** Retrieve target audience segments  
**Arguments:** None  
**Returns:** Array of audience segments with demographics and needs

## Comparison: MCP Connector vs ChatGPT Actions

| Feature | MCP Connector | ChatGPT Actions |
|---------|---------------|-----------------|
| **Protocol** | Model Context Protocol | OpenAI Actions |
| **Integration** | Native MCP support | HTTP API calls |
| **Tool Discovery** | Automatic via manifest | Manual schema definition |
| **Context Persistence** | Enhanced context handling | Stateless requests |
| **Error Handling** | Rich error responses | Basic HTTP errors |
| **Performance** | Optimized for AI interactions | Standard REST API |
| **Future Support** | Aligned with MCP standard | OpenAI specific |

## Security Features

### 🔒 **Authentication**
- **Bearer Token:** API key-based authentication
- **Organization Scoped:** Keys limited to specific organizations
- **Usage Tracking:** All calls logged with timestamps
- **Key Rotation:** Easy revocation and regeneration

### 🛡️ **Data Protection**
- **Secure Transmission:** HTTPS only
- **Minimal Data:** Only brand profile data exposed
- **Access Control:** Organization-level data isolation
- **Audit Trail:** Complete request/response logging

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Invalid or inactive API key"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "No brand profile found for this organization"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request format. Expected: { \"tool\": { \"name\": \"tool_name\" } }"
}
```

## Troubleshooting

### Setup Issues

**MCP Connector Not Found:**
- Verify manifest URL is accessible
- Check domain configuration
- Ensure HTTPS is enabled

**Authentication Failures:**
- Confirm API key format (starts with `bh_`)
- Check key is active in BrandHalo dashboard
- Verify Bearer token format in ChatGPT

**Tool Call Failures:**
- Ensure brand profile exists in BrandHalo
- Check organization has completed brand setup
- Verify API key permissions

### Debug Steps

1. **Test Manifest URL:**
   ```bash
   curl https://yourdomain.com/api/mcp/manifest
   ```

2. **Test API Key:**
   ```bash
   curl -H "Authorization: Bearer bh_your_key" \
        https://yourdomain.com/api/mcp/connector
   ```

3. **Check Health Status:**
   ```bash
   curl https://yourdomain.com/api/mcp/connector
   ```

## Benefits of MCP Connector

### 🚀 **Enhanced Capabilities**
- **Richer Integration:** More sophisticated than basic Actions
- **Better Context:** MCP provides enhanced context handling
- **Tool Discovery:** Automatic discovery of available tools
- **Standard Protocol:** Future-proof with MCP ecosystem

### 🎯 **Use Cases**
- **Content Creation:** Brand-consistent writing and messaging
- **Marketing Materials:** Aligned social media, ads, and campaigns
- **Brand Analysis:** Competitive positioning and differentiation
- **Documentation:** Brand guidelines and style guides
- **Training:** Team education on brand voice and values

### 🔄 **Integration Flow**
1. **User Query:** Ask ChatGPT about brand-related content
2. **Tool Selection:** ChatGPT automatically selects appropriate MCP tool
3. **API Call:** Secure call to BrandHalo MCP Connector
4. **Data Retrieval:** Brand information retrieved from database
5. **Response Processing:** ChatGPT uses brand data for response
6. **Brand-Consistent Output:** Content aligned with brand guidelines

The ChatGPT MCP Connector provides a more powerful and flexible way to integrate your BrandHalo brand data with ChatGPT, enabling sophisticated brand-aware AI interactions that go beyond simple API calls.
