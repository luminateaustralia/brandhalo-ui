# Clerk Production Environment Setup

## Required Environment Variables for Production

Add these environment variables to your production deployment (Vercel, Netlify, etc.):

### Clerk Configuration
```bash
# Get these from your Clerk Dashboard (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_publishable_key
CLERK_SECRET_KEY=sk_live_your_actual_production_secret_key

# Your production domain
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### API Configuration  
```bash
# Your backend API URL
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_API_KEY=your_production_api_key
```

## Steps to Fix Production Issues:

1. **Create Production Instance in Clerk Dashboard:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new production instance or switch existing to production
   - Get your production publishable and secret keys

2. **Update Environment Variables:**
   - Replace development keys with production keys in your hosting platform
   - Ensure all NEXT_PUBLIC_CLERK_* variables are set correctly

3. **Configure Allowed Domains:**
   - In Clerk Dashboard → Settings → Domains
   - Add your production domain (e.g., yourdomain.com)
   - Remove localhost/development domains for security

4. **Test the Deployment:**
   - Clear browser cache and cookies
   - Test sign-up, sign-in, and organization functionality
   - Check browser console for any remaining warnings

## Common Issues Fixed:

✅ Removed NextAuth.js conflicts  
✅ Updated deprecated Clerk redirect properties  
✅ Fixed API authentication to use Clerk tokens  
✅ Cleaned up development-only configurations