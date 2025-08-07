'use client';

import { UserButton, useOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import Sidebar from '@/components/Sidebar';
import SearchBox from '@/components/SearchBox';
import AdminSubNav from '@/components/AdminSubNav';
import { useSidebar } from '@/contexts/SidebarContext';

interface AdminContentProps {
  children: React.ReactNode;
}

export default function AdminContent({ 
  children 
}: AdminContentProps) {
  const { organization, isLoaded } = useOrganization();
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
              organizationProfileUrl="/admin/organisation"
            />
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </header>
        
        <AdminSubNav />
        
        <main className="flex-1 p-8 min-h-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
