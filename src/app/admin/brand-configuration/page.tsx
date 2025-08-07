'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import toast from 'react-hot-toast'; // Unused import
import { 
  ClipboardDocumentIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import { BrandProfile } from '@/types/brand';
import { brandProfileSchema } from '@/lib/validations/brand';
import { getMaterHealthDummyData } from '@/lib/dummyData';
import CompanyInfoStep from '@/components/brand/CompanyInfoStep';
import BrandEssenceStep from '@/components/brand/BrandEssenceStep';
import BrandPersonalityStep from '@/components/brand/BrandPersonalityStep';
import BrandVisualsStep from '@/components/brand/BrandVisualsStep';
import TargetAudienceStep from '@/components/brand/TargetAudienceStep';
import CompetitiveLandscapeStep from '@/components/brand/CompetitiveLandscapeStep';
import MessagingStep from '@/components/brand/MessagingStep';
import ComplianceStep from '@/components/brand/ComplianceStep';

// Default empty brand profile
const getDefaultBrandProfile = (): BrandProfile => ({
  companyInfo: {
    companyName: '',
    industry: '',
    website: '',
    country: '',
    yearFounded: null,
    size: ''
  },
  brandEssence: {
    tagline: '',
    brandPurpose: '',
    mission: '',
    vision: '',
    values: [''],
    brandPromise: ''
  },
  brandPersonality: {
    archetype: '',
    traits: [''],
    voiceTone: {
      primaryTone: '',
      secondaryTone: ''
    }
  },
  brandVisuals: {
    logoURL: '',
    primaryColors: [{ name: '', hex: '' }],
    secondaryColors: [],
    typography: [{ name: '', usage: '' }],
    imageStyleDescription: ''
  },
  targetAudience: [{
    name: '',
    description: '',
    keyNeeds: '',
    demographics: ''
  }],
  competitiveLandscape: {
    primaryCompetitors: [],
    differentiators: ''
  },
  messaging: {
    elevatorPitch: '',
    keyMessages: [''],
    doNotSay: ''
  },
  compliance: {
    brandGuidelinesURL: '',
    trademarkStatus: '',
    notes: ''
  }
});

// Section configuration
const sections = [
  {
    id: 'company-info',
    title: 'Company Information',
    description: 'Basic information about the company',
    component: CompanyInfoStep
  },
  {
    id: 'brand-essence',
    title: 'Brand Essence',
    description: 'Core purpose, mission, vision, and values',
    component: BrandEssenceStep
  },
  {
    id: 'brand-personality',
    title: 'Brand Personality',
    description: 'Archetype, traits, and voice & tone',
    component: BrandPersonalityStep
  },
  {
    id: 'brand-visuals',
    title: 'Brand Visuals',
    description: 'Logo, colors, typography, and image style',
    component: BrandVisualsStep
  },
  {
    id: 'target-audience',
    title: 'Target Audience',
    description: 'Key audience segments and characteristics',
    component: TargetAudienceStep
  },
  {
    id: 'competitive-landscape',
    title: 'Competitive Landscape',
    description: 'Competitors and differentiators',
    component: CompetitiveLandscapeStep
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Key messages and communication guidelines',
    component: MessagingStep
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Brand guidelines and legal information',
    component: ComplianceStep
  }
];

export default function BrandConfigurationPage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'company-info': true,
    'brand-essence': false,
    'brand-personality': false,
    'brand-visuals': false,
    'target-audience': false,
    'competitive-landscape': false,
    'messaging': false,
    'compliance': false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const methods = useForm<BrandProfile>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: getDefaultBrandProfile(),
    mode: 'onChange'
  });

  const { handleSubmit, watch, formState: { isValid } } = methods;

  // Watch all form data for real-time JSON preview
  const watchedData = watch();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every(Boolean);
    const newState = !allExpanded;
    
    setExpandedSections(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: newState
      }), {})
    );
  };

  const copyJsonToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(watchedData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setNotification({ 
        message: 'JSON schema copied to clipboard!', 
        type: 'success' 
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setNotification({ 
        message: 'Failed to copy to clipboard. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const copyDummyDataToClipboard = async () => {
    try {
      const dummyData = getMaterHealthDummyData();
      const jsonString = JSON.stringify(dummyData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setNotification({ 
        message: 'Dummy data payload copied to clipboard!', 
        type: 'success' 
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error copying dummy data to clipboard:', error);
      setNotification({ 
        message: 'Failed to copy dummy data to clipboard. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const insertDummyData = () => {
    const dummyData = getMaterHealthDummyData();
    methods.reset(dummyData);
    setNotification({ 
      message: 'Dummy data inserted into form!', 
      type: 'success' 
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const onSubmit = async (data: BrandProfile) => {
    setIsLoading(true);
    try {
      // Here you could save the configuration template or perform other actions
      console.log('Brand Profile Configuration:', data);
      
      setNotification({ 
        message: 'Brand profile configuration saved successfully!', 
        type: 'success' 
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setNotification({ 
        message: 'Failed to save configuration. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const allExpanded = Object.values(expandedSections).every(Boolean);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-200 text-green-800' 
            : 'bg-red-100 border border-red-200 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Profile Configuration</h1>
            <p className="text-gray-600 mt-2">
              Configure the complete brand profile structure with all 8 sections. Use this as a template for brand profile creation.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={insertDummyData}
              className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              🧪 Insert Demo Data
            </button>
            <button
              onClick={toggleAllSections}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {allExpanded ? (
                <>
                  <ChevronUpIcon className="w-4 h-4 mr-2" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDownIcon className="w-4 h-4 mr-2" />
                  Expand All
                </>
              )}
            </button>
            <button
              onClick={copyJsonToClipboard}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
              Copy JSON Schema
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Sections */}
        <div className="lg:col-span-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {sections.map((section) => {
                const Component = section.component;
                const isExpanded = expandedSections[section.id];
                
                return (
                  <div key={section.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="p-6">
                        <Component />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* JSON Preview & Dummy Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* JSON Schema Preview */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">JSON Schema Preview</h3>
                <button
                  onClick={copyJsonToClipboard}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <ClipboardDocumentIcon className="w-3 h-3 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 border">
                <code className="text-gray-800">
                  {JSON.stringify(watchedData, null, 2)}
                </code>
              </pre>
            </div>
          </div>

          {/* Dummy Data Payload */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Demo Data Payload</h3>
                  <p className="text-sm text-gray-600 mt-1">Mater Health sample data from dashboard</p>
                </div>
                <button
                  onClick={copyDummyDataToClipboard}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                >
                  <ClipboardDocumentIcon className="w-3 h-3 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 border">
                <code className="text-gray-800">
                  {JSON.stringify(getMaterHealthDummyData(), null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
