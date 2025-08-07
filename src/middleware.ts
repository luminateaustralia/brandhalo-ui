import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

interface Organization {
  id: string;
  domains?: Array<{ domainName: string }>;
}

// Define routes that require organization membership
const isDashboardRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)'
]);

// Define API routes that should be accessible
const isApiRoute = createRouteMatcher([
  '/api/customers/create',
  '/api/webhook(.*)',
  '/api/brand(.*)'
]);

// Define Clerk internal routes that should be allowed
const isClerkRoute = createRouteMatcher([
  '/api/auth(.*)',
  '/_clerk(.*)',
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/organization-setup(.*)',
  '/onboarding(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // Always allow API requests from our internal services
  if (isApiRoute(req)) {
    return;
  }

  // Allow Clerk internal routes (for auth flows)
  if (isClerkRoute(req)) {
    return;
  }

  // For POST requests to dashboard routes during signout, allow them through
  // This prevents 405 errors when Clerk makes POST requests during signout
  if (req.method === 'POST' && isDashboardRoute(req)) {
    return;
  }
  
  // For dashboard routes, enforce authentication and organization membership
  if (isDashboardRoute(req)) {
    const session = await auth();
    
    // If not authenticated, redirect to sign-in
    if (!session.userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // If authenticated but has no organization, try to join based on domain
    if (session.userId && !session.orgId) {
      try {
        // Get user details
        const user = await clerkClient.users.getUser(session.userId);
        const userEmail = user.emailAddresses[0]?.emailAddress;
        
        if (userEmail) {
          const domain = userEmail.split('@')[1];
          
          // Get all organizations
          const organizations = await clerkClient.organizations.getOrganizationList() as Organization[];
          
          // Find organization with matching domain
          const matchingOrg = organizations.find((org: Organization) => 
            org.domains?.some((d: { domainName: string }) => d.domainName === domain)
          );
          
          if (matchingOrg) {
            // Create organization membership
            await clerkClient.organizations.createOrganizationMembership({
              organizationId: matchingOrg.id,
              userId: session.userId,
              role: 'basic_member'
            });
            
            // Redirect to dashboard after joining
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }
      } catch (error) {
        console.error('Error joining organization:', error);
      }
      
      // If no matching organization found or error occurred, redirect to onboarding
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
  
  // For all other protected routes, just ensure authentication
  const session = await auth();
  if (!session.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};