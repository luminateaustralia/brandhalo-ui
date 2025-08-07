'use client';

export const runtime = 'edge';

import React from 'react';
import { 
  ShieldCheckIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function CompliancePage() {
  const brandGuidelines = {
    id: 4,
    title: 'Brand Guidelines',
    status: 'compliant',
    description: 'Internal brand usage and trademark guidelines',
    lastReviewed: '2024-01-20',
    category: 'Brand'
  };

  const complianceItems = [
    {
      id: 1,
      title: 'GDPR Compliance',
      status: 'compliant',
      description: 'General Data Protection Regulation compliance for EU customers',
      lastReviewed: '2024-01-15',
      category: 'Privacy'
    },
    {
      id: 2,
      title: 'CCPA Compliance',
      status: 'review-needed',
      description: 'California Consumer Privacy Act compliance requirements',
      lastReviewed: '2023-12-20',
      category: 'Privacy'
    },
    {
      id: 3,
      title: 'SOC 2 Type II',
      status: 'in-progress',
      description: 'Security controls and compliance certification',
      lastReviewed: '2024-01-10',
      category: 'Security'
    },
    {
      id: 5,
      title: 'Accessibility Standards',
      status: 'review-needed',
      description: 'WCAG 2.1 AA compliance for digital accessibility',
      lastReviewed: '2023-11-30',
      category: 'Accessibility'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'review-needed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'review-needed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'in-progress':
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const allItems = [brandGuidelines, ...complianceItems];
  const statusCounts = allItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage compliance requirements, certifications, and regulatory standards.
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Generate Report
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Compliant</p>
                <p className="text-lg font-semibold text-gray-900">{statusCounts.compliant || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Review Needed</p>
                <p className="text-lg font-semibold text-gray-900">{statusCounts['review-needed'] || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <InformationCircleIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-lg font-semibold text-gray-900">{statusCounts['in-progress'] || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <p className="text-lg font-semibold text-gray-900">{allItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Guidelines Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-purple-200 bg-purple-100/50">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Brand Guidelines Compliance</h2>
          </div>
          <p className="text-sm text-purple-700 mt-1">Core brand governance and usage standards</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">{brandGuidelines.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(brandGuidelines.status)}`}>
                  {getStatusIcon(brandGuidelines.status)}
                  <span className="ml-1 capitalize">{brandGuidelines.status.replace('-', ' ')}</span>
                </span>
              </div>
              <p className="text-gray-600 mt-1">{brandGuidelines.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-xs text-gray-500">
                  Category: <span className="font-medium">{brandGuidelines.category}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Last Reviewed: <span className="font-medium">{new Date(brandGuidelines.lastReviewed).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <DocumentTextIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Compliance Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Other Compliance Requirements</h2>
          <p className="text-sm text-gray-500 mt-1">Track your organisation&apos;s compliance status across regulatory and operational areas</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {complianceItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-xs text-gray-500">
                      Category: <span className="font-medium">{item.category}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Last Reviewed: <span className="font-medium">{new Date(item.lastReviewed).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <DocumentTextIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900 ml-3">Compliance Audit</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Run a comprehensive audit of all compliance requirements and generate a detailed report.
          </p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Start Audit
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900 ml-3">Policy Updates</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Review and update your compliance policies to ensure they meet current requirements.
          </p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Review Policies
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-100">
          <div className="flex items-center mb-4">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900 ml-3">Training Center</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Access compliance training materials and certification programs for your team.
          </p>
          <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            View Training
          </button>
        </div>
      </div>
    </div>
  );
}