'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { 
  CheckIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

import { BrandProfile, FormMode, FormStep, BrandStatus } from '@/types/brand';
import { brandProfileSchema } from '@/lib/validations/brand';
import { z } from 'zod';
import Select from '@/components/brand/inputs/Select';
import { getMaterHealthDummyData } from '@/lib/dummyData';
// import BrandStepProgress from '@/components/brand/BrandStepProgress'; // Unused import
import CompanyInfoStep from '@/components/brand/CompanyInfoStep';
import BrandEssenceStep from '@/components/brand/BrandEssenceStep';
import BrandPersonalityStep from '@/components/brand/BrandPersonalityStep';
import BrandVisualsStep from '@/components/brand/BrandVisualsStep';
import TargetAudienceStep from '@/components/brand/TargetAudienceStep';
import CompetitiveLandscapeStep from '@/components/brand/CompetitiveLandscapeStep';
import MessagingStep from '@/components/brand/MessagingStep';
import ComplianceStep from '@/components/brand/ComplianceStep';
import BrandProfileView from '@/components/brand/BrandProfileView';
import BrandGuidedSetup from '@/components/brand/BrandGuidedSetup';
import { exportBrandToPDF } from '@/utils/brandExport';

type BrandProfileForm = z.infer<typeof brandProfileSchema>;

// Default empty brand profile
const getDefaultBrandProfile = (): BrandProfileForm => ({
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
  },
  version: 1,
  status: 'draft'
});

// Get initial brand profile data (empty by default)
const getInitialBrandProfile = (): BrandProfile => {
  return getDefaultBrandProfile();
};

// Normalize stored/ingested brand data to match our schema
function isValidUrlString(value: unknown): boolean {
  if (typeof value !== 'string' || value.trim() === '') return false;
  
  // Handle specific invalid cases from autodiscovery
  const trimmed = value.trim().toLowerCase();
  if (trimmed === 'not discovered' || trimmed === 'not available' || trimmed === 'n/a' || trimmed === 'none') {
    return false;
  }
  
  try {
    // Allow protocol-less domains by prepending https for validation only
    const candidate = value.match(/^https?:\/\//) ? value : `https://${value}`;
    // eslint-disable-next-line no-new
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}

function normalizeBrandData(raw: any): BrandProfileForm {
  const data: any = { ...getDefaultBrandProfile(), ...(raw || {}) };

  // Company info
  if (!isValidUrlString(data.companyInfo?.website)) {
    if (data?.companyInfo) data.companyInfo.website = '';
  }

  // Brand essence
  if (!Array.isArray(data.brandEssence?.values)) {
    const v = data.brandEssence?.values;
    data.brandEssence.values = typeof v === 'string' ? [v] : [''];
  }

  // Personality
  if (!Array.isArray(data.brandPersonality?.traits)) {
    const t = data.brandPersonality?.traits;
    data.brandPersonality.traits = typeof t === 'string' ? [t] : [''];
  }

  // Visuals
  if (!isValidUrlString(data.brandVisuals?.logoURL)) {
    if (data?.brandVisuals) data.brandVisuals.logoURL = '';
  }
  if (!Array.isArray(data.brandVisuals?.primaryColors)) {
    data.brandVisuals.primaryColors = [{ name: '', hex: '' }];
  }
  if (!Array.isArray(data.brandVisuals?.secondaryColors)) {
    data.brandVisuals.secondaryColors = [];
  }
  if (!Array.isArray(data.brandVisuals?.typography)) {
    data.brandVisuals.typography = [{ name: '', usage: '' }];
  }

  // Target audience
  if (!Array.isArray(data.targetAudience)) {
    data.targetAudience = [{ name: '', description: '', keyNeeds: '', demographics: '' }];
  } else {
    data.targetAudience = data.targetAudience.map((a: any) => {
      if (typeof a === 'string') {
        return { name: a, description: '', keyNeeds: '', demographics: '' };
      }
      return {
        name: a?.name ?? '',
        description: a?.description ?? '',
        keyNeeds: a?.keyNeeds ?? '',
        demographics: a?.demographics ?? ''
      };
    });
  }

  // Competitive landscape
  const comp = data.competitiveLandscape ?? {};
  if (!Array.isArray(comp.primaryCompetitors)) {
    comp.primaryCompetitors = [];
  } else {
    comp.primaryCompetitors = comp.primaryCompetitors.map((c: any) => {
      if (typeof c === 'string') {
        return { name: c, website: '', positioning: '' };
      }
      return {
        name: c?.name ?? '',
        website: isValidUrlString(c?.website) ? c.website : '',
        positioning: c?.positioning ?? ''
      };
    });
  }
  comp.differentiators = typeof comp.differentiators === 'string' ? comp.differentiators : '';
  data.competitiveLandscape = comp;

  // Messaging
  if (!Array.isArray(data.messaging?.keyMessages)) {
    const km = data.messaging?.keyMessages;
    data.messaging.keyMessages = typeof km === 'string' ? [km] : [''];
  }

  // Compliance
  if (!isValidUrlString(data.compliance?.brandGuidelinesURL)) {
    if (data?.compliance) data.compliance.brandGuidelinesURL = '';
  }
  data.compliance.trademarkStatus = typeof data.compliance?.trademarkStatus === 'string' ? data.compliance.trademarkStatus : '';
  data.compliance.notes = typeof data.compliance?.notes === 'string' ? data.compliance.notes : '';

  // Meta
  data.version = Number.isInteger(data.version) && data.version > 0 ? data.version : 1;
  const validStatuses: BrandStatus[] = ['draft', 'pending_approval', 'approved'];
  data.status = validStatuses.includes(data.status) ? data.status : 'draft';

  return data as BrandProfileForm;
}

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
  const [, setCurrentStep] = useState(0); // currentStep not currently used, but setter is needed for form navigation
  const [isLoading, setIsLoading] = useState(false);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [localVersion, setLocalVersion] = useState<number>(1);
  const [localStatus, setLocalStatus] = useState<BrandStatus>('draft');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDummyDataButton, setShowDummyDataButton] = useState(false);
  const [showGuidedSetup, setShowGuidedSetup] = useState(false);
  // const [isAnimating, setIsAnimating] = useState(false); // Unused variable
  // const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward'); // Unused variable
  
  // Accordion state for expanded sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'company-info': true,  // Company Information expanded by default
    'brand-essence': false,
    'brand-personality': false,
    'brand-visuals': false,
    'target-audience': false,
    'competitive-landscape': false,
    'messaging': false,
    'compliance': false
  });

  const methods = useForm<BrandProfileForm>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: getInitialBrandProfile(),
    mode: 'onChange'
  });

  const { handleSubmit, reset, formState: { isValid, errors } } = methods;
  const [showValidationNudge, setShowValidationNudge] = useState(false);

  // Determine if a section contains any validation errors
  const sectionHasErrors = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'company-info':
        return Boolean(errors?.companyInfo);
      case 'brand-essence':
        return Boolean(errors?.brandEssence);
      case 'brand-personality':
        return Boolean(errors?.brandPersonality);
      case 'brand-visuals':
        return Boolean(errors?.brandVisuals);
      case 'target-audience':
        return Boolean(errors?.targetAudience);
      case 'competitive-landscape':
        return Boolean(errors?.competitiveLandscape);
      case 'messaging':
        return Boolean(errors?.messaging);
      case 'compliance':
        return Boolean(errors?.compliance);
      default:
        return false;
    }
  }, [errors]);
  
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
      const response = await fetch(`/api/brand${organization?.id ? `?orgId=${encodeURIComponent(organization.id)}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeBrandData(data.brandData);
        const parsed = brandProfileSchema.parse(normalized);
        setBrandProfile(parsed);
        reset(parsed);
        if (parsed?.version) setLocalVersion(parsed.version);
        if (parsed?.status) setLocalStatus(parsed.status);
        setMode('view');
      } else if (response.status === 404) {
        // No brand profile exists yet - show guided setup
        console.log('🔍 No brand profile found (404). Showing guided setup');
        setShowGuidedSetup(true);
      } else {
        throw new Error('Failed to load brand profile');
      }
    } catch (error) {
      console.error('Error loading brand profile:', error);
      // Show guided setup when there's an error loading
      console.log('🔍 Showing guided setup (error case)');
      setShowGuidedSetup(true);
      toast.error('Failed to load brand profile');
    } finally {
      setIsLoading(false);
    }
  }, [organization, reset]);

  // Handler to insert dummy data manually
  const handleInsertDummyData = () => {
    if (!organization?.id) return;
    
    const dummyData = getMaterHealthDummyData(organization.id);
    reset(dummyData);
    setShowDummyDataButton(false);
    toast.success('Dummy data inserted!');
    console.log('🧪 Manually inserted dummy data for org:', organization.id);
  };

  // Handler for guided setup option selection
  const handleGuidedSetupOption = (option: 'autodiscover' | 'manual') => {
    if (option === 'manual') {
      // Start manual build - go to step 1 of the form
      setShowGuidedSetup(false);
      setMode('create');
      setCurrentStep(0);
    }
    // For autodiscover, the BrandGuidedSetup component handles the flow internally
  };

  // Handler for successful autodiscovery completion
  const handleAutodiscoveryComplete = () => {
    // Reload the brand profile to get the newly created data
    loadBrandProfile();
    setShowGuidedSetup(false);
    toast.success('Brand profile created successfully!');
  };

  // Toggle section expansion for accordion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Load existing brand profile on mount
  useEffect(() => {
    if (isLoaded && organization) {
      loadBrandProfile();
    }
  }, [isLoaded, organization, loadBrandProfile]);

  const onSubmit = async (data: BrandProfileForm) => {
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
        body: JSON.stringify({ ...data, version: localVersion, status: localStatus })
      });

      console.log('🔥 API Response status:', response.status, response.statusText);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ API Error response:', error);
        throw new Error(error.error || 'Failed to save brand profile');
      }

      const result = await response.json();
      console.log('🔥 API Success response:', result);
      
      setBrandProfile({ ...data, version: localVersion, status: localStatus });
      setMode('view');
      setShowDummyDataButton(false); // Hide dummy data button after successful creation
      toast.success(mode === 'create' ? 'Brand profile created successfully!' : 'Brand profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving brand profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save brand profile');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleNext = () => { // Unused function
  //   if (currentStep < formSteps.length - 1) {
  //     setIsAnimating(true);
  //     setAnimationDirection('forward');
  //     setTimeout(() => {
  //       setCurrentStep(currentStep + 1);
  //       setIsAnimating(false);
  //     }, 150);
  //   }
  // };

  // const handlePrevious = () => { // Unused function
  //   if (currentStep > 0) {
  //     setIsAnimating(true);
  //     setAnimationDirection('backward');
  //     setTimeout(() => {
  //       setCurrentStep(currentStep - 1);
  //       setIsAnimating(false);
  //     }, 150);
  //   }
  // };

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

  // const renderStepContent = () => { // Unused function
  //   const stepId = formSteps[currentStep].id;
  //   
  //   switch (stepId) {
  //     case 'company-info':
  //       return <CompanyInfoStep />;
  //     case 'brand-essence':
  //       return <BrandEssenceStep />;
  //     case 'brand-personality':
  //       return <BrandPersonalityStep />;
  //     case 'brand-visuals':
  //       return <BrandVisualsStep />;
  //     case 'target-audience':
  //       return <TargetAudienceStep />;
  //     case 'competitive-landscape':
  //       return <CompetitiveLandscapeStep />;
  //     case 'messaging':
  //       return <MessagingStep />;
  //     case 'compliance':
  //       return <ComplianceStep />;
  //     default:
  //       return null;
  //   }
  // };

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

  // Show guided setup when no brand exists and not in dev mode
  if (showGuidedSetup) {
    console.log('🔍 Rendering guided setup UI');
    return (
      <BrandGuidedSetup
        onSelectOption={handleGuidedSetupOption}
        onAutodiscoveryComplete={handleAutodiscoveryComplete}
      />
    );
  }

  // View mode - show completed brand profile
  if (mode === 'view' && brandProfile) {
    return (
      <div className="w-full flex flex-col lg:flex-row">
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

        {/* Main Content */}
        <div className="flex-1 lg:pr-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
                <p className="text-gray-600 mt-1">Complete brand information for {organization.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Version v{brandProfile.version ?? 1}</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                  (brandProfile.status ?? 'draft') === 'approved' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : (brandProfile.status ?? 'draft') === 'pending_approval' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  Status {(brandProfile.status ?? 'draft').replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <BrandProfileView brandProfile={brandProfile} />
        </div>

        {/* Right Side Action Menu */}
        <div className="w-full lg:w-64 flex-shrink-0 mt-6 lg:mt-0">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-900">Actions</h3>
              </div>
              <div className="p-3 space-y-2 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-2">
                <button
                  onClick={handleExportPDF}
                  className="w-full inline-flex items-center px-3 py-2.5 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  Export PDF
                </button>

                <button
                  onClick={handleEdit}
                  className="w-full inline-flex items-center px-3 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full inline-flex items-center px-3 py-2.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
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
          <div className="flex items-center gap-3">
            {/* Version and Status controls */}
            <div className="hidden sm:flex items-center gap-2 mr-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Version</label>
                <input
                  type="number"
                  min={1}
                  value={localVersion}
                  onChange={(e) => setLocalVersion(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Status</label>
                <Select
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value as BrandStatus)}
                  className="w-44"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending approval</option>
                  <option value="approved">Approved</option>
                </Select>
              </div>
            </div>
            {/* Discrete Dummy Data Button */}
            {showDummyDataButton && mode === 'create' && (
              <button
                onClick={handleInsertDummyData}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                title="Insert sample data for testing"
              >
                🧪 Insert Demo Data
              </button>
            )}
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
      </div>

      {/* Form Content - Accordion Layout */}
      <div className="flex-1 overflow-y-auto pb-32 pr-4 min-h-0">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formSteps.map((step) => (
              <div key={step.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(step.id)}
                  className={`w-full px-6 py-4 text-left transition-colors duration-200 flex items-center justify-between border-b
                    ${!expandedSections[step.id] && sectionHasErrors(step.id)
                      ? 'bg-red-50 hover:bg-red-100 focus:bg-red-100 border-red-200'
                      : 'bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 border-gray-200'}`}
                >
                  <div>
                    <h3 className={`text-lg font-medium ${!expandedSections[step.id] && sectionHasErrors(step.id) ? 'text-red-800' : 'text-gray-900'}`}>{step.title}</h3>
                    <p className={`text-sm mt-1 ${!expandedSections[step.id] && sectionHasErrors(step.id) ? 'text-red-700' : 'text-gray-500'}`}>{step.description}</p>
                  </div>
                  {expandedSections[step.id] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className={`w-5 h-5 ${sectionHasErrors(step.id) ? 'text-red-400' : 'text-gray-400'}`} />
                  )}
                </button>

                {/* Section Content */}
                {expandedSections[step.id] && (
                  <div className="px-6 py-6 border-t border-gray-200">
                    {step.id === 'company-info' && <CompanyInfoStep />}
                    {step.id === 'brand-essence' && <BrandEssenceStep />}
                    {step.id === 'brand-personality' && <BrandPersonalityStep />}
                    {step.id === 'brand-visuals' && <BrandVisualsStep />}
                    {step.id === 'target-audience' && <TargetAudienceStep />}
                    {step.id === 'competitive-landscape' && <CompetitiveLandscapeStep />}
                    {step.id === 'messaging' && <MessagingStep />}
                    {step.id === 'compliance' && <ComplianceStep />}
                  </div>
                )}
              </div>
            ))}
          </form>
        </FormProvider>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-8 py-4 shadow-lg z-50">
        <div className="flex justify-end items-center gap-4">
          {/* Subtle validation nudge */}
          <div
            aria-live="polite"
            className={`flex items-center text-sm text-red-600 transition-all duration-200 ${
              !isValid && showValidationNudge ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
            <span>Please fix the highlighted fields</span>
          </div>

          <button
            onClick={async (e) => {
              console.log('🔥 Save button clicked!');
              console.log('🔥 Current form state valid:', isValid);
              console.log('🔥 Is loading:', isLoading);
              // Trigger validation to surface errors/focus
              const valid = await methods.trigger();
              if (!valid) {
                setShowValidationNudge(true);
                setTimeout(() => setShowValidationNudge(false), 2200);
              }
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
        </div>
      </div>
    </div>
  );
}