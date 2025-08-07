'use client';

export const runtime = 'edge';

import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';

export default function OrganizationPage() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div>Loading organization...</div>;
  }

  if (!organization) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">No Organization</h1>
        <p>You need to create or join an organization first.</p>
      </div>
    );
  }

  const handleOpenOrgSettings = () => {
    const switcherElement = document.querySelector('[data-clerk-organization-switcher]');
    if (switcherElement instanceof HTMLElement) {
      switcherElement.click();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organization Details</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          {organization.imageUrl && (
            <Image 
              src={organization.imageUrl} 
              alt={organization.name || 'Organization logo'} 
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{organization.name}</h2>
            <p className="text-gray-600">{organization.slug}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Organization ID</h3>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{organization.id}</p>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Created</h3>
          <p>{new Date(organization.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Organization Members</h3>
        
        <p className="text-gray-600 mb-4">
          View and manage members in your organization using the Organization Switcher in the header.
        </p>
        
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleOpenOrgSettings}
        >
          Open Organisation Settings
        </button>
      </div>
    </div>
  );
} 