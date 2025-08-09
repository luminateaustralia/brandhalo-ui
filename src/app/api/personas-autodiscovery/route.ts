import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

export const runtime = 'edge';

// Validation schema for the complete brand profile request
const autodiscoveryRequestSchema = z.object({
  timestamp: z.string(),
  organization: z.string(),
  brand: z.object({
    companyInfo: z.object({}).passthrough(),
    brandEssence: z.object({}).passthrough(),
    brandPersonality: z.object({}).passthrough(),
    brandVisuals: z.object({}).passthrough(),
    targetAudience: z.array(z.object({}).passthrough()).optional(),
    competitiveLandscape: z.object({}).passthrough().optional(),
    messaging: z.object({}).passthrough().optional(),
    compliance: z.object({}).passthrough().optional()
  })
});

// POST - Call OpenAI assistant for persona autodiscovery
export async function POST(request: NextRequest) {
  console.log('🎭 Persona autodiscovery API called');
  
  try {
    const authResult = await auth();
    console.log('🎭 Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId });
    
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!authResult?.orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = autodiscoveryRequestSchema.parse(body);

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not configured');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please contact support.' 
      }, { status: 500 });
    }

    // Prepare the prompt for persona generation with complete brand profile
    const prompt = `Based on the following comprehensive brand profile, determine the optimal number of customer personas (typically 3-5) and create detailed customer personas:

COMPLETE BRAND PROFILE:
${JSON.stringify(validatedData, null, 2)}

Analyze the complete brand profile above including:
- Company information (industry, size, location, etc.)
- Brand essence (mission, vision, values, purpose)
- Brand personality (archetype, traits, voice/tone)
- Target audience segments
- Competitive landscape
- Messaging strategy
- Visual identity

Based on this comprehensive brand analysis, create personas that align with:
1. The brand's target audience segments
2. The company's industry and business model
3. The brand personality and values
4. The competitive positioning
5. The messaging strategy

For each persona, provide detailed information including:
- name (realistic first and last name)
- age (specific age, not range)
- occupation (specific job title that aligns with target audience)
- location (city, state/country relevant to the brand's market)
- income (select from: "Under $30,000", "$30,000 - $50,000", "$50,000 - $75,000", "$75,000 - $100,000", "$100,000 - $150,000", "$150,000 - $200,000", "$200,000+", "Prefer not to say")
- description (2-3 sentence personality and background description)
- goals (3-5 specific, actionable goals that align with the brand's value proposition)
- painPoints (3-5 specific challenges they face that the brand can solve)
- preferredChannels (3-5 communication channels from: Email, LinkedIn, Facebook, Instagram, Twitter/X, TikTok, YouTube, WhatsApp, SMS, Phone calls, In-person meetings, Webinars, Industry blogs, Podcasts, Print media, Radio, TV, Online forums, Professional networks, Word of mouth)
- buyingBehavior (select one that matches the brand positioning: "Research-driven, compares multiple options", "Impulse buyer, makes quick decisions", "Brand loyal, sticks to trusted companies", "Price-sensitive, seeks best deals", "Quality-focused, willing to pay premium", "Social proof driven, reads reviews extensively", "Relationship-based, prefers personal recommendations", "Values-driven, supports brands with purpose", "Early adopter, tries new products first", "Risk-averse, waits for proven solutions")

Return ONLY a valid JSON object in this exact format:
{
  "personas": [
    {
      "name": "string",
      "age": number,
      "occupation": "string",
      "location": "string",
      "income": "string",
      "description": "string",
      "goals": ["string", "string", "string"],
      "painPoints": ["string", "string", "string"],
      "preferredChannels": ["string", "string", "string"],
      "buyingBehavior": "string",
      "isActive": true
    }
  ],
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "basedOn": "Complete brand profile analysis",
    "confidence": 90
  }
}

Ensure all personas are diverse, realistic, and strategically aligned with the brand profile provided.`;

    // Call OpenAI Assistant API
    console.log('🎭 Calling OpenAI assistant for persona generation');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to analyze business information for persona generation. Please try again.' 
      }, { status: 500 });
    }

    const threadData = await openaiResponse.json();
    console.log('🎭 Created thread:', threadData.id);

    // Run the assistant (using a general assistant ID - you may want to create a specific persona generation assistant)
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadData.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_syanhf9HiixXMwguAPI7L1Ip' // Specialized persona generation assistant
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.error('❌ OpenAI run error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to process persona generation. Please try again.' 
      }, { status: 500 });
    }

    const runData = await runResponse.json();
    console.log('🎭 Started run:', runData.id);

    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout (persona generation might take longer)
    let runStatus = runData.status;

    while (runStatus === 'queued' || runStatus === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.error('❌ OpenAI assistant timeout');
        return NextResponse.json({ 
          error: 'Persona generation is taking longer than expected. Please try again.' 
        }, { status: 408 });
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      attempts++;

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadData.id}/runs/${runData.id}`, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!statusResponse.ok) {
        console.error('❌ Failed to check run status');
        break;
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log(`🎭 Run status (attempt ${attempts}):`, runStatus);
    }

    if (runStatus !== 'completed') {
      console.error('❌ OpenAI assistant failed with status:', runStatus);
      return NextResponse.json({ 
        error: 'Failed to complete persona generation. Please try again.' 
      }, { status: 500 });
    }

    // Get the messages from the thread
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadData.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!messagesResponse.ok) {
      console.error('❌ Failed to retrieve messages');
      return NextResponse.json({ 
        error: 'Failed to retrieve persona generation results.' 
      }, { status: 500 });
    }

    const messagesData = await messagesResponse.json();
    console.log('🎭 Retrieved messages:', messagesData.data?.length);

    // Find the assistant's response
    const assistantMessage = messagesData.data?.find((msg: { role: string; content?: { text?: { value?: string } }[] }) => msg.role === 'assistant');
    
    if (!assistantMessage || !assistantMessage.content?.[0]?.text?.value) {
      console.error('❌ No assistant response found');
      return NextResponse.json({ 
        error: 'No persona generation results received.' 
      }, { status: 500 });
    }

    let personaData;
    try {
      // Parse the JSON response from the assistant
      const responseText = assistantMessage.content[0].text.value;
      console.log('🎭 Assistant response:', responseText);
      
      // Try to extract JSON from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      personaData = JSON.parse(jsonString);

      // Validate that we have personas array
      if (!personaData.personas || !Array.isArray(personaData.personas)) {
        throw new Error('Invalid response format: missing personas array');
      }

      // Ensure each persona has required fields and generate placeholder images
      personaData.personas = personaData.personas.map((persona: unknown) => {
        const p = persona as Record<string, unknown>;
        const personaName = (p.name as string) || 'Unknown';
        const personaAge = (p.age as number) || 35;
        const personaOccupation = (p.occupation as string) || 'Professional';
        
        // Generate realistic avatar using DiceBear API
        // Creates diverse, professional avatars that match persona characteristics
        const seed = personaName.replace(/\s+/g, '').toLowerCase(); // Use name as seed for consistency
        
        // Use DiceBear Personas style (realistic human avatars)
        const placeholderImage = `https://api.dicebear.com/7.x/personas/png?seed=${encodeURIComponent(seed)}&size=400&backgroundColor=transparent&radius=50`;
        
        return {
          name: personaName,
          age: personaAge,
          occupation: personaOccupation,
          location: (p.location as string) || 'Unknown',
          income: (p.income as string) || '$50,000 - $75,000',
          image: (p.image as string) || placeholderImage,
          description: (p.description as string) || '',
          goals: Array.isArray(p.goals) ? p.goals as string[] : [],
          painPoints: Array.isArray(p.painPoints) ? p.painPoints as string[] : [],
          preferredChannels: Array.isArray(p.preferredChannels) ? p.preferredChannels as string[] : [],
          buyingBehavior: (p.buyingBehavior as string) || 'Research-driven, compares multiple options',
          isActive: p.isActive !== false // Default to true
        };
      });

    } catch (parseError) {
      console.error('❌ Failed to parse assistant response as JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid response format from persona generation.' 
      }, { status: 500 });
    }

    console.log('🎭 Parsed persona data:', personaData);
    return NextResponse.json(personaData);

  } catch (error) {
    console.error('❌ Persona autodiscovery error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error during persona generation' 
    }, { status: 500 });
  }
}
