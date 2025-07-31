'use client';

import React from 'react';
import Image from 'next/image';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  AcademicCapIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  image: string;
  description: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
  icon: React.ComponentType<any>;
  color: string;
}

const personas: Persona[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 32,
    occupation: 'Marketing Manager',
    location: 'Sydney, Australia',
    income: '$85,000 - $110,000',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
    description: 'Tech-savvy professional who values efficiency and quality. Early adopter of new products and services.',
    goals: [
      'Advance her career in marketing',
      'Maintain work-life balance',
      'Stay updated with latest trends',
      'Build professional network'
    ],
    painPoints: [
      'Limited time for research',
      'Information overload',
      'Difficulty finding trusted brands',
      'Budget constraints for premium products'
    ],
    preferredChannels: ['LinkedIn', 'Email', 'Webinars', 'Industry blogs'],
    buyingBehavior: 'Research-driven, reads reviews, compares options before purchasing',
    icon: BriefcaseIcon,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    age: 45,
    occupation: 'Small Business Owner',
    location: 'Melbourne, Australia',
    income: '$120,000 - $150,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    description: 'Experienced entrepreneur running a local retail business. Values reliability and long-term partnerships.',
    goals: [
      'Grow his business revenue',
      'Improve operational efficiency',
      'Build customer loyalty',
      'Expand to new markets'
    ],
    painPoints: [
      'Cash flow management',
      'Finding reliable suppliers',
      'Competing with larger businesses',
      'Managing multiple responsibilities'
    ],
    preferredChannels: ['Phone calls', 'In-person meetings', 'Industry magazines', 'Local networking'],
    buyingBehavior: 'Relationship-focused, prefers established vendors, values personal service',
    icon: ShoppingBagIcon,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 28,
    occupation: 'Registered Nurse',
    location: 'Brisbane, Australia',
    income: '$70,000 - $85,000',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    description: 'Caring healthcare professional focused on helping others. Values authentic brands with social impact.',
    goals: [
      'Provide excellent patient care',
      'Continue professional development',
      'Maintain physical and mental health',
      'Support causes she believes in'
    ],
    painPoints: [
      'Shift work affecting lifestyle',
      'Emotional stress from work',
      'Limited time for personal activities',
      'Student loan repayments'
    ],
    preferredChannels: ['Instagram', 'Facebook', 'Healthcare forums', 'Podcasts'],
    buyingBehavior: 'Values-driven, supports brands with social responsibility, influenced by peer recommendations',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-700'
  },
  {
    id: '4',
    name: 'David Kim',
    age: 55,
    occupation: 'IT Director',
    location: 'Perth, Australia',
    income: '$140,000 - $180,000',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    description: 'Senior technology executive with extensive experience. Values security, reliability, and proven solutions.',
    goals: [
      'Modernize company IT infrastructure',
      'Ensure cybersecurity compliance',
      'Mentor junior team members',
      'Plan for retirement'
    ],
    painPoints: [
      'Keeping up with rapid tech changes',
      'Budget approval processes',
      'Vendor management complexity',
      'Legacy system integration'
    ],
    preferredChannels: ['Industry conferences', 'Technical whitepapers', 'Vendor presentations', 'Professional networks'],
    buyingBehavior: 'Evidence-based, requires detailed documentation, prefers established enterprise solutions',
    icon: AcademicCapIcon,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: '5',
    name: 'Lisa Wilson',
    age: 38,
    occupation: 'Stay-at-home Parent',
    location: 'Adelaide, Australia',
    income: 'Household: $95,000 - $120,000',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    description: 'Dedicated mother of two managing household needs. Price-conscious but values quality for family products.',
    goals: [
      'Provide best for her children',
      'Manage household budget effectively',
      'Stay connected with other parents',
      'Maintain family health and wellness'
    ],
    painPoints: [
      'Limited personal time',
      'Balancing quality vs. cost',
      'Information overwhelm for product choices',
      'Managing children\'s schedules'
    ],
    preferredChannels: ['Facebook groups', 'Parenting blogs', 'YouTube reviews', 'Word of mouth'],
    buyingBehavior: 'Community-influenced, seeks recommendations, values family-friendly brands, bargain hunter',
    icon: HomeIcon,
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: '6',
    name: 'Alex Turner',
    age: 24,
    occupation: 'Graduate Student',
    location: 'Canberra, Australia',
    income: '$25,000 - $35,000',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
    description: 'Environmentally conscious student pursuing Masters degree. Values sustainability and authentic brand messaging.',
    goals: [
      'Complete degree successfully',
      'Find meaningful career opportunities',
      'Live sustainably',
      'Build professional network'
    ],
    painPoints: [
      'Limited budget',
      'Uncertain career prospects',
      'Student debt concerns',
      'Balancing study and part-time work'
    ],
    preferredChannels: ['TikTok', 'Instagram', 'University forums', 'Sustainability blogs'],
    buyingBehavior: 'Price-sensitive, values sustainability, influenced by social media, prefers ethical brands',
    icon: UserGroupIcon,
    color: 'bg-teal-100 text-teal-700'
  }
];

export default function PersonasPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Personas</h1>
            <p className="text-gray-600 mt-1">
              Detailed profiles of your target audience segments to guide marketing and product decisions.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {personas.length} Personas Defined
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last updated: Today
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Age Range</p>
                <p className="text-lg font-semibold text-gray-900">24 - 55</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BriefcaseIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Income Range</p>
                <p className="text-lg font-semibold text-gray-900">$25K - $180K</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <HomeIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Locations</p>
                <p className="text-lg font-semibold text-gray-900">6 Cities</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <HeartIcon className="w-8 h-8 text-pink-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Segments</p>
                <p className="text-lg font-semibold text-gray-900">Professional, Family, Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const IconComponent = persona.icon;
          return (
            <div key={persona.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Image
                      src={persona.image}
                      alt={persona.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${persona.color} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                    <p className="text-sm text-gray-600">{persona.occupation}</p>
                    <p className="text-xs text-gray-500 mt-1">{persona.location}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        Age {persona.age}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">
                        {persona.income}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 mb-4">{persona.description}</p>
                
                {/* Goals */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Goals</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {persona.goals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pain Points */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Pain Points</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {persona.painPoints.slice(0, 3).map((pain, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preferred Channels */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preferred Channels</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.preferredChannels.slice(0, 3).map((channel, index) => (
                      <span key={index} className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buying Behavior */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Buying Behavior</h4>
                  <p className="text-xs text-gray-600">{persona.buyingBehavior}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to create targeted campaigns?
          </h3>
          <p className="text-gray-600 mb-4">
            Use these personas to inform your marketing strategies, content creation, and product development decisions.
          </p>
          <div className="flex justify-center space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Create Campaign
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export Personas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}