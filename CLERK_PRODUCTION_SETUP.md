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
# Use the NEW redirect URL format (not the deprecated after_sign_in_url)
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding
```

### API Configuration  
```bash
# Your backend API URL
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_API_KEY=your_production_api_key
```

## ⚠️ CRITICAL: Your Current Issue

**Problem**: You're still using **development Clerk keys** instead of production keys. 

The error `joint-wildcat-28.clerk.accounts.dev` indicates development instance usage, which causes the 400 API errors and sign-in hanging.

## Steps to Fix Production Issues:

1. **🔑 URGENT - Switch to Production Keys:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - **Switch to your production instance** (not development)
   - Copy the **production** publishable key (starts with `pk_live_`)
   - Copy the **production** secret key (starts with `sk_live_`)

2. **🌐 Update Environment Variables in your hosting platform:**
   ```bash
   # REMOVE these deprecated variables if they exist:
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
   
   # ADD these correct variables:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_key
   CLERK_SECRET_KEY=sk_live_your_actual_production_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding
   ```

3. **🔧 Configure Allowed Domains in Clerk:**
   - In Clerk Dashboard → Settings → Domains
   - Add `platform.brandhalo.io` to allowed domains
   - Remove any localhost/development domains

4. **🧹 Clear Cache and Test:**
   - Clear browser cache and cookies completely
   - Redeploy your application
   - Test sign-up, sign-in, and organization functionality

## Common Issues Fixed:

✅ Removed NextAuth.js conflicts  
✅ Updated deprecated Clerk redirect properties  
✅ Fixed API authentication to use Clerk tokens  
✅ Cleaned up development-only configurations