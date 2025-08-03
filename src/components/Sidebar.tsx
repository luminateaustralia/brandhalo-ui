'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  HomeIcon,
  StarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  ChartBarIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen bg-gray-50 text-gray-800 transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200 fixed left-0 top-0 z-20`}
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center">
        <Link href="/dashboard" className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          {isCollapsed ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src="/Roundel.svg" 
                alt="BrandHalo" 
                width={32} 
                height={32}
                className=""
              />
            </div>
          ) : (
            <div className="flex items-center">
              <Image 
                src="/Logo.svg" 
                alt="BrandHalo" 
                width={154} 
                height={36}
                className=""
              />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 pt-4 flex flex-col overflow-y-auto">
        {/* Top Section */}
        <div>
          <Link
            href="/chat"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Chat</span>}
          </Link>
          <Link
            href="/notifications"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <BellIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Notifications</span>}
          </Link>
        </div>

        {/* Divider */}
        <div className={`${isCollapsed ? 'mx-2' : 'mx-4'} border-t border-gray-300 my-4`}></div>

        {/* Main Section */}
        <div>
          <Link
            href="/dashboard"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <HomeIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          <Link
            href="/dashboard/brand"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <StarIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Brand Profiles</span>}
          </Link>
          <Link
            href="/dashboard/personas"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <UserGroupIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Brand Personas</span>}
          </Link>
          <Link
            href="/dashboard/brand-voices"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <SpeakerWaveIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Brand Voices</span>}
          </Link>
          <Link
            href="/dashboard/channels"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <GlobeAltIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Channels</span>}
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <ChartBarIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Analytics</span>}
          </Link>
          <Link
            href="/dashboard/compliance"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <ShieldCheckIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Compliance</span>}
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto mb-4">
          <div className={`${isCollapsed ? 'mx-2' : 'mx-4'} border-t border-gray-300 my-2`}></div>
          <Link
            href="/admin"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Admin</span>}
          </Link>
          <Link
            href="/admin/dashboard"
            className={`flex items-center ${
              isCollapsed ? 'justify-center mx-2' : 'mx-3 px-3'
            } py-2 rounded hover:bg-purple-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-purple-500`}
          >
            <Squares2X2Icon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
        </div>
      </nav>

      {/* Toggle button at bottom */}
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-200 rounded-full flex items-center justify-center"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
} 