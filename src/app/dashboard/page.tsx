// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser, useOrganization } from '@clerk/nextjs';
import { useApi } from '@/contexts/ApiContext';

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { refreshCustomers } = useApi();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When user and organization data is loaded, we can stop showing the loading state
    if (isUserLoaded && isOrgLoaded) {
      setIsLoading(false);
    }
  }, [isUserLoaded, isOrgLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Welcome {user?.firstName || user?.username || 'User'} from {organization?.name || 'Your Organization'}
          </p>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-lg text-blue-800">
              Your dashboard is ready. Use the navigation menu to manage your brand monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}