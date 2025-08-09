import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ isSuperAdmin: false });
    }

    const role = (user as any)?.privateMetadata?.role;
    const isSuperAdmin = role === 'superAdmin';
    return NextResponse.json({ isSuperAdmin });
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return NextResponse.json({ isSuperAdmin: false }, { status: 200 });
  }
}


