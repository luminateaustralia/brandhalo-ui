import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET - Serve the OpenAPI spec for ChatGPT MCP Connector
export async function GET(request: NextRequest) {
  console.log('📋 ChatGPT MCP OpenAPI spec requested');
  
  try {
    const openApiSpec = {
      "openapi": "3.1.0",
      "info": {
        "title": "BrandHalo MCP Connector",
        "description": "ChatGPT MCP Connector for accessing BrandHalo brand data through Model Context Protocol",
        "version": "1.0.0"
      },
      "servers": [
        {
          "url": request.nextUrl.origin,
          "description": "BrandHalo MCP Connector API"
        }
      ],
      "paths": {
        "/api/mcp/connector": {
          "post": {
            "operationId": "callMcpTool",
            "summary": "Execute MCP tool",
            "description": "Execute a Model Context Protocol tool to retrieve brand data",
            "security": [
              {
                "BearerAuth": []
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/McpToolCall"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful tool execution",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/McpToolResponse"
                    }
                  }
                }
              },
              "400": {
                "description": "Bad request - Invalid tool call format"
              },
              "401": {
                "description": "Unauthorized - Invalid or missing API key"
              },
              "404": {
                "description": "Brand profile not found"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        }
      },
      "components": {
        "securitySchemes": {
          "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "API Key",
            "description": "BrandHalo API key (format: bh_xxxxxxxx)"
          }
        },
        "schemas": {
          "McpToolCall": {
            "type": "object",
            "required": ["tool"],
            "properties": {
              "tool": {
                "type": "object",
                "required": ["name"],
                "properties": {
                  "name": {
                    "type": "string",
                    "enum": [
                      "get_brand_profile",
                      "get_brand_summary",
                      "get_brand_voice_guide",
                      "get_target_audience"
                    ],
                    "description": "Name of the MCP tool to execute"
                  },
                  "arguments": {
                    "type": "object",
                    "description": "Arguments for the tool (optional)"
                  }
                }
              }
            }
          },
          "McpToolResponse": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Whether the tool execution was successful"
              },
              "tool": {
                "type": "string",
                "description": "Name of the executed tool"
              },
              "result": {
                "type": "object",
                "description": "Tool execution result data"
              },
              "error": {
                "type": "string",
                "description": "Error message if execution failed"
              }
            }
          },
          "BrandProfile": {
            "type": "object",
            "description": "Complete brand profile information",
            "properties": {
              "company": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "industry": { "type": "string" },
                  "website": { "type": "string" },
                  "yearFounded": { "type": "number" },
                  "size": { "type": "string" }
                }
              },
              "brand": {
                "type": "object",
                "properties": {
                  "tagline": { "type": "string" },
                  "purpose": { "type": "string" },
                  "mission": { "type": "string" },
                  "vision": { "type": "string" },
                  "values": { "type": "array", "items": { "type": "string" } },
                  "promise": { "type": "string" }
                }
              },
              "personality": {
                "type": "object",
                "properties": {
                  "archetype": { "type": "string" },
                  "traits": { "type": "array", "items": { "type": "string" } },
                  "voiceTone": {
                    "type": "object",
                    "properties": {
                      "primary": { "type": "string" },
                      "secondary": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    return NextResponse.json(openApiSpec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Error serving OpenAPI spec:', error);
    return NextResponse.json({ 
      error: 'Failed to serve OpenAPI specification' 
    }, { status: 500 });
  }
}
