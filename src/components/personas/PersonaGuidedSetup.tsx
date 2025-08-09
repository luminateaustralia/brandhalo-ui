'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  PencilIcon, 
  SparklesIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';

// Validation schema for persona autodiscovery
const autodiscoverySchema = z.object({
  selectedBrandId: z.string().min(1, 'Please select a brand profile')
});

type AutodiscoveryFormData = z.infer<typeof autodiscoverySchema>;

interface PersonaGuidedSetupProps {
  onSelectOption: (option: 'autodiscover' | 'manual') => void;
  onAutodiscoveryComplete: () => void;
}

interface BrandOption {
  id: string;
  name: string;
  profile: BrandProfile;
}

export default function PersonaGuidedSetup({ onSelectOption, onAutodiscoveryComplete }: PersonaGuidedSetupProps) {
  const { organization } = useOrganization();
  const [selectedOption, setSelectedOption] = useState<'autodiscover' | 'manual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandOptions, setBrandOptions] = useState<BrandOption[]>([]);
  
  // Debug state for local development
  const [debugInfo, setDebugInfo] = useState<{
    input: Record<string, unknown>;
    response: Record<string, unknown> | null;
    timestamp: string;
  } | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'local';
  
  // Debug the environment check
  useEffect(() => {
    console.log('🔍 PersonaGuidedSetup Environment Check:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      isDevelopment
    });
  }, [isDevelopment]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<AutodiscoveryFormData>({
    resolver: zodResolver(autodiscoverySchema),
    mode: 'onChange'
  });

  const selectedBrandId = watch('selectedBrandId');

  // Fetch available brand profiles
  useEffect(() => {
    const fetchBrands = async () => {
      if (!organization?.id) return;
      
      setIsLoadingBrands(true);
      try {
        // For now, fetch the current organization's brand profile
        // Later this can be expanded to support multiple brands
        const response = await fetch('/api/brand');
        if (response.ok) {
          const brandEntity = await response.json();
          const brandOption: BrandOption = {
            id: brandEntity.id,
            name: brandEntity.brandData.companyInfo.companyName || 'My Brand',
            profile: brandEntity.brandData
          };
          setBrandOptions([brandOption]);
        } else if (response.status === 404) {
          // No brand profile exists
          setBrandOptions([]);
        }
      } catch (error) {
        console.error('Error fetching brand profiles:', error);
        setBrandOptions([]);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [organization?.id]);

  const handleAutodiscovery = async (data: AutodiscoveryFormData) => {
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }

    // Find the selected brand
    const selectedBrand = brandOptions.find(brand => brand.id === data.selectedBrandId);
    if (!selectedBrand) {
      toast.error('Selected brand not found');
      return;
    }

    setIsLoading(true);
    try {
      // Create complete brand profile data in same format as UseBrand export
      const brandProfile = selectedBrand.profile;
      const completeBrandData = {
        timestamp: new Date().toISOString(),
        organization: organization?.name || organization?.slug || 'Unknown',
        brand: {
          companyInfo: brandProfile.companyInfo || {},
          brandEssence: brandProfile.brandEssence || {},
          brandPersonality: brandProfile.brandPersonality || {},
          brandVisuals: {
            logoURL: brandProfile.brandVisuals?.logoURL,
            primaryColors: brandProfile.brandVisuals?.primaryColors || [],
            secondaryColors: brandProfile.brandVisuals?.secondaryColors || [],
            typography: brandProfile.brandVisuals?.typography || [],
            imageStyleDescription: brandProfile.brandVisuals?.imageStyleDescription
          },
          targetAudience: brandProfile.targetAudience || [],
          competitiveLandscape: brandProfile.competitiveLandscape || {},
          messaging: brandProfile.messaging || {},
          compliance: brandProfile.compliance || {}
        }
      };

      // Store debug info for development
      if (isDevelopment) {
        console.log('🔍 Setting debug info with completeBrandData:', completeBrandData);
        setDebugInfo({
          input: completeBrandData,
          response: null,
          timestamp: new Date().toISOString()
        });
        setShowDebug(true);
      }

      // Call the OpenAI assistant API for persona generation
      const response = await fetch('/api/personas-autodiscovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeBrandData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate personas');
      }

      const personaGenerationResponse = await response.json();

      // Update debug info with response
      if (isDevelopment && debugInfo) {
        console.log('🔍 Updating debug info with response:', personaGenerationResponse);
        setDebugInfo({
          ...debugInfo,
          response: personaGenerationResponse
        });
      }

      // Create each persona using the existing API
      let successCount = 0;
      for (const personaData of personaGenerationResponse.personas) {
        try {
          const createResponse = await fetch('/api/personas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(personaData)
          });

          if (createResponse.ok) {
            successCount++;
          } else {
            console.error('Failed to create persona:', personaData.name);
          }
        } catch (error) {
          console.error('Error creating persona:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} persona${successCount > 1 ? 's' : ''} from AI generation!`);
        onAutodiscoveryComplete();
      } else {
        throw new Error('Failed to create any personas');
      }
    } catch (error) {
      console.error('Error during persona autodiscovery:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate personas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSetup = () => {
    onSelectOption('manual');
  };

  const handleBackToOptions = () => {
    setSelectedOption(null);
    reset();
  };

  if (selectedOption === 'autodiscover') {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto pt-16 pb-8 px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Let&apos;s generate your personas
              {isDevelopment && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">DEBUG MODE</span>}
            </h1>
            <p className="text-gray-600 text-lg">
              Select your brand profile and we&apos;ll create the optimal number of detailed customer personas for you
            </p>
          </div>

          {/* Autodiscovery Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit(handleAutodiscovery)} className="space-y-6">
              {/* Brand Selection Field */}
              <div>
                <label htmlFor="selectedBrandId" className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                  Select Brand Profile *
                </label>
                {isLoadingBrands ? (
                  <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    <span className="text-gray-600">Loading brand profiles...</span>
                  </div>
                ) : brandOptions.length === 0 ? (
                  <div className="px-4 py-3 border border-red-300 rounded-lg bg-red-50">
                    <p className="text-red-600 text-sm">
                      No brand profiles found. Please create a brand profile first at{' '}
                      <a href="/dashboard/brand" className="underline hover:text-red-800">
                        /dashboard/brand
                      </a>
                    </p>
                  </div>
                ) : (
                  <select
                    {...register('selectedBrandId')}
                    id="selectedBrandId"
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      errors.selectedBrandId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select a brand profile</option>
                    {brandOptions.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.selectedBrandId && (
                  <p className="mt-2 text-sm text-red-600">{errors.selectedBrandId.message}</p>
                )}
              </div>

              {/* Brand Preview */}
              {selectedBrandId && brandOptions.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <BuildingOfficeIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">
                        Selected Brand Preview
                      </h3>
                      <div className="mt-2 text-sm text-purple-700">
                        {(() => {
                          const selectedBrand = brandOptions.find(brand => brand.id === selectedBrandId);
                          if (!selectedBrand) return null;
                          
                          const { companyInfo, brandEssence, targetAudience } = selectedBrand.profile;
                          return (
                            <div className="space-y-1">
                              <p><strong>Company:</strong> {companyInfo.companyName}</p>
                              {companyInfo.industry && <p><strong>Industry:</strong> {companyInfo.industry}</p>}
                              {companyInfo.website && <p><strong>Website:</strong> {companyInfo.website}</p>}
                              {brandEssence?.brandPurpose && <p><strong>Purpose:</strong> {brandEssence.brandPurpose}</p>}
                              {targetAudience && targetAudience.length > 0 && (
                                <p><strong>Target Audience:</strong> {targetAudience.length} segment(s) defined</p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SparklesIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-purple-800">
                      How it works
                    </h3>
                    <div className="mt-2 text-sm text-purple-700">
                      <p>
                        Our AI will analyze your brand profile information and automatically determine the optimal number of customer personas to create, including demographics, goals, pain points, preferred channels, and buying behaviors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isLoading || brandOptions.length === 0}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Generate Personas
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Debug View - Only in Development */}
          {isDevelopment && debugInfo && (
            <div className="mt-8">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">🔍 Debug Info</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-xs">{debugInfo.timestamp}</span>
                    <button
                      onClick={() => setShowDebug(!showDebug)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      {showDebug ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                
                {showDebug && (
                  <div className="space-y-4">
                    {/* Input Section */}
                    <div>
                      <h4 className="text-yellow-400 text-sm font-medium mb-2">📤 Input to Assistant:</h4>
                      <pre className="bg-gray-800 p-3 rounded text-green-400 text-xs overflow-x-auto">
                        {JSON.stringify(debugInfo.input, null, 2)}
                      </pre>
                    </div>
                    
                    {/* Response Section */}
                    {debugInfo.response && (
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-2">📥 Response from Assistant:</h4>
                        <pre className="bg-gray-800 p-3 rounded text-cyan-400 text-xs overflow-x-auto max-h-80">
                          {JSON.stringify(debugInfo.response, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {/* Copy Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(debugInfo.input, null, 2))}
                        className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                      >
                        Copy Input
                      </button>
                      {debugInfo.response && (
                        <button
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(debugInfo.response, null, 2))}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        >
                          Copy Response
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main options screen
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto pt-16 pb-8 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let&apos;s create your customer personas
          </h1>
          <p className="text-gray-600 text-lg">
            Choose how you&apos;d like to build your customer personas
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: AI Generate */}
          <div className="group cursor-pointer" onClick={() => setSelectedOption('autodiscover')}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent group-hover:border-purple-300 group-hover:shadow-xl transition-all duration-200 h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                  <SparklesIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Generate
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Select your brand profile and let AI create the optimal number of detailed customer personas for you.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-700">
                    <SparklesIcon className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    Creates multiple personas instantly
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <SparklesIcon className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    Based on your brand profile
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <SparklesIcon className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    AI determines optimal quantity
                  </div>
                </div>
                <div className="mt-8">
                  <div className="bg-purple-600 text-white px-6 py-3 rounded-lg group-hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Generate Personas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Manual Build */}
          <div className="group cursor-pointer" onClick={handleManualSetup}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent group-hover:border-green-300 group-hover:shadow-xl transition-all duration-200 h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <PencilIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Build Manually
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Create personas yourself with our comprehensive form builder.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-700">
                    <PencilIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Complete control over details
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <PencilIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Use existing research
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <PencilIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Custom persona attributes
                  </div>
                </div>
                <div className="mt-8">
                  <div className="bg-green-600 text-white px-6 py-3 rounded-lg group-hover:bg-green-700 transition-colors flex items-center justify-center">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Create Manually
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            You can always edit, add, or remove personas after they&apos;re created
          </p>
        </div>

        {/* Debug View - Only in Development */}
        {isDevelopment && debugInfo && (
          <div className="mt-8">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">🔍 Debug Info</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-xs">{debugInfo.timestamp}</span>
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {showDebug ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              {showDebug && (
                <div className="space-y-4">
                  {/* Input Section */}
                  <div>
                    <h4 className="text-yellow-400 text-sm font-medium mb-2">📤 Input to Assistant:</h4>
                    <pre className="bg-gray-800 p-3 rounded text-green-400 text-xs overflow-x-auto">
                      {JSON.stringify(debugInfo.input, null, 2)}
                    </pre>
                  </div>
                  
                  {/* Response Section */}
                  {debugInfo.response && (
                    <div>
                      <h4 className="text-blue-400 text-sm font-medium mb-2">📥 Response from Assistant:</h4>
                      <pre className="bg-gray-800 p-3 rounded text-cyan-400 text-xs overflow-x-auto max-h-80">
                        {JSON.stringify(debugInfo.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Copy Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(debugInfo.input, null, 2))}
                      className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                    >
                      Copy Input
                    </button>
                    {debugInfo.response && (
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(debugInfo.response, null, 2))}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Copy Response
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
