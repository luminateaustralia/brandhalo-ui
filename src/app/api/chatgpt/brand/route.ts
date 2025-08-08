import { NextRequest, NextResponse } from 'next/server';
import { getBrandProfile, initDatabase, validateApiKey, updateApiKeyLastUsed } from '@/lib/db';
import type { ColorInfo, FontInfo, AudienceSegment, Competitor } from '@/types/brand';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// Utility function to hash API keys for comparison using Web Crypto API
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Utility function to authenticate API key
async function authenticateApiKey(apiKey: string): Promise<string | null> {
  if (!apiKey || !apiKey.startsWith('bh_')) {
    return null;
  }

  const keyHash = await hashApiKey(apiKey);
  const organizationId = await validateApiKey(keyHash);
  
  if (organizationId) {
    // Update last used timestamp
    await updateApiKeyLastUsed(keyHash);
  }
  
  return organizationId;
}

// GET - Retrieve brand profile using API key authentication
export async function GET(request: NextRequest) {
  console.log('🤖 ChatGPT Brand API called');
  
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Missing or invalid Authorization header. Expected: Bearer <api_key>' 
      }, { status: 401 });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Authenticate the API key
    const organizationId = await authenticateApiKey(apiKey);
    if (!organizationId) {
      return NextResponse.json({ 
        error: 'Invalid or inactive API key' 
      }, { status: 401 });
    }

    console.log('🤖 Valid API key for organization:', organizationId);

    // Retrieve brand profile
    const brandProfile = await getBrandProfile(organizationId);
    
    if (!brandProfile) {
      return NextResponse.json({ 
        error: 'No brand profile found for this organization. Please create a brand profile first at https://brandhalo.com/dashboard/brand' 
      }, { status: 404 });
    }

    // Format the response for ChatGPT consumption
    const brandData = brandProfile.brandData;
    const chatGptResponse = {
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

    return NextResponse.json(chatGptResponse);

  } catch (error) {
    console.error('Error in ChatGPT brand API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Health check endpoint for OpenAI Actions
export async function POST(request: NextRequest) {
  console.log('🤖 ChatGPT Brand API health check');
  
  try {
    const body = await request.json();
    
    if (body.action === 'health_check') {
      return NextResponse.json({
        status: 'healthy',
        service: 'BrandHalo ChatGPT Integration',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action. Use GET to retrieve brand data.' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error in ChatGPT brand API health check:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
