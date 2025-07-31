'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

import { BrandProfile, FormMode, FormStep } from '@/types/brand';
import { brandProfileSchema } from '@/lib/validations/brand';
import { getMaterHealthDummyData, shouldUseDummyData } from '@/lib/dummyData';
import BrandStepProgress from '@/components/brand/BrandStepProgress';
import CompanyInfoStep from '@/components/brand/CompanyInfoStep';
import BrandEssenceStep from '@/components/brand/BrandEssenceStep';
import BrandPersonalityStep from '@/components/brand/BrandPersonalityStep';
import BrandVisualsStep from '@/components/brand/BrandVisualsStep';
import TargetAudienceStep from '@/components/brand/TargetAudienceStep';
import CompetitiveLandscapeStep from '@/components/brand/CompetitiveLandscapeStep';
import MessagingStep from '@/components/brand/MessagingStep';
import ComplianceStep from '@/components/brand/ComplianceStep';
import BrandProfileView from '@/components/brand/BrandProfileView';

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

// Get initial brand profile data (with dummy data if ENV=local)
const getInitialBrandProfile = (): BrandProfile => {
  if (shouldUseDummyData()) {
    console.log('🧪 Using Mater Health dummy data for local development');
    return getMaterHealthDummyData();
  }
  return getDefaultBrandProfile();
};

// Form steps configuration
const formSteps: FormStep[] = [
  {
    id: 'company-info',
    title: 'Company Information',
    description: 'Basic information about your company',
    fields: ['companyName', 'industry', 'website', 'country', 'yearFounded', 'size']
  },
  {
    id: 'brand-essence',
    title: 'Brand Essence',
    description: 'Core purpose, mission, vision, and values',
    fields: ['tagline', 'brandPurpose', 'mission', 'vision', 'values', 'brandPromise']
  },
  {
    id: 'brand-personality',
    title: 'Brand Personality',
    description: 'Archetype, traits, and voice & tone',
    fields: ['archetype', 'traits', 'voiceTone']
  },
  {
    id: 'brand-visuals',
    title: 'Brand Visuals',
    description: 'Logo, colors, typography, and image style',
    fields: ['logoURL', 'primaryColors', 'secondaryColors', 'typography', 'imageStyleDescription']
  },
  {
    id: 'target-audience',
    title: 'Target Audience',
    description: 'Define your key audience segments',
    fields: ['targetAudience']
  },
  {
    id: 'competitive-landscape',
    title: 'Competitive Landscape',
    description: 'Competitors and differentiators',
    fields: ['primaryCompetitors', 'differentiators']
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Key messages and communication guidelines',
    fields: ['elevatorPitch', 'keyMessages', 'doNotSay']
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Brand guidelines and legal information',
    fields: ['brandGuidelinesURL', 'trademarkStatus', 'notes']
  }
];

export default function BrandPage() {
  const { organization, isLoaded } = useOrganization();
  const [mode, setMode] = useState<FormMode>('create');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);

  const methods = useForm<BrandProfile>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: getInitialBrandProfile(),
    mode: 'onChange'
  });

  const { handleSubmit, reset, formState: { isValid, errors } } = methods;
  
  // Debug form state
  console.log('🔍 Form state:', { isValid, errors });

  // Load existing brand profile on mount
  useEffect(() => {
    if (isLoaded && organization) {
      loadBrandProfile();
    }
  }, [isLoaded, organization]);

  const loadBrandProfile = async () => {
    if (!organization) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/brand');
      if (response.ok) {
        const data = await response.json();
        setBrandProfile(data.brandData);
        reset(data.brandData);
        setMode('view');
      } else if (response.status === 404) {
        // No brand profile exists yet, stay in create mode
        // Pre-populate with dummy data if ENV=local
        if (shouldUseDummyData()) {
          const dummyData = getMaterHealthDummyData();
          reset(dummyData);
          console.log('🧪 Pre-populated form with Mater Health dummy data');
        }
        setMode('create');
      } else {
        throw new Error('Failed to load brand profile');
      }
    } catch (error) {
      console.error('Error loading brand profile:', error);
      // Pre-populate with dummy data if ENV=local and there's an error
      if (shouldUseDummyData()) {
        const dummyData = getMaterHealthDummyData();
        reset(dummyData);
        console.log('🧪 Pre-populated form with Mater Health dummy data (fallback)');
        setMode('create');
      } else {
        toast.error('Failed to load brand profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BrandProfile) => {
    console.log('🔥 onSubmit called with data:', data);
    console.log('🔥 Organization:', organization);
    console.log('🔥 Mode:', mode);
    
    if (!organization) {
      console.error('❌ No organization found');
      return;
    }

    setIsLoading(true);
    try {
      const url = '/api/brand';
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      console.log('🔥 Making API request:', { url, method });
      console.log('🔥 Request body:', JSON.stringify(data, null, 2));
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('🔥 API Response status:', response.status, response.statusText);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ API Error response:', error);
        throw new Error(error.error || 'Failed to save brand profile');
      }

      const result = await response.json();
      console.log('🔥 API Success response:', result);
      
      setBrandProfile(data);
      setMode('view');
      toast.success(mode === 'create' ? 'Brand profile created successfully!' : 'Brand profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving brand profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save brand profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = () => {
    setMode('edit');
    setCurrentStep(0);
  };

  const handleCancelEdit = () => {
    if (brandProfile) {
      reset(brandProfile);
      setMode('view');
    }
  };

  const renderStepContent = () => {
    const stepId = formSteps[currentStep].id;
    
    switch (stepId) {
      case 'company-info':
        return <CompanyInfoStep />;
      case 'brand-essence':
        return <BrandEssenceStep />;
      case 'brand-personality':
        return <BrandPersonalityStep />;
      case 'brand-visuals':
        return <BrandVisualsStep />;
      case 'target-audience':
        return <TargetAudienceStep />;
      case 'competitive-landscape':
        return <CompetitiveLandscapeStep />;
      case 'messaging':
        return <MessagingStep />;
      case 'compliance':
        return <ComplianceStep />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Required</h2>
        <p className="text-gray-600">Please select or create an organization to manage your brand profile.</p>
      </div>
    );
  }

  // View mode - show completed brand profile
  if (mode === 'view' && brandProfile) {
    return (
      <div className="w-full">
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
                <p className="text-gray-600 mt-1">Complete brand information for {organization.name}</p>
              </div>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
          <BrandProfileView brandProfile={brandProfile} />
        </div>
      </div>
    );
  }

  // Form mode - create or edit
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create Brand Profile' : 'Edit Brand Profile'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Define your brand identity and guidelines' 
                : 'Update your brand information'
              }
            </p>
          </div>
          {mode === 'edit' && (
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Combined Progress + Form Content - All Scrollable */}
      <div className="flex-1 overflow-y-auto pb-32 pr-4 min-h-0">
        <BrandStepProgress 
          steps={formSteps} 
          currentStep={currentStep} 
          onStepClick={setCurrentStep}
        />
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              {renderStepContent()}
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Sticky Navigation */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-8 py-4 shadow-lg z-50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {formSteps.length}
            </span>
            
            {currentStep === formSteps.length - 1 ? (
              <button
                onClick={(e) => {
                  console.log('🔥 Save button clicked!');
                  console.log('🔥 Current form state valid:', isValid);
                  console.log('🔥 Is loading:', isLoading);
                  handleSubmit(onSubmit)(e);
                }}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Save Brand Profile
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}