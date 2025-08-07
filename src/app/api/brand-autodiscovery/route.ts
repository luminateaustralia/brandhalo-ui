import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

export const runtime = 'edge';

// Validation schema for the request
const autodiscoveryRequestSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  website: z.string().url('Valid website URL is required')
});

// POST - Call OpenAI assistant for brand autodiscovery
export async function POST(request: NextRequest) {
  console.log('🔍 Brand autodiscovery API called');
  
  try {
    const authResult = await auth();
    console.log('🔍 Auth result:', { orgId: authResult?.orgId, userId: authResult?.userId });
    
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

    // Call OpenAI Assistant API
    console.log('🔍 Calling OpenAI assistant with:', validatedData);
    
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
          content: JSON.stringify({
            brandName: validatedData.brandName,
            website: validatedData.website
          })
        }]
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to analyze brand information. Please try again.' 
      }, { status: 500 });
    }

    const threadData = await openaiResponse.json();
    console.log('🔍 Created thread:', threadData.id);

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadData.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_ljxVope9DeYRPKV6f54FQycU' //'asst_w3zB27V3ePDpqThCoVyj8pXd'
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.error('❌ OpenAI run error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to process brand analysis. Please try again.' 
      }, { status: 500 });
    }

    const runData = await runResponse.json();
    console.log('🔍 Started run:', runData.id);

    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    let runStatus = runData.status;

    while (runStatus === 'queued' || runStatus === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.error('❌ OpenAI assistant timeout');
        return NextResponse.json({ 
          error: 'Brand analysis is taking longer than expected. Please try again.' 
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
      console.log(`🔍 Run status (attempt ${attempts}):`, runStatus);
    }

    if (runStatus !== 'completed') {
      console.error('❌ OpenAI assistant failed with status:', runStatus);
      return NextResponse.json({ 
        error: 'Failed to complete brand analysis. Please try again.' 
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
        error: 'Failed to retrieve brand analysis results.' 
      }, { status: 500 });
    }

    const messagesData = await messagesResponse.json();
    console.log('🔍 Retrieved messages:', messagesData.data?.length);

    // Find the assistant's response
    const assistantMessage = messagesData.data?.find((msg: { role: string; content?: { text?: { value?: string } }[] }) => msg.role === 'assistant');
    
    if (!assistantMessage || !assistantMessage.content?.[0]?.text?.value) {
      console.error('❌ No assistant response found');
      return NextResponse.json({ 
        error: 'No brand analysis results received.' 
      }, { status: 500 });
    }

    let brandData;
    try {
      // Parse the JSON response from the assistant
      const responseText = assistantMessage.content[0].text.value;
      console.log('🔍 Assistant response:', responseText);
      
      // Try to extract JSON from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      brandData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('❌ Failed to parse assistant response as JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid response format from brand analysis.' 
      }, { status: 500 });
    }

    console.log('🔍 Parsed brand data:', brandData);
    return NextResponse.json(brandData);

  } catch (error) {
    console.error('❌ Brand autodiscovery error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error during brand autodiscovery' 
    }, { status: 500 });
  }
}
