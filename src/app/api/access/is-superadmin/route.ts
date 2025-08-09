import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ isSuperAdmin: false });
    }

    type PrivateMetadata = { role?: string };
    const role = (user.privateMetadata as PrivateMetadata)?.role;
    const isSuperAdmin = role === 'superAdmin';
    return NextResponse.json({ isSuperAdmin });
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return NextResponse.json({ isSuperAdmin: false }, { status: 200 });
  }
}


