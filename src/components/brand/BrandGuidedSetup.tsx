'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  SparklesIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

// Validation schema for brand autodiscovery
const autodiscoverySchema = z.object({
  brandName: z.string().min(1, 'Brand name is required').min(2, 'Brand name must be at least 2 characters'),
  website: z.string()
    .min(1, 'Website URL is required')
    .url('Please enter a valid URL (e.g., https://example.com)')
    .or(z.string().regex(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/, 'Please enter a valid domain (e.g., example.com)'))
    .transform((val) => {
      // Add https:// if no protocol is specified
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    })
});

type AutodiscoveryFormData = z.infer<typeof autodiscoverySchema>;

interface BrandGuidedSetupProps {
  onSelectOption: (option: 'autodiscover' | 'manual') => void;
  onAutodiscoveryComplete: () => void;
}

export default function BrandGuidedSetup({ onSelectOption, onAutodiscoveryComplete }: BrandGuidedSetupProps) {
  const { organization } = useOrganization();
  const [selectedOption, setSelectedOption] = useState<'autodiscover' | 'manual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<AutodiscoveryFormData>({
    resolver: zodResolver(autodiscoverySchema),
    mode: 'onChange'
  });

  const handleAutodiscovery = async (data: AutodiscoveryFormData) => {
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }

    setIsLoading(true);
    try {
      // Call the OpenAI assistant API
      const response = await fetch('/api/brand-autodiscovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: data.brandName,
          website: data.website
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to autodiscover brand information');
      }

      const brandData = await response.json();

      // Create the brand profile using the response
      const createResponse = await fetch('/api/brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData)
      });

      // If brand already exists, update it instead
      if (createResponse.status === 409) {
        const updateResponse = await fetch('/api/brand', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(brandData)
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({ error: 'Failed to update existing brand profile' }));
          throw new Error(errorData.error || 'Failed to update existing brand profile');
        }

        toast.success('Brand profile updated from autodiscovery!');
        onAutodiscoveryComplete();
        return;
      }

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({ error: 'Failed to create brand profile' }));
        throw new Error(errorData.error || 'Failed to create brand profile');
      }

      toast.success('Brand profile created successfully from autodiscovery!');
      onAutodiscoveryComplete();
    } catch (error) {
      console.error('Error during autodiscovery:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to autodiscover brand information');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Let&apos;s discover your brand
            </h1>
            
          </div>

          {/* Autodiscovery Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit(handleAutodiscovery)} className="space-y-6">
              {/* Brand Name Field */}
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                  Brand Name
                </label>
                <input
                  {...register('brandName')}
                  type="text"
                  id="brandName"
                  placeholder="e.g., Atlassian"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.brandName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.brandName && (
                  <p className="mt-2 text-sm text-red-600">{errors.brandName.message}</p>
                )}
              </div>

              {/* Website URL Field */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  <GlobeAltIcon className="w-4 h-4 inline mr-2" />
                  Website URL
                </label>
                <input
                  {...register('website')}
                  type="text"
                  id="website"
                  placeholder="e.g., www.atlassian.com or https://atlassian.com"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.website ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.website && (
                  <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SparklesIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      How it works
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We&apos;ll head off and find your brand from the website, your public channels, social media to automatically create a comprehensive brand profile including brand essence, personality, visuals, and messaging guidelines.
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
                  disabled={!isValid || isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Discovering...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Discover Brand
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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
            Let&apos;s create your brand profile
          </h1>
          
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: Autodiscover */}
          <div className="group cursor-pointer" onClick={() => setSelectedOption('autodiscover')}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-200 h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <MagnifyingGlassIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Automated Discovery
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Provide your brand name and website, and we&apos;ll discover brand for you from the web.
                </p>
                <div className="space-y-3 text-left">
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <SparklesIcon className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    Complete profile in minutes
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <SparklesIcon className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    Uses public data from the web
                  </div>
                </div>
                <div className="mt-8">
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-lg group-hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Get Started
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
                  Prefer to build yourself? Use our smart step-by-step guided process.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-700">
                    <PencilIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Step-by-step guided process
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <PencilIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Complete control
                  </div>
                  
                </div>
                <div className="mt-8">
                  <div className="bg-green-600 text-white px-6 py-3 rounded-lg group-hover:bg-green-700 transition-colors flex items-center justify-center">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Start Building
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            You can always edit and refine your brand profile after it&apos;s created
          </p>
        </div>
      </div>
    </div>
  );
}
