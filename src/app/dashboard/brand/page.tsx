'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  ExclamationTriangleIcon
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
import { exportBrandToPDF, copyBrandToClipboard, copyBrandWithPersonasToClipboard } from '@/utils/brandExport';
import { personas } from '@/lib/dummyData';

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
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const methods = useForm<BrandProfile>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: getInitialBrandProfile(),
    mode: 'onChange'
  });

  const { handleSubmit, reset, formState: { isValid, errors } } = methods;
  
  // Debug form state
  console.log('🔍 Form state:', { isValid, errors });

  // Handle escape key to close delete dialog
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDeleteDialog) {
        setShowDeleteDialog(false);
      }
    };

    if (showDeleteDialog) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDeleteDialog]);

  const loadBrandProfile = useCallback(async () => {
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
  }, [organization, reset]);

  // Load existing brand profile on mount
  useEffect(() => {
    if (isLoaded && organization) {
      loadBrandProfile();
    }
  }, [isLoaded, organization, loadBrandProfile]);

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

  const handleExportPDF = async () => {
    if (!brandProfile) return;
    
    try {
      await exportBrandToPDF(brandProfile);
      setNotification({ 
        message: `Brand profile exported to PDF successfully!`, 
        type: 'success' 
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setNotification({ 
        message: 'Failed to export PDF. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCopyJSON = async () => {
    if (!brandProfile) return;
    
    try {
      await copyBrandToClipboard(brandProfile);
      setNotification({ 
        message: `Brand profile JSON copied to clipboard!`, 
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

  const handleCopyJSONWithPersonas = async () => {
    if (!brandProfile) return;
    
    try {
      // Clean personas data by removing the icon component for JSON serialization
      const cleanPersonas = personas.map(persona => ({
        id: persona.id,
        name: persona.name,
        age: persona.age,
        occupation: persona.occupation,
        location: persona.location,
        income: persona.income,
        image: persona.image,
        description: persona.description,
        goals: persona.goals,
        painPoints: persona.painPoints,
        preferredChannels: persona.preferredChannels,
        buyingBehavior: persona.buyingBehavior,
        color: persona.color
      }));

      await copyBrandWithPersonasToClipboard(brandProfile, cleanPersonas);
      setNotification({ 
        message: `Brand profile with personas JSON copied to clipboard!`, 
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

  const handleDelete = async () => {
    if (!organization) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/brand', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete brand profile');
      }

      // Reset state after successful deletion
      setBrandProfile(null);
      setMode('create');
      setCurrentStep(0);
      setShowDeleteDialog(false);
      
      // Reset form to default values
      reset(getInitialBrandProfile());
      
      toast.success('Brand profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting brand profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete brand profile');
    } finally {
      setIsLoading(false);
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

        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
                <p className="text-gray-600 mt-1">Complete brand information for {organization.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                  Copy AI Brand
                </button>
                <button
                  onClick={handleCopyJSONWithPersonas}
                  className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                  Copy AI Brand w/Personas
                </button>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
          <BrandProfileView brandProfile={brandProfile} />
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteDialog(false)}
          >
            <div 
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Brand Profile</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete this brand profile? This action cannot be undone. 
                  All brand information, including company details, brand essence, visuals, and messaging will be permanently removed.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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