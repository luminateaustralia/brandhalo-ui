import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET - Serve the ChatGPT MCP Connector manifest
export async function GET(request: NextRequest) {
  console.log('📋 ChatGPT MCP Connector manifest requested');
  
  try {
    const manifest = {
      "schema_version": "v1",
      "name_for_model": "brandhalo_mcp",
      "name_for_human": "BrandHalo Brand Data",
      "description_for_model": "Access comprehensive brand profile data from BrandHalo including company information, brand essence, personality, visuals, messaging, target audience, and competitive landscape. Use this to get brand-consistent information for content creation, marketing materials, and brand analysis.",
      "description_for_human": "Retrieve your BrandHalo brand profile data to ensure brand-consistent communications and content.",
      "auth": {
        "type": "bearer",
        "instructions": "Use your BrandHalo API key (format: bh_xxxxxxxx) which you can generate at /dashboard/settings/chatgpt"
      },
      "api": {
        "type": "openapi",
        "url": `${request.nextUrl.origin}/api/mcp/openapi.json`
      },
      "logo_url": `${request.nextUrl.origin}/Logo.svg`,
      "contact_email": "support@brandhalo.com",
      "legal_info_url": `${request.nextUrl.origin}/legal`
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
    console.error('Error serving MCP manifest:', error);
    return NextResponse.json({ 
      error: 'Failed to serve manifest' 
    }, { status: 500 });
  }
}
