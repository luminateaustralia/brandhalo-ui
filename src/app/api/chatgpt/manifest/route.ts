import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET - Serve the OpenAI Actions manifest
export async function GET(request: NextRequest) {
  console.log('📋 OpenAI Actions manifest requested');
  
  try {
    // In a real implementation, you might want to dynamically generate this
    // or read from a file. For now, we'll return the static manifest.
    const manifest = {
      "openapi": "3.1.0",
      "info": {
        "title": "BrandHalo ChatGPT Integration",
        "description": "Access your brand profile data from BrandHalo to get comprehensive brand information including company details, brand essence, personality, visuals, messaging, and more.",
        "version": "1.0.0"
      },
      "servers": [
        {
          "url": request.nextUrl.origin,
          "description": "BrandHalo API"
        }
      ],
      "paths": {
        "/api/chatgpt/brand": {
          "get": {
            "operationId": "getBrandProfile",
            "summary": "Retrieve brand profile",
            "description": "Get comprehensive brand information including company details, brand essence, personality, visuals, target audience, messaging, and competitive landscape.",
            "security": [
              {
                "BearerAuth": []
              }
            ],
            "responses": {
              "200": {
                "description": "Successful response with brand profile data",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/BrandProfile"
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized - Invalid or missing API key"
              },
              "404": {
                "description": "Brand profile not found"
              }
            }
          }
        },
        "/api/chatgpt/personas": {
          "get": {
            "operationId": "getBrandPersonas",
            "summary": "Retrieve brand personas",
            "description": "Get all defined brand personas for the authenticated organization.",
            "security": [
              {
                "BearerAuth": []
              }
            ],
            "responses": {
              "200": {
                "description": "Successful response with brand personas",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Persona" }
                    }
                  }
                }
              },
              "401": { "description": "Unauthorized - Invalid or missing API key" }
            }
          }
        },
        "/api/chatgpt/brand-voices": {
          "get": {
            "operationId": "getBrandVoices",
            "summary": "Retrieve brand voices",
            "description": "Get all defined brand voices for the authenticated organization.",
            "security": [
              {
                "BearerAuth": []
              }
            ],
            "responses": {
              "200": {
                "description": "Successful response with brand voices",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/BrandVoice" }
                    }
                  }
                }
              },
              "401": { "description": "Unauthorized - Invalid or missing API key" }
            }
          }
        }
      },
      "components": {
        "securitySchemes": {
          "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "OAuth 2.0 access token or BrandHalo API key"
          },
          "OAuth2": {
            "type": "oauth2",
            "flows": {
              "authorizationCode": {
                "authorizationUrl": `${request.nextUrl.origin}/api/oauth/authorize`,
                "tokenUrl": `${request.nextUrl.origin}/api/oauth/token`,
                "scopes": {
                  "brand:read": "Read brand profile information"
                }
              }
            }
          }
        },
        "schemas": {
          "BrandProfile": {
            "type": "object",
            "description": "Complete brand profile information",
            "properties": {
              "company": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "description": "Company name" },
                  "industry": { "type": "string", "description": "Industry sector" },
                  "website": { "type": "string", "description": "Company website URL" },
                  "yearFounded": { "type": "number", "description": "Year founded" },
                  "size": { "type": "string", "description": "Company size" }
                }
              },
              "brand": {
                "type": "object",
                "properties": {
                  "tagline": { "type": "string", "description": "Brand tagline" },
                  "purpose": { "type": "string", "description": "Brand purpose" },
                  "mission": { "type": "string", "description": "Mission statement" },
                  "vision": { "type": "string", "description": "Vision statement" },
                  "values": { "type": "array", "items": { "type": "string" }, "description": "Core values" },
                  "promise": { "type": "string", "description": "Brand promise" }
                }
              },
              "personality": {
                "type": "object",
                "properties": {
                  "archetype": { "type": "string", "description": "Brand archetype" },
                  "traits": { "type": "array", "items": { "type": "string" }, "description": "Personality traits" },
                  "voiceTone": {
                    "type": "object",
                    "properties": {
                      "primary": { "type": "string", "description": "Primary tone" },
                      "secondary": { "type": "string", "description": "Secondary tone" }
                    }
                  }
                }
              }
            }
          },
          "Persona": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "age": { "type": "number" },
              "occupation": { "type": "string" },
              "location": { "type": "string" },
              "income": { "type": "string" },
              "image": { "type": "string" },
              "description": { "type": "string" },
              "goals": { "type": "array", "items": { "type": "string" } },
              "painPoints": { "type": "array", "items": { "type": "string" } },
              "preferredChannels": { "type": "array", "items": { "type": "string" } },
              "buyingBehavior": { "type": "string" },
              "isActive": { "type": "boolean" },
              "createdAt": { "type": "string" },
              "updatedAt": { "type": "string" }
            }
          },
          "BrandVoice": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "jobTitle": { "type": "string" },
              "department": { "type": "string" },
              "email": { "type": "string" },
              "bio": { "type": "string" },
              "profileImage": { "type": "string" },
              "communicationStyle": { "type": "string" },
              "tone": { "type": "string" },
              "personalityTraits": { "type": "array", "items": { "type": "string" } },
              "contentFocus": { "type": "array", "items": { "type": "string" } },
              "preferredTopics": { "type": "array", "items": { "type": "string" } },
              "expertiseAreas": { "type": "array", "items": { "type": "string" } },
              "doList": { "type": "array", "items": { "type": "string" } },
              "dontList": { "type": "array", "items": { "type": "string" } },
              "keyMessages": { "type": "array", "items": { "type": "string" } },
              "isActive": { "type": "boolean" },
              "createdAt": { "type": "string" },
              "updatedAt": { "type": "string" }
            }
          }
        }
      }
    };

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Error serving OpenAI Actions manifest:', error);
    return NextResponse.json({ 
      error: 'Failed to serve manifest' 
    }, { status: 500 });
  }
}
