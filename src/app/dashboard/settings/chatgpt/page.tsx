import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ApiKeyManager from '@/components/chatgpt/ApiKeyManager';

export const runtime = 'edge';

export default async function ChatGPTSettingsPage() {
  const authResult = await auth();
  
  if (!authResult?.userId) {
    redirect('/sign-in');
  }
  
  if (!authResult?.orgId) {
    redirect('/onboarding');
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ChatGPT Integration</h1>
        <p className="text-muted-foreground">
          Connect your BrandHalo account with ChatGPT to access your brand information in conversations.
        </p>
      </div>
      
      <ApiKeyManager />
    </div>
  );
}
