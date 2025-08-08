'use client';

import { useEffect, useState, Suspense } from 'react';
import { useUser, useOrganization, CreateOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';

// Component to handle onboarding with Suspense
function OnboardingContent() {
  const { isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const router = useRouter();
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-6xl w-full mx-auto flex shadow-2xl rounded-lg overflow-hidden bg-white">
          {/* Left side - Setup Progress */}
          <div className="hidden lg:flex lg:w-1/2 bg-[url('/images/bg-pattern.png')] bg-cover bg-center px-8 py-12 flex-col justify-center">
            <div className="max-w-md ml-auto mr-8">
              <div className="mb-8">
                <Image src="/Logo.svg" alt="BrandHalo" width={205} height={48} />
              </div>
              
              <div>
                <span className="inline-block text-[#8777E7] font-semibold text-sm mb-3">
                  GET STARTED
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Create your organisation
                </h1>
                <p className="text-xl text-gray-600">
                  Set up your organisation to get started with BrandHalo.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Onboarding Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-sm ml-8 mr-auto lg:ml-8">

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

              {/* Organization Creation */}
              <CreateOrganization 
                afterCreateOrganizationUrl="/onboarding"
                hideSlug={true}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-white shadow-xl",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    formButtonPrimary: "bg-[#8777E7] hover:bg-[#7667d7]",
                  },
                }}
              />
            </div>
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