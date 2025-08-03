// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser, useOrganization } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  StarIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  completed: boolean;
}

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);

  // Initial checklist items - brand completion will be updated based on API
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 'brand',
      title: 'Set Up Your Brand Profile',
      description: 'Define your brand essence, visuals, and core messaging',
      href: '/dashboard/brand',
      icon: StarIcon,
      completed: false
    },
    {
      id: 'personas',
      title: 'Define Target Personas',
      description: 'Create audience profiles to monitor relevant conversations',
      href: '/dashboard/personas',
      icon: UserGroupIcon,
      completed: false
    },
    {
      id: 'channels',
      title: 'Connect Monitoring Channels',
      description: 'Add social media and web channels to monitor',
      href: '/dashboard/channels',
      icon: GlobeAltIcon,
      completed: false
    },
    {
      id: 'compliance',
      title: 'Configure Compliance Rules',
      description: 'Set up brand guidelines and compliance monitoring',
      href: '/dashboard/compliance',
      icon: ShieldCheckIcon,
      completed: false
    }
  ]);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  useEffect(() => {
    // When user and organization data is loaded, we can stop showing the loading state
    if (isUserLoaded && isOrgLoaded) {
      setIsLoading(false);
    }
  }, [isUserLoaded, isOrgLoaded]);

  // Check if brand profile exists and update checklist accordingly
  useEffect(() => {
    const checkBrandProfile = async () => {
      if (!isOrgLoaded || !organization) return;
      
      try {
        const response = await fetch('/api/brand');
        if (response.ok) {
          // Brand profile exists
          setChecklistItems(prev => 
            prev.map(item => 
              item.id === 'brand' ? { ...item, completed: true } : item
            )
          );
        } else if (response.status === 404) {
          // No brand profile exists
          setChecklistItems(prev => 
            prev.map(item => 
              item.id === 'brand' ? { ...item, completed: false } : item
            )
          );
        }
      } catch (error) {
        console.error('Error checking brand profile:', error);
        // On error, assume no brand profile exists
      }
    };

    checkBrandProfile();
  }, [isOrgLoaded, organization]);

  const toggleComplete = (id: string) => {
    // Don't allow manual toggling of brand profile - it's determined by API
    if (id === 'brand') {
      return;
    }
    
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Welcome {user?.firstName || user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">
            Let&apos;s get {organization?.name || 'your organization'} set up for brand monitoring
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Onboarding Checklist */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
                <p className="text-sm text-gray-600 mt-1">Complete setup steps</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-purple-600">{completedCount}/{checklistItems.length}</div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {checklistItems.map((item, index) => {
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                      item.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {item.completed ? (
                          <CheckCircleIconSolid className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white font-semibold text-xs">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className={`font-medium text-sm ${
                        item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs mt-0.5 ${
                        item.completed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      {!item.completed && (
                        <Link
                          href={item.href}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
                        >
                          Start
                        </Link>
                      )}
                      
                      {/* Brand profile completion is determined by API, others are manually toggleable */}
                      {item.id === 'brand' ? (
                        <div className="p-1">
                          {item.completed ? (
                            <CheckCircleIconSolid className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleComplete(item.id)}
                          className={`p-1 rounded-full transition-colors ${
                            item.completed 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {completedCount === checklistItems.length && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIconSolid className="w-5 h-5 text-green-500 mr-2" />
                  <div>
                    <h3 className="font-medium text-green-800 text-sm">Setup Complete!</h3>
                    <p className="text-green-700 text-xs mt-0.5">
                      Your brand monitoring is now configured.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/brand" className="flex items-center p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <StarIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Manage Brand</span>
                </Link>
                <Link href="/dashboard/compliance" className="flex items-center p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <ShieldCheckIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">View Compliance</span>
                </Link>
                <Link href="/chat" className="flex items-center p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <ChartBarIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Get Insights</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Reserved for Future Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600 text-sm">
                Analytics and insights will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}