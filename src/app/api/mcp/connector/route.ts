import { NextRequest, NextResponse } from 'next/server';
import { validateOAuthToken } from '@/lib/oauth';
import type { ColorInfo, FontInfo, AudienceSegment, Competitor } from '@/types/brand';

export const runtime = 'edge';

// Authentication now handled by OAuth middleware

// MCP Server communication
async function callMCPServer(tool: string, params: Record<string, unknown>, organizationId: string) {
  const { getBrandProfile } = await import('@/lib/db');

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

    case 'get_brand_personas': {
      const { getPersonas } = await import('@/lib/db');
      const personas = await getPersonas(organizationId);
      return personas.map((p) => p.personaData);
    }

    case 'get_brand_voices': {
      const { getBrandVoices } = await import('@/lib/db');
      const voices = await getBrandVoices(organizationId);
      return voices.map((v) => v.voiceData);
    }

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

    // Required MCP tools for ChatGPT compatibility
    case 'search':
      // Search within brand data based on query
      const query = params.query as string;
      if (!query) {
        return { error: 'Search query is required' };
      }
      
      const searchResults = [];
      const lowerQuery = query.toLowerCase();
      
      // Search in brand essence
      if (brandData.brandEssence.tagline?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({ type: 'tagline', content: brandData.brandEssence.tagline });
      }
      if (brandData.brandEssence.brandPurpose?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({ type: 'purpose', content: brandData.brandEssence.brandPurpose });
      }
      
      // Search in messaging
      brandData.messaging.keyMessages.forEach((message: string, index: number) => {
        if (message.toLowerCase().includes(lowerQuery)) {
          searchResults.push({ type: 'key_message', content: message, index });
        }
      });
      
      return { query, results: searchResults };

    case 'fetch':
      // Fetch specific brand data by URL or identifier
      const url = params.url as string;
      const dataType = params.type as string;
      
      if (dataType === 'brand_profile') {
        return {
          company: {
            name: brandData.companyInfo.companyName,
            industry: brandData.companyInfo.industry,
            website: brandData.companyInfo.website
          },
          brand: {
            tagline: brandData.brandEssence.tagline,
            purpose: brandData.brandEssence.brandPurpose
          }
        };
      }
      
      return { url, type: dataType, data: 'Fetch completed' };

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

// POST - Handle MCP tool calls from ChatGPT
export async function POST(request: NextRequest) {
  console.log('🔗 ChatGPT MCP Connector called');
  
  try {
    // Extract and validate OAuth token or API key from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Missing or invalid Authorization header. Expected: Bearer <token>' 
      }, { status: 401 });
    }

    // Validate OAuth token or legacy API key
    const organizationId = await validateOAuthToken(authHeader);
    if (!organizationId) {
      return NextResponse.json({ 
        error: 'Invalid or expired access token' 
      }, { status: 401 });
    }

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
    const result = await callMCPServer(toolName, toolArgs, organizationId);

    return NextResponse.json({
      success: true,
      tool: toolName,
      result: result
    });

  } catch (error) {
    console.error('Error in MCP connector:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('Invalid') ? 401 :
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
        'get_brand_personas',
        'get_brand_voices',
        'get_brand_summary', 
        'get_brand_voice_guide',
        'get_target_audience',
        'search',
        'fetch'
      ]
    },
    authentication: {
      type: 'oauth2',
      format: 'Bearer <access_token>'
    },
    endpoints: {
      mcp_calls: '/api/mcp/connector',
      manifest: '/api/mcp/manifest'
    }
  });
}
