'use client';

import { UserButton, useOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import Sidebar from '@/components/Sidebar';
import SearchBox from '@/components/SearchBox';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization, isLoaded } = useOrganization();



  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
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
                },
              }}
              hidePersonal
              afterCreateOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
            />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 p-8 min-h-0">{children}</main>
      </div>
    </div>
  );
} 