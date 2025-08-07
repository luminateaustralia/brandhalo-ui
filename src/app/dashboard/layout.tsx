'use client';

import { UserButton, useOrganization, OrganizationSwitcher, useUser, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { ChevronDownIcon, UserIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
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
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double-clicks
    
    setIsSigningOut(true);
    try {
      // Use signOut with explicit redirect for Cloudflare Pages compatibility
      await signOut({ redirectUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: force redirect to home
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } finally {
      setIsSigningOut(false);
    }
  };
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
              afterCreateOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
            />
            {/* Custom User Menu for Cloudflare Pages compatibility */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User'}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden md:block" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.firstName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.primaryEmailAddress?.emailAddress || ''}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } ${isSigningOut ? 'opacity-50 cursor-not-allowed' : ''} flex w-full items-center px-4 py-2 text-sm`}
                        >
                          {isSigningOut ? 'Signing out...' : 'Sign out'}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>
        <main className="flex-1 p-8 min-h-0 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
} 