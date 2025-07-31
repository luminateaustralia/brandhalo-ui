'use client';

import React, { useState } from 'react';
import { 
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  PlayIcon,
  CameraIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Channel {
  id: string;
  name: string;
  type: 'website' | 'social' | 'communication' | 'marketing';
  url?: string;
  icon: React.ComponentType<any>;
  brandScore: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  pageCount?: number;
  lastAudited: string;
  issues: string[];
  strengths: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

const channels: Channel[] = [
  // Websites
  {
    id: '1',
    name: 'Main Website',
    type: 'website',
    url: 'https://materhealth.com.au',
    icon: GlobeAltIcon,
    brandScore: 92,
    status: 'excellent',
    pageCount: 247,
    lastAudited: '2 days ago',
    issues: ['Minor color inconsistencies on 3 pages', 'Missing alt text on 2 images'],
    strengths: ['Consistent logo usage', 'Proper typography', 'Brand voice alignment'],
    metrics: [
      { label: 'Pages Audited', value: '247' },
      { label: 'Brand Compliant', value: '94%' },
      { label: 'Last Update', value: '2 days ago' }
    ]
  },
  {
    id: '2',
    name: 'Patient Portal',
    type: 'website',
    url: 'https://portal.materhealth.com.au',
    icon: GlobeAltIcon,
    brandScore: 78,
    status: 'good',
    pageCount: 45,
    lastAudited: '1 week ago',
    issues: ['Outdated logo on login page', 'Inconsistent button styles', 'Missing brand guidelines'],
    strengths: ['Good color usage', 'Proper spacing'],
    metrics: [
      { label: 'Pages Audited', value: '45' },
      { label: 'Brand Compliant', value: '78%' },
      { label: 'Last Update', value: '1 week ago' }
    ]
  },
  {
    id: '3',
    name: 'Career Site',
    type: 'website',
    url: 'https://careers.materhealth.com.au',
    icon: GlobeAltIcon,
    brandScore: 65,
    status: 'warning',
    pageCount: 28,
    lastAudited: '3 weeks ago',
    issues: ['Wrong font family used', 'Off-brand imagery', 'Inconsistent tone of voice'],
    strengths: ['Logo placement correct', 'Contact information accurate'],
    metrics: [
      { label: 'Pages Audited', value: '28' },
      { label: 'Brand Compliant', value: '65%' },
      { label: 'Last Update', value: '3 weeks ago' }
    ]
  },

  // Social Channels
  {
    id: '4',
    name: 'LinkedIn',
    type: 'social',
    url: 'https://linkedin.com/company/mater-health',
    icon: ChatBubbleLeftRightIcon,
    brandScore: 88,
    status: 'excellent',
    lastAudited: '1 day ago',
    issues: ['2 posts missing brand hashtags'],
    strengths: ['Consistent posting schedule', 'Professional tone', 'Proper logo usage'],
    metrics: [
      { label: 'Posts Analyzed', value: '156' },
      { label: 'Followers', value: '12.4K' },
      { label: 'Engagement Rate', value: '4.2%' }
    ]
  },
  {
    id: '5',
    name: 'Facebook',
    type: 'social',
    url: 'https://facebook.com/materhealth',
    icon: ChatBubbleLeftRightIcon,
    brandScore: 82,
    status: 'good',
    lastAudited: '3 days ago',
    issues: ['Inconsistent image filters', 'Some posts lack brand voice'],
    strengths: ['Regular engagement', 'Community building', 'Visual consistency'],
    metrics: [
      { label: 'Posts Analyzed', value: '89' },
      { label: 'Followers', value: '28.7K' },
      { label: 'Engagement Rate', value: '3.8%' }
    ]
  },
  {
    id: '6',
    name: 'Instagram',
    type: 'social',
    url: 'https://instagram.com/materhealth',
    icon: CameraIcon,
    brandScore: 95,
    status: 'excellent',
    lastAudited: '1 day ago',
    issues: [],
    strengths: ['Excellent visual consistency', 'Brand voice alignment', 'Story highlights on-brand'],
    metrics: [
      { label: 'Posts Analyzed', value: '124' },
      { label: 'Followers', value: '18.9K' },
      { label: 'Engagement Rate', value: '6.1%' }
    ]
  },
  {
    id: '7',
    name: 'YouTube',
    type: 'social',
    url: 'https://youtube.com/materhealth',
    icon: PlayIcon,
    brandScore: 71,
    status: 'warning',
    lastAudited: '1 week ago',
    issues: ['Inconsistent video thumbnails', 'Some videos lack proper branding', 'Outdated channel banner'],
    strengths: ['Good content quality', 'Consistent upload schedule'],
    metrics: [
      { label: 'Videos Analyzed', value: '34' },
      { label: 'Subscribers', value: '5.2K' },
      { label: 'Avg. View Time', value: '2:14' }
    ]
  },

  // Communication Channels
  {
    id: '8',
    name: 'Call Center',
    type: 'communication',
    icon: PhoneIcon,
    brandScore: 85,
    status: 'good',
    lastAudited: '5 days ago',
    issues: ['Some agents not using proper greeting', 'Hold music not brand-aligned'],
    strengths: ['Professional tone', 'Consistent messaging', 'Brand knowledge good'],
    metrics: [
      { label: 'Calls Monitored', value: '1,247' },
      { label: 'Avg. Call Time', value: '4:23' },
      { label: 'Satisfaction', value: '4.6/5' }
    ]
  },
  {
    id: '9',
    name: 'Email Marketing',
    type: 'marketing',
    icon: EnvelopeIcon,
    brandScore: 90,
    status: 'excellent',
    lastAudited: '2 days ago',
    issues: ['One template missing footer compliance'],
    strengths: ['Consistent templates', 'Brand voice excellent', 'Visual hierarchy clear'],
    metrics: [
      { label: 'Templates Audited', value: '23' },
      { label: 'Open Rate', value: '34.2%' },
      { label: 'Click Rate', value: '5.8%' }
    ]
  },
  {
    id: '10',
    name: 'Radio Advertising',
    type: 'marketing',
    icon: SpeakerWaveIcon,
    brandScore: 58,
    status: 'critical',
    lastAudited: '2 weeks ago',
    issues: ['Voice talent not aligned with brand', 'Script deviates from guidelines', 'Music selection off-brand'],
    strengths: ['Clear messaging', 'Call-to-action present'],
    metrics: [
      { label: 'Ads Analyzed', value: '8' },
      { label: 'Stations', value: '12' },
      { label: 'Reach', value: '180K' }
    ]
  }
];

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600 bg-green-100';
  if (score >= 80) return 'text-blue-600 bg-blue-100';
  if (score >= 70) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent':
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    case 'good':
      return <CheckCircleIcon className="w-5 h-5 text-blue-600" />;
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    case 'critical':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-600" />;
  }
};

const channelTypes = [
  { key: 'all', label: 'All Channels', count: channels.length },
  { key: 'website', label: 'Websites', count: channels.filter(c => c.type === 'website').length },
  { key: 'social', label: 'Social Media', count: channels.filter(c => c.type === 'social').length },
  { key: 'communication', label: 'Communication', count: channels.filter(c => c.type === 'communication').length },
  { key: 'marketing', label: 'Marketing', count: channels.filter(c => c.type === 'marketing').length }
];

export default function ChannelsPage() {
  const [selectedType, setSelectedType] = useState('all');
  
  const filteredChannels = selectedType === 'all' 
    ? channels 
    : channels.filter(channel => channel.type === selectedType);

  const averageScore = Math.round(channels.reduce((sum, channel) => sum + channel.brandScore, 0) / channels.length);
  const criticalChannels = channels.filter(channel => channel.status === 'critical').length;
  const excellentChannels = channels.filter(channel => channel.status === 'excellent').length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Channels</h1>
            <p className="text-gray-600 mt-1">
              Monitor brand compliance across all your digital and offline touchpoints.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Overall Brand Score
            </div>
            <div className={`text-2xl font-bold mt-1 px-3 py-1 rounded-lg ${getScoreColor(averageScore)}`}>
              {averageScore}/100
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Channels</p>
                <p className="text-lg font-semibold text-gray-900">{channels.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Excellent</p>
                <p className="text-lg font-semibold text-gray-900">{excellentChannels}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Needs Attention</p>
                <p className="text-lg font-semibold text-gray-900">{criticalChannels}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Last Audit</p>
                <p className="text-lg font-semibold text-gray-900">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {channelTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedType === type.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {type.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <div key={channel.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                      {channel.url && (
                        <p className="text-sm text-gray-500 break-all">{channel.url}</p>
                      )}
                      <div className="flex items-center mt-2">
                        {getStatusIcon(channel.status)}
                        <span className="ml-1 text-sm text-gray-600 capitalize">{channel.status}</span>
                        <span className="ml-3 text-xs text-gray-500">Updated {channel.lastAudited}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(channel.brandScore)}`}>
                    {channel.brandScore}/100
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-4">
                  {channel.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{metric.value}</p>
                      <p className="text-xs text-gray-500">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues & Strengths */}
              <div className="px-6 pb-6">
                {channel.issues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      Issues ({channel.issues.length})
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {channel.issues.slice(0, 2).map((issue, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {issue}
                        </li>
                      ))}
                      {channel.issues.length > 2 && (
                        <li className="text-gray-500 text-xs ml-3.5">
                          +{channel.issues.length - 2} more issues
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {channel.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Strengths ({channel.strengths.length})
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {channel.strengths.slice(0, 2).map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                      {channel.strengths.length > 2 && (
                        <li className="text-gray-500 text-xs ml-3.5">
                          +{channel.strengths.length - 2} more strengths
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Details
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-700">
                    Run Audit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}