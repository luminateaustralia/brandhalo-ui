'use client';

import { useOrganization, useUser, useAuth, useSession } from '@clerk/nextjs';
import Image from 'next/image';

export default function AdminOrganisationPage() {
  const { organization, isLoaded: orgLoaded, membership } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const { userId, orgId, sessionId, getToken } = useAuth();
  const { session, isLoaded: sessionLoaded } = useSession();

  if (!orgLoaded || !userLoaded || !sessionLoaded) {
    return <div>Loading...</div>;
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-md font-semibold mb-3 text-blue-600">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, copyable = false }: { label: string; value: string | undefined; copyable?: boolean }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-gray-700 text-sm">{label}</h4>
        {copyable && value && (
          <button 
            onClick={() => copyToClipboard(value)}
            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 rounded"
          >
            Copy
          </button>
        )}
      </div>
      <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
        {value || 'Not available'}
      </p>
    </div>
  );

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clerk Admin Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 h-screen overflow-hidden">
        {/* Column 1: User & Session */}
        <div className="space-y-4">
          {/* Current User Information */}
          <InfoCard title="🧑‍💼 User Information">
            <div className="flex items-center mb-3">
              {user?.imageUrl && (
                <Image 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User avatar'} 
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div>
                <h2 className="text-sm font-semibold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            
            <InfoRow label="User ID" value={userId} copyable />
            <InfoRow label="Username" value={user?.username} />
            <InfoRow label="Phone" value={user?.phoneNumbers[0]?.phoneNumber} />
            <InfoRow label="Created" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined} />
            <InfoRow label="Last Sign In" value={user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : undefined} />
            <InfoRow label="2FA Enabled" value={user?.twoFactorEnabled ? 'Yes' : 'No'} />
          </InfoCard>

          {/* Session Information */}
          <InfoCard title="🔐 Session">
            <InfoRow label="Session ID" value={sessionId} copyable />
            <InfoRow label="Status" value={session?.status} />
            <InfoRow label="Last Active" value={session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : undefined} />
            <InfoRow label="Expires" value={session?.expireAt ? new Date(session.expireAt).toLocaleString() : undefined} />
          </InfoCard>
        </div>

        {/* Column 2: Organization & Membership */}
        <div className="space-y-4">
          {/* Organization Information */}
          {organization ? (
            <InfoCard title="🏢 Organization">
              <div className="flex items-center mb-3">
                {organization.imageUrl && (
                  <Image 
                    src={organization.imageUrl} 
                    alt={organization.name || 'Organization logo'} 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div>
                  <h2 className="text-sm font-semibold">{organization.name}</h2>
                  <p className="text-xs text-gray-600">{organization.slug}</p>
                </div>
              </div>
              
              <InfoRow label="Organization ID" value={orgId} copyable />
              <InfoRow label="Slug" value={organization.slug} />
              <InfoRow label="Created" value={new Date(organization.createdAt).toLocaleDateString()} />
              <InfoRow label="Members" value={organization.membersCount?.toString()} />
              <InfoRow label="Pending Invites" value={organization.pendingInvitationsCount?.toString()} />
              <InfoRow label="Max Members" value={organization.maxAllowedMemberships?.toString()} />
            </InfoCard>
          ) : (
            <InfoCard title="🏢 Organization">
              <p className="text-xs text-gray-600">No organization found.</p>
            </InfoCard>
          )}

          {/* Membership Information */}
          {membership && (
            <InfoCard title="👥 Membership">
              <InfoRow label="Role" value={membership.role} />
              <InfoRow label="Member Since" value={new Date(membership.createdAt).toLocaleDateString()} />
              <InfoRow label="Permissions" value={membership.permissions?.join(', ')} />
            </InfoCard>
          )}

          {/* Quick Actions */}
          <InfoCard title="⚙️ Quick Actions">
            <div className="space-y-2">
              <button 
                className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                onClick={handleOpenOrgSettings}
              >
                Org Settings
              </button>
              
              <button 
                className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                onClick={async () => {
                  try {
                    const token = await getToken();
                    copyToClipboard(token || '');
                    alert('Session token copied!');
                  } catch (error) {
                    alert('Failed to get token');
                  }
                }}
              >
                Copy Session Token
              </button>
              
              <button 
                className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
                onClick={() => {
                  const debugInfo = {
                    userId,
                    orgId,
                    sessionId,
                    userEmail: user?.emailAddresses[0]?.emailAddress,
                    orgName: organization?.name,
                    timestamp: new Date().toISOString()
                  };
                  copyToClipboard(JSON.stringify(debugInfo, null, 2));
                  alert('Debug info copied!');
                }}
              >
                Copy Debug Info
              </button>
            </div>
          </InfoCard>
        </div>

        {/* Column 3: Debug & Environment */}
        <div className="space-y-4">
          {/* Debug Information */}
          <InfoCard title="🔍 Environment">
            <InfoRow label="Environment" value={process.env.NODE_ENV} />
            <InfoRow label="Clerk Key" value={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15) + '...'} />
            <InfoRow label="URL" value={typeof window !== 'undefined' ? window.location.hostname : 'Server Side'} />
          </InfoCard>

          {/* Key IDs Summary */}
          <InfoCard title="🔑 Key Identifiers">
            <InfoRow label="User ID" value={userId} copyable />
            <InfoRow label="Org ID" value={orgId} copyable />
            <InfoRow label="Session ID" value={sessionId} copyable />
          </InfoCard>

          {/* Timestamps */}
          <InfoCard title="⏰ Timestamps">
            <InfoRow label="User Created" value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : undefined} />
            <InfoRow label="Org Created" value={organization ? new Date(organization.createdAt).toLocaleString() : undefined} />
            <InfoRow label="Session Created" value={session?.createdAt ? new Date(session.createdAt).toLocaleString() : undefined} />
            <InfoRow label="Current Time" value={new Date().toLocaleString()} />
          </InfoCard>
        </div>
      </div>
    </div>
  );
}