'use client';

import { UserButton, useOrganization, OrganizationSwitcher, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchBox from '@/components/SearchBox';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (userLoaded && !user) {
      router.push('/sign-in');
    }
  }, [userLoaded, user, router]);

  // Show loading state while authentication is being checked
  if (!userLoaded || !orgLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the dashboard</p>
            <button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <SidebarProvider>
          <DashboardContent organization={organization} isLoaded={orgLoaded}>
            {children}
          </DashboardContent>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}

function DashboardContent({ 
  children, 
  organization, 
  isLoaded 
}: {
  children: React.ReactNode;
  organization: ReturnType<typeof useOrganization>['organization'];
  isLoaded: boolean;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen">
      <Sidebar />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="bg-white shadow-sm h-16 flex items-center px-8 z-10 flex-shrink-0">
          <div className="flex-1 max-w-xl mr-12">
            <SearchBox 
              placeholder="Ask me anything..."
              onSearch={(query) => {
                // TODO: Implement search functionality
                console.log('Search query:', query);
              }}
            />
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            {isLoaded && organization && (
              <div className="text-sm text-gray-600">
                {organization.name}
              </div>
            )}
            <OrganizationSwitcher 
              appearance={{
                elements: {
                  rootBox: "bg-white",
                  organizationSwitcherTrigger: "bg-white hover:bg-gray-50",
                  organizationPreview: "text-sm",
                  organizationSwitcherPopoverActionButton__createOrganization: "display: none !important",
                },
              }}
              hidePersonal
              hideCreateOrganization
              afterCreateOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
            />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 p-8 min-h-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
} 