import { NextRequest, NextResponse } from 'next/server';
import { getBrandProfile, initDatabase } from '@/lib/db';
import { validateOAuthToken } from '@/lib/oauth';
import type { ColorInfo, FontInfo, AudienceSegment, Competitor } from '@/types/brand';

export const runtime = 'edge';

// Initialize database on first load
initDatabase();

// Authentication now handled by OAuth middleware

// GET - Retrieve brand profile using API key authentication
export async function GET(request: NextRequest) {
  console.log('🤖 ChatGPT Brand API called');
  
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

    console.log('🤖 Valid token for organization:', organizationId);

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
