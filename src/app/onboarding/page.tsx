'use client';

import { useEffect, useState, Suspense } from 'react';
import { useUser, useOrganization, CreateOrganization, OrganizationList } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';

// Component to handle search params with Suspense
function OnboardingContent() {
  const { isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const [step, setStep] = useState(stepParam === '2' ? 2 : 1);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedCreation, setHasAttemptedCreation] = useState(false);

  // Create customer record in API when organization is created
  useEffect(() => {
    if (!isOrgLoaded || !organization || isCreatingCustomer || hasAttemptedCreation) {
      return;
    }

    const createCustomerRecord = async () => {
      try {
        setIsCreatingCustomer(true);
        setError(null);
        
        const customerData = {
          organisationName: organization.name || 'My Organization',
          clerk_organisation_id: organization.id,
          brands: [
            {
              id: `brand-${Date.now()}`, // Generate a unique ID
              name: `${organization.name || 'My Organization'} Brand`,
              url: `https://${organization.name ? organization.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'my-organization'}.com`
            }
          ],
          url: `https://${organization.name ? organization.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'my-organization'}.com`
        };
        
        try {
          const response = await api.customers.create(customerData);
          console.log('Customer created successfully:', response);
          router.push('/dashboard');
        } catch (apiError: unknown) {
          if (apiError instanceof Error && apiError.message) {
            setError(`Failed to create customer: ${apiError.message}`);
          } else {
            setError('Failed to create customer. Please try again or contact support.');
          }
          
          if (typeof apiError === 'object' && apiError !== null && 'status' in apiError && (apiError as { status: number }).status === 409) {
            console.log('Organization already exists in database, redirecting to dashboard');
            router.push('/dashboard');
          }
        }
      } catch (err) {
        console.error('Error creating customer record:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while creating your organisation');
      } finally {
        setIsCreatingCustomer(false);
        setHasAttemptedCreation(true);
      }
    };

    createCustomerRecord();
  }, [isOrgLoaded, organization, router, isCreatingCustomer, hasAttemptedCreation]);

  useEffect(() => {
    if (stepParam === '2') {
      setStep(2);
    }
  }, [stepParam]);

  if (!isUserLoaded || !isOrgLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isCreatingCustomer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8777E7] mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your organisation</h2>
        <p className="text-gray-600">Please wait while we finish setting up your organisation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Image src="/Logo.svg" alt="BrandHalo" width={205} height={48} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to BrandHalo
            </h1>
            <p className="text-lg text-gray-600">
              Let&apos;s set up your organisation to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="mt-2 text-sm">
                    <button 
                      onClick={() => {
                        setHasAttemptedCreation(false);
                        setError(null);
                      }}
                      className="text-red-700 font-medium underline"
                    >
                      Try again
                    </button>
                    {" or "}
                    <button 
                      onClick={() => router.push('/dashboard')}
                      className="text-red-700 font-medium underline"
                    >
                      Go to dashboard anyway
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Progress steps */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <nav className="flex">
                  <ol role="list" className="flex items-center space-x-4">
                    <li className="flex items-center">
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                        step >= 1 ? 'bg-[#8777E7] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        1
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-900">Create Organization</div>
                    </li>
                    <li className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-0.5 bg-gray-200"></div>
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ml-4 ${
                        step >= 2 ? 'bg-[#8777E7] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        2
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-900">Complete</div>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            {/* Step 1: Create Organization */}
            {step === 1 && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Create your organisation</h2>
                <p className="text-gray-600 mb-6">
                  Create an organisation to manage your team and brand monitoring. This will be where all your brand data is stored.
                </p>

                <div className="space-y-6">
                  <CreateOrganization 
                    afterCreateOrganizationUrl="/onboarding"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "border-0 shadow-none p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        formButtonPrimary: "bg-[#8777E7] hover:bg-[#7667d7]",
                      },
                    }}
                  />

                  <div className="border-t pt-6 mt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Already have an organization? You can join an existing organization instead.
                    </p>
                    <OrganizationList 
                      afterSelectOrganizationUrl="/onboarding"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "border-0 shadow-none p-0",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Completion */}
            {step === 2 && (
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#8777E7]/10 mb-4">
                  <svg className="h-6 w-6 text-[#8777E7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Organization setup complete!</h2>
                <p className="text-gray-600 mb-6">
                  You&apos;re all set to start using BrandHalo.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-[#8777E7] text-white font-medium rounded-full hover:bg-[#7667d7] transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps OnboardingContent in Suspense
export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8777E7]"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
} 