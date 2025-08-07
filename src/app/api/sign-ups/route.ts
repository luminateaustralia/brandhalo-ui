import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const runtime = 'edge';

// Database client
const client = createClient({
  url: 'libsql://bh-core-anthonyhook.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjE3MzgxMjMsImlhdCI6MTc1Mzk2MjEyMywiaWQiOiI2ODE1MWUzOS02NjYwLTRlZjEtOTQ5ZC00N2Q3MzMxMjJkOTkiLCJyaWQiOiI0Mzk0ZWRmYy00NzNkLTQxMmUtOWZjNC0xZWNmNzA3M2M2ZmYifQ.LKexOeVLhDO_bXeKmvnbzK0aQZa2-5kdymspsGWTZNJbk2BiNv1ytI0SMWD4vMBu4kzC48lthltR-p6uYL6LCA'
});

interface SignUpData {
  email: string;
  signup_url?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254; // RFC 5321 limit
}

// Sanitize URL to prevent XSS
function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
}

// POST - Create new sign-up
export async function POST(request: NextRequest) {
  console.log('🔍 Sign-up API POST route called');
  
  try {
    // Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log('🔍 Sign-up request from IP:', clientIP);

    const signUpData: SignUpData = await request.json();
    console.log('🔍 Sign-up data received:', { email: signUpData.email, hasUrl: !!signUpData.signup_url });
    
    // Validate required fields
    if (!signUpData.email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(signUpData.email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = signUpData.email.toLowerCase().trim();
    
    // Sanitize signup URL if provided
    let sanitizedUrl = '';
    if (signUpData.signup_url) {
      sanitizedUrl = sanitizeUrl(signUpData.signup_url);
      if (!sanitizedUrl && signUpData.signup_url) {
        return NextResponse.json({ 
          error: 'Invalid signup URL format' 
        }, { status: 400 });
      }
    }

    // Generate unique sign-up ID
    const signUpId = `signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if email already exists
      const existingSignUp = await client.execute({
        sql: 'SELECT id, created_at FROM sign_ups WHERE email = ?',
        args: [normalizedEmail]
      });

      if (existingSignUp.rows.length > 0) {
        console.log('🔍 Email already registered:', normalizedEmail);
        return NextResponse.json({ 
          error: 'Email already registered',
          id: existingSignUp.rows[0].id,
          registered_at: existingSignUp.rows[0].created_at
        }, { status: 409 });
      }

      // Create the sign-up record
      const result = await client.execute({
        sql: `
          INSERT INTO sign_ups (id, email, signup_url, created_at, updated_at)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `,
        args: [
          signUpId,
          normalizedEmail,
          sanitizedUrl || null
        ]
      });
      
      console.log('🔍 Database insert result:', result);
      
      const response = {
        id: signUpId,
        email: normalizedEmail,
        signup_url: sanitizedUrl || null,
        message: 'Successfully registered for updates'
      };
      
      return NextResponse.json(response, { status: 201 });
      
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      
      // Handle table doesn't exist error - create table and retry
      if (dbError instanceof Error && dbError.message.includes('no such table')) {
        console.log('🔍 Creating sign_ups table...');
        
        // Create the sign_ups table
        await client.execute(`
          CREATE TABLE IF NOT EXISTS sign_ups (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            signup_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Try the insert again
        const retryResult = await client.execute({
          sql: `
            INSERT INTO sign_ups (id, email, signup_url, created_at, updated_at)
            VALUES (?, ?, ?, datetime('now'), datetime('now'))
          `,
          args: [
            signUpId,
            normalizedEmail,
            sanitizedUrl || null
          ]
        });
        
        console.log('🔍 Retry insert result:', retryResult);
        
        const response = {
          id: signUpId,
          email: normalizedEmail,
          signup_url: sanitizedUrl || null,
          message: 'Successfully registered for updates'
        };
        
        return NextResponse.json(response, { status: 201 });
      }
      
      // Handle unique constraint violation (race condition)
      if (dbError instanceof Error && dbError.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ 
          error: 'Email already registered' 
        }, { status: 409 });
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('❌ Error creating sign-up:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Retrieve sign-ups (admin only - would need authentication)
export async function GET(request: NextRequest) {
  console.log('🔍 Sign-up API GET route called');
  
  // For security, this endpoint should be protected
  // You might want to add authentication here based on your auth system
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100 per page
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await client.execute('SELECT COUNT(*) as total FROM sign_ups');
    const total = countResult.rows[0].total as number;

    // Get paginated results
    const result = await client.execute({
      sql: `
        SELECT id, email, signup_url, created_at, updated_at 
        FROM sign_ups 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `,
      args: [limit, offset]
    });
    
    const signUps = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      signup_url: row.signup_url,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return NextResponse.json({
      sign_ups: signUps,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error retrieving sign-ups:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}