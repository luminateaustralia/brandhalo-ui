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
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface ChannelAnalytics {
  id: string;
  name: string;
  type: 'website' | 'social' | 'communication' | 'marketing';
  icon: React.ComponentType<{ className?: string }>;
  brandScore: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversions: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    conversionRate: number;
  };
  traffic: {
    sessions: number;
    users: number;
    pageviews: number;
    bounceRate: number;
  };
  engagement: {
    avgSessionDuration: string;
    pagesPerSession: number;
    newUsers: number;
  };
  revenue: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const analyticsData: ChannelAnalytics[] = [
  // Websites
  {
    id: '1',
    name: 'Main Website',
    type: 'website',
    icon: GlobeAltIcon,
    brandScore: {
      current: 92,
      previous: 87,
      trend: 'up'
    },
    conversions: {
      current: 234,
      previous: 189,
      trend: 'up',
      conversionRate: 3.4
    },
    traffic: {
      sessions: 12847,
      users: 9234,
      pageviews: 28634,
      bounceRate: 42.3
    },
    engagement: {
      avgSessionDuration: '3:24',
      pagesPerSession: 2.8,
      newUsers: 7892
    },
    revenue: {
      current: 45200,
      previous: 38900,
      trend: 'up'
    }
  },
  {
    id: '2',
    name: 'Patient Portal',
    type: 'website',
    icon: GlobeAltIcon,
    brandScore: {
      current: 78,
      previous: 72,
      trend: 'up'
    },
    conversions: {
      current: 156,
      previous: 134,
      trend: 'up',
      conversionRate: 8.7
    },
    traffic: {
      sessions: 4567,
      users: 3234,
      pageviews: 8934,
      bounceRate: 23.4
    },
    engagement: {
      avgSessionDuration: '5:12',
      pagesPerSession: 4.2,
      newUsers: 567
    },
    revenue: {
      current: 0,
      previous: 0,
      trend: 'stable'
    }
  },
  {
    id: '3',
    name: 'Career Site',
    type: 'website',
    icon: GlobeAltIcon,
    brandScore: {
      current: 65,
      previous: 59,
      trend: 'up'
    },
    conversions: {
      current: 23,
      previous: 18,
      trend: 'up',
      conversionRate: 2.1
    },
    traffic: {
      sessions: 1234,
      users: 956,
      pageviews: 2456,
      bounceRate: 67.8
    },
    engagement: {
      avgSessionDuration: '2:08',
      pagesPerSession: 1.9,
      newUsers: 834
    },
    revenue: {
      current: 0,
      previous: 0,
      trend: 'stable'
    }
  },

  // Social Channels
  {
    id: '4',
    name: 'LinkedIn',
    type: 'social',
    icon: ChatBubbleLeftRightIcon,
    brandScore: {
      current: 88,
      previous: 85,
      trend: 'up'
    },
    conversions: {
      current: 45,
      previous: 32,
      trend: 'up',
      conversionRate: 1.8
    },
    traffic: {
      sessions: 2456,
      users: 2234,
      pageviews: 3456,
      bounceRate: 34.5
    },
    engagement: {
      avgSessionDuration: '1:45',
      pagesPerSession: 1.4,
      newUsers: 1890
    },
    revenue: {
      current: 8950,
      previous: 6750,
      trend: 'up'
    }
  },
  {
    id: '5',
    name: 'Facebook',
    type: 'social',
    icon: ChatBubbleLeftRightIcon,
    brandScore: {
      current: 82,
      previous: 78,
      trend: 'up'
    },
    conversions: {
      current: 67,
      previous: 54,
      trend: 'up',
      conversionRate: 2.3
    },
    traffic: {
      sessions: 3567,
      users: 3123,
      pageviews: 4892,
      bounceRate: 41.2
    },
    engagement: {
      avgSessionDuration: '2:12',
      pagesPerSession: 1.6,
      newUsers: 2456
    },
    revenue: {
      current: 12450,
      previous: 9870,
      trend: 'up'
    }
  },
  {
    id: '6',
    name: 'Instagram',
    type: 'social',
    icon: CameraIcon,
    brandScore: {
      current: 95,
      previous: 93,
      trend: 'up'
    },
    conversions: {
      current: 89,
      previous: 76,
      trend: 'up',
      conversionRate: 3.2
    },
    traffic: {
      sessions: 4892,
      users: 4234,
      pageviews: 6789,
      bounceRate: 28.9
    },
    engagement: {
      avgSessionDuration: '2:56',
      pagesPerSession: 1.8,
      newUsers: 3567
    },
    revenue: {
      current: 15670,
      previous: 13240,
      trend: 'up'
    }
  },
  {
    id: '7',
    name: 'YouTube',
    type: 'social',
    icon: PlayIcon,
    brandScore: {
      current: 71,
      previous: 68,
      trend: 'up'
    },
    conversions: {
      current: 34,
      previous: 28,
      trend: 'up',
      conversionRate: 1.9
    },
    traffic: {
      sessions: 1892,
      users: 1567,
      pageviews: 2345,
      bounceRate: 52.3
    },
    engagement: {
      avgSessionDuration: '4:23',
      pagesPerSession: 1.3,
      newUsers: 1234
    },
    revenue: {
      current: 5670,
      previous: 4890,
      trend: 'up'
    }
  },

  // Communication Channels
  {
    id: '8',
    name: 'Call Center',
    type: 'communication',
    icon: PhoneIcon,
    brandScore: {
      current: 85,
      previous: 82,
      trend: 'up'
    },
    conversions: {
      current: 456,
      previous: 423,
      trend: 'up',
      conversionRate: 36.7
    },
    traffic: {
      sessions: 1247,
      users: 1247,
      pageviews: 1247,
      bounceRate: 0
    },
    engagement: {
      avgSessionDuration: '4:23',
      pagesPerSession: 1.0,
      newUsers: 234
    },
    revenue: {
      current: 89340,
      previous: 82150,
      trend: 'up'
    }
  },

  // Marketing Channels
  {
    id: '9',
    name: 'Email Marketing',
    type: 'marketing',
    icon: EnvelopeIcon,
    brandScore: {
      current: 90,
      previous: 87,
      trend: 'up'
    },
    conversions: {
      current: 123,
      previous: 98,
      trend: 'up',
      conversionRate: 5.8
    },
    traffic: {
      sessions: 2123,
      users: 1987,
      pageviews: 3456,
      bounceRate: 24.5
    },
    engagement: {
      avgSessionDuration: '3:45',
      pagesPerSession: 2.1,
      newUsers: 456
    },
    revenue: {
      current: 23450,
      previous: 19870,
      trend: 'up'
    }
  },
  {
    id: '10',
    name: 'Radio Advertising',
    type: 'marketing',
    icon: SpeakerWaveIcon,
    brandScore: {
      current: 58,
      previous: 52,
      trend: 'up'
    },
    conversions: {
      current: 12,
      previous: 8,
      trend: 'up',
      conversionRate: 0.8
    },
    traffic: {
      sessions: 567,
      users: 456,
      pageviews: 678,
      bounceRate: 78.9
    },
    engagement: {
      avgSessionDuration: '1:12',
      pagesPerSession: 1.2,
      newUsers: 389
    },
    revenue: {
      current: 3450,
      previous: 2890,
      trend: 'up'
    }
  }
];

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    case 'down':
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    default:
      return <div className="w-4 h-4" />;
  }
};

const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const channelTypes = [
  { key: 'all', label: 'All Channels', count: analyticsData.length },
  { key: 'website', label: 'Websites', count: analyticsData.filter(c => c.type === 'website').length },
  { key: 'social', label: 'Social Media', count: analyticsData.filter(c => c.type === 'social').length },
  { key: 'communication', label: 'Communication', count: analyticsData.filter(c => c.type === 'communication').length },
  { key: 'marketing', label: 'Marketing', count: analyticsData.filter(c => c.type === 'marketing').length }
];

export default function AnalyticsPage() {
  const [selectedType, setSelectedType] = useState('all');
  
  const filteredChannels = selectedType === 'all' 
    ? analyticsData 
    : analyticsData.filter(channel => channel.type === selectedType);

  // Calculate overall metrics
  const totalSessions = analyticsData.reduce((sum, channel) => sum + channel.traffic.sessions, 0);
  const totalConversions = analyticsData.reduce((sum, channel) => sum + channel.conversions.current, 0);
  const totalRevenue = analyticsData.reduce((sum, channel) => sum + channel.revenue.current, 0);
  const averageBrandScore = Math.round(
    analyticsData.reduce((sum, channel) => sum + channel.brandScore.current, 0) / analyticsData.length
  );

  const totalPreviousConversions = analyticsData.reduce((sum, channel) => sum + channel.conversions.previous, 0);
  const conversionImprovement = ((totalConversions - totalPreviousConversions) / totalPreviousConversions * 100);

  const totalPreviousBrandScore = analyticsData.reduce((sum, channel) => sum + channel.brandScore.previous, 0) / analyticsData.length;
  const brandScoreImprovement = ((averageBrandScore - totalPreviousBrandScore) / totalPreviousBrandScore * 100);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Performance metrics and brand insights across all your digital touchpoints.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Last 30 Days
            </div>
            <div className="text-2xl font-bold mt-1 text-gray-900">
              Data Updated
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UsersIcon className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                  <p className="text-lg font-semibold text-gray-900">{totalSessions.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCartIcon className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Conversions</p>
                  <p className="text-lg font-semibold text-gray-900">{totalConversions}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    +{conversionImprovement.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Brand Score</p>
                  <p className="text-lg font-semibold text-gray-900">{averageBrandScore}/100</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    +{brandScoreImprovement.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CursorArrowRaysIcon className="w-8 h-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
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

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <div key={channel.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Brand Score:</span>
                          <span className="ml-1 text-sm font-medium text-gray-900">{channel.brandScore.current}/100</span>
                          <div className="ml-1 flex items-center">
                            {getTrendIcon(channel.brandScore.trend)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Conv. Rate:</span>
                          <span className="ml-1 text-sm font-medium text-gray-900">{channel.conversions.conversionRate}%</span>
                          <div className="ml-1 flex items-center">
                            {getTrendIcon(channel.conversions.trend)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Traffic Metrics */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Traffic
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Sessions</span>
                        <span className="text-xs font-medium text-gray-900">{channel.traffic.sessions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Users</span>
                        <span className="text-xs font-medium text-gray-900">{channel.traffic.users.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Pageviews</span>
                        <span className="text-xs font-medium text-gray-900">{channel.traffic.pageviews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Bounce Rate</span>
                        <span className="text-xs font-medium text-gray-900">{channel.traffic.bounceRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Conversions & Revenue */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <ShoppingCartIcon className="w-4 h-4 mr-1" />
                      Performance
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Conversions</span>
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-900">{channel.conversions.current}</span>
                          <span className={`text-xs ml-1 ${getTrendColor(channel.conversions.trend)}`}>
                            ({channel.conversions.previous > 0 ? 
                              ((channel.conversions.current - channel.conversions.previous) / channel.conversions.previous * 100).toFixed(0) : 
                              '+'
                            }%)
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Avg. Session</span>
                        <span className="text-xs font-medium text-gray-900">{channel.engagement.avgSessionDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Pages/Session</span>
                        <span className="text-xs font-medium text-gray-900">{channel.engagement.pagesPerSession}</span>
                      </div>
                      {channel.revenue.current > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Revenue</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-900">${channel.revenue.current.toLocaleString()}</span>
                            <span className={`text-xs ml-1 ${getTrendColor(channel.revenue.trend)}`}>
                              ({channel.revenue.previous > 0 ? 
                                ((channel.revenue.current - channel.revenue.previous) / channel.revenue.previous * 100).toFixed(0) : 
                                '+'
                              }%)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Brand Score Progress */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Brand Score Improvement</span>
                    <span className={`text-xs font-medium ${getTrendColor(channel.brandScore.trend)}`}>
                      {channel.brandScore.current - channel.brandScore.previous > 0 ? '+' : ''}
                      {channel.brandScore.current - channel.brandScore.previous} points
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${channel.brandScore.current}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}