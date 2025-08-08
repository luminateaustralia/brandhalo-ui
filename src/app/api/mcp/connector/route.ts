import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, updateApiKeyLastUsed } from '@/lib/db';
import type { ColorInfo, FontInfo, AudienceSegment, Competitor } from '@/types/brand';

export const runtime = 'edge';

// Utility function to hash API keys using Web Crypto API
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Authenticate API key and return organization ID
async function authenticateApiKey(apiKey: string): Promise<string | null> {
  if (!apiKey || !apiKey.startsWith('bh_')) {
    return null;
  }

  try {
    const keyHash = await hashApiKey(apiKey);
    const organizationId = await validateApiKey(keyHash);
    
    if (organizationId) {
      await updateApiKeyLastUsed(keyHash);
    }
    
    return organizationId;
  } catch (error) {
    console.error('Error authenticating API key:', error);
    return null;
  }
}

// MCP Server communication
async function callMCPServer(tool: string, params: Record<string, unknown>, apiKey: string) {
  // In a real implementation, this would communicate with your MCP server
  // For now, we'll simulate the MCP server response by calling our existing logic
  
  const { getBrandProfile } = await import('@/lib/db');
  const organizationId = await authenticateApiKey(apiKey);
  
  if (!organizationId) {
    throw new Error('Invalid API key');
  }

  const brandProfile = await getBrandProfile(organizationId);
  if (!brandProfile) {
    throw new Error('No brand profile found');
  }

  const brandData = brandProfile.brandData;

  switch (tool) {
    case 'get_brand_profile':
      return {
        company: {
          name: brandData.companyInfo.companyName,
          industry: brandData.companyInfo.industry,
          website: brandData.companyInfo.website,
          yearFounded: brandData.companyInfo.yearFounded,
          size: brandData.companyInfo.size
        },
        brand: {
          tagline: brandData.brandEssence.tagline,
          purpose: brandData.brandEssence.brandPurpose,
          mission: brandData.brandEssence.mission,
          vision: brandData.brandEssence.vision,
          values: brandData.brandEssence.values.filter((v: string) => v),
          promise: brandData.brandEssence.brandPromise
        },
        personality: {
          archetype: brandData.brandPersonality.archetype,
          traits: brandData.brandPersonality.traits.filter((t: string) => t),
          voiceTone: {
            primary: brandData.brandPersonality.voiceTone.primaryTone,
            secondary: brandData.brandPersonality.voiceTone.secondaryTone
          }
        },
        visuals: {
          primaryColors: brandData.brandVisuals.primaryColors.filter((c: ColorInfo) => c.hex),
          secondaryColors: brandData.brandVisuals.secondaryColors.filter((c: ColorInfo) => c.hex),
          typography: brandData.brandVisuals.typography.filter((f: FontInfo) => f.name),
          imageStyle: brandData.brandVisuals.imageStyleDescription
        },
        targetAudience: brandData.targetAudience.filter((audience: AudienceSegment) => audience.name),
        messaging: {
          elevatorPitch: brandData.messaging.elevatorPitch,
          keyMessages: brandData.messaging.keyMessages.filter((m: string) => m),
          doNotSay: brandData.messaging.doNotSay
        },
        competitors: {
          primary: brandData.competitiveLandscape.primaryCompetitors.filter((c: Competitor) => c.name),
          differentiators: brandData.competitiveLandscape.differentiators
        },
        compliance: {
          guidelines: brandData.compliance.brandGuidelinesURL,
          trademark: brandData.compliance.trademarkStatus,
          notes: brandData.compliance.notes
        }
      };

    case 'get_brand_summary':
      return {
        company: brandData.companyInfo.companyName,
        tagline: brandData.brandEssence.tagline,
        purpose: brandData.brandEssence.brandPurpose,
        values: brandData.brandEssence.values.filter((v: string) => v),
        personality: brandData.brandPersonality.traits.filter((t: string) => t),
        elevatorPitch: brandData.messaging.elevatorPitch,
      };

    case 'get_brand_voice_guide':
      return {
        archetype: brandData.brandPersonality.archetype,
        traits: brandData.brandPersonality.traits.filter((t: string) => t),
        voiceTone: {
          primary: brandData.brandPersonality.voiceTone.primaryTone,
          secondary: brandData.brandPersonality.voiceTone.secondaryTone
        },
        keyMessages: brandData.messaging.keyMessages.filter((m: string) => m),
        doNotSay: brandData.messaging.doNotSay,
      };

    case 'get_target_audience':
      return brandData.targetAudience.filter((audience: AudienceSegment) => audience.name);

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

// POST - Handle MCP tool calls from ChatGPT
export async function POST(request: NextRequest) {
  console.log('🔗 ChatGPT MCP Connector called');
  
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Missing or invalid Authorization header. Expected: Bearer <api_key>' 
      }, { status: 401 });
    }

    const apiKey = authHeader.substring(7);
    const body = await request.json();
    
    // Validate request format
    if (!body.tool || !body.tool.name) {
      return NextResponse.json({ 
        error: 'Invalid request format. Expected: { "tool": { "name": "tool_name", "arguments": {...} } }' 
      }, { status: 400 });
    }

    const { name: toolName, arguments: toolArgs = {} } = body.tool;

    console.log('🛠️ MCP Tool call:', toolName, toolArgs);

    // Call MCP server (or simulate it)
    const result = await callMCPServer(toolName, toolArgs, apiKey);

    return NextResponse.json({
      success: true,
      tool: toolName,
      result: result
    });

  } catch (error) {
    console.error('Error in MCP connector:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('Invalid API key') ? 401 :
                      errorMessage.includes('not found') ? 404 : 500;

    return NextResponse.json({ 
      success: false,
      error: errorMessage 
    }, { status: statusCode });
  }
}

// GET - Health check and capability discovery
export async function GET() {
  console.log('🔗 MCP Connector health check');
  
  return NextResponse.json({
    name: 'BrandHalo MCP Connector',
    version: '1.0.0',
    description: 'ChatGPT MCP Connector for BrandHalo brand data',
    capabilities: {
      tools: [
        'get_brand_profile',
        'get_brand_summary', 
        'get_brand_voice_guide',
        'get_target_audience'
      ]
    },
    authentication: {
      type: 'bearer',
      format: 'bh_xxxxxxxx'
    },
    endpoints: {
      mcp_calls: '/api/mcp/connector',
      manifest: '/api/mcp/manifest'
    }
  });
}
