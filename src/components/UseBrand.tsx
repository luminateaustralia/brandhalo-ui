'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { 
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import { BrandVoice } from '@/types/brandVoice';
import { Persona } from '@/types/persona';

interface UseBrandProps {
  className?: string;
}

interface CombinedBrandData {
  brand: BrandProfile | null;
  personas: Persona[];
  brandVoices: BrandVoice[];
}

export default function UseBrand({ className = '' }: UseBrandProps) {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const [brandData, setBrandData] = useState<CombinedBrandData>({
    brand: null,
    personas: [],
    brandVoices: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchBrandData = useCallback(async () => {
    if (!isOrgLoaded || !organization) return;
    
    // If we've already loaded data, don't reload unless it's been a while or data is stale
    if (hasLoadedOnce && (brandData.brand !== null || brandData.personas.length > 0 || brandData.brandVoices.length > 0)) {
      return;
    }
    
    try {
      // Only show loading state if we haven't loaded before
      if (!hasLoadedOnce) {
        setIsLoading(true);
      }
      
      // Fetch brand profile, personas, and brand voices in parallel
      const [brandResponse, personasResponse, voicesResponse] = await Promise.all([
        fetch('/api/brand').catch(() => new Response('{}', { status: 500, statusText: 'Internal Server Error' })),
        fetch('/api/personas').catch(() => new Response('[]', { status: 500, statusText: 'Internal Server Error' })),
        fetch('/api/brand-voices').catch(() => new Response('[]', { status: 500, statusText: 'Internal Server Error' }))
      ]);

      let brand = null;
      let personas: Persona[] = [];
      let brandVoices: BrandVoice[] = [];

      if (brandResponse.ok) {
        try {
          const brandEntity = await brandResponse.json();
          brand = brandEntity?.brandData || null; // Extract the actual brand data from the wrapper
        } catch (error) {
          console.error('Error parsing brand response:', error);
          brand = null;
        }
      }

      if (personasResponse.ok) {
        try {
          const personasData = await personasResponse.json();
          personas = Array.isArray(personasData) ? personasData.map((item: Persona | { personaData: Persona }) => 'personaData' in item ? item.personaData : item) : [];
        } catch (error) {
          console.error('Error parsing personas response:', error);
          personas = [];
        }
      }

      if (voicesResponse.ok) {
        try {
          const voicesData = await voicesResponse.json();
          brandVoices = Array.isArray(voicesData) ? voicesData.map((item: BrandVoice | { voiceData: BrandVoice }) => 'voiceData' in item ? item.voiceData : item) : [];
        } catch (error) {
          console.error('Error parsing brand voices response:', error);
          brandVoices = [];
        }
      }

      setBrandData({ brand, personas, brandVoices });
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOrgLoaded, organization, hasLoadedOnce, brandData.brand, brandData.personas.length, brandData.brandVoices.length]);

  // Fetch all brand-related data
  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  // Create JSON data for export
  const createExportData = () => {
    const exportData: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      organization: organization?.name || organization?.slug || 'Unknown'
    };

    if (brandData.brand) {
      exportData.brand = {
        companyInfo: brandData.brand.companyInfo || {},
        brandEssence: brandData.brand.brandEssence || {},
        brandPersonality: brandData.brand.brandPersonality || {},
        brandVisuals: {
          logoURL: brandData.brand.brandVisuals?.logoURL,
          primaryColors: brandData.brand.brandVisuals?.primaryColors || [],
          secondaryColors: brandData.brand.brandVisuals?.secondaryColors || [],
          typography: brandData.brand.brandVisuals?.typography || [],
          imageStyleDescription: brandData.brand.brandVisuals?.imageStyleDescription
        },
        targetAudience: brandData.brand.targetAudience || [],
        competitiveLandscape: brandData.brand.competitiveLandscape || {},
        messaging: brandData.brand.messaging || {},
        compliance: brandData.brand.compliance || {}
      };
    }

    if (brandData.personas.length > 0) {
      exportData.personas = brandData.personas.map(persona => ({
        id: persona.id,
        name: persona.name,
        age: persona.age,
        occupation: persona.occupation,
        location: persona.location,
        income: persona.income,
        description: persona.description,
        goals: persona.goals,
        painPoints: persona.painPoints,
        preferredChannels: persona.preferredChannels,
        buyingBehavior: persona.buyingBehavior
      }));
    }

    if (brandData.brandVoices.length > 0) {
      exportData.brandVoices = brandData.brandVoices.map(voice => ({
        id: voice.id,
        name: voice.name,
        jobTitle: voice.jobTitle,
        department: voice.department,
        bio: voice.bio,
        communicationStyle: voice.communicationStyle,
        tone: voice.tone,
        personalityTraits: voice.personalityTraits,
        contentFocus: voice.contentFocus,
        preferredTopics: voice.preferredTopics,
        expertiseAreas: voice.expertiseAreas,
        doList: voice.doList,
        dontList: voice.dontList,
        keyMessages: voice.keyMessages
      }));
    }

    return exportData;
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      const exportData = createExportData();
      const jsonString = JSON.stringify(exportData, null, 2);
      
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(createExportData(), null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // AI Platform configurations
  const aiPlatforms = [
    {
      name: 'ChatGPT',
      url: (prompt: string) => `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Claude',
      url: (prompt: string) => `https://claude.ai/chat?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-17v4.5l4-2.25L11 5zm0 6v6l6-3-6-3z"/>
        </svg>
      ),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: 'Gemini',
      url: (prompt: string) => `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Perplexity',
      url: (prompt: string) => `https://www.perplexity.ai/?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.63 3.34 1.67 4.58L12 20l5.33-6.42C18.37 12.34 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Copilot',
      url: (prompt: string) => `https://copilot.microsoft.com/?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 7.5v9c0 1.38-1.12 2.5-2.5 2.5H7c-1.38 0-2.5-1.12-2.5-2.5v-9C4.5 6.12 5.62 5 7 5h10c1.38 0 2.5 1.12 2.5 2.5zm-6 8c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3-3c.83 0 1.5-.67 1.5-1.5S11.33 9.5 10.5 9.5 9 10.17 9 11s.67 1.5 1.5 1.5z"/>
        </svg>
      ),
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      name: 'You.com',
      url: (prompt: string) => `https://you.com/search?q=${encodeURIComponent(prompt)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
        </svg>
      ),
      color: 'bg-cyan-600 hover:bg-cyan-700'
    }
  ];

  // Open in AI platform function
  const openInAIPlatform = (platform: typeof aiPlatforms[0]) => {
    setIsRedirecting(true);
    const exportData = createExportData();
    const prompt = `I'm providing you with my brand information including brand profile, personas, and brand voices. Please help me with brand-related tasks using this context:\n\n${JSON.stringify(exportData, null, 2)}`;
    
    const url = platform.url(prompt);
    window.open(url, '_blank');
    
    setTimeout(() => setIsRedirecting(false), 1000);
  };

  // Check if there's any data available
  const hasData = brandData.brand || brandData.personas.length > 0 || brandData.brandVoices.length > 0;

  if (isLoading && !hasLoadedOnce) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardDocumentIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Use the Brand</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete your brand setup to use your brand data with AI tools
          </p>
          <div className="text-xs text-gray-500">
            Set up your brand profile, personas, and brand voices first
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Use the Brand</h3>
        <p className="text-gray-600 text-sm">
          Export your brand data or use it with AI tools
        </p>
      </div>

      {/* Data Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 space-y-1">
          {brandData.brand && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Brand Profile: {brandData.brand.companyInfo?.companyName || 'Configured'}
            </div>
          )}
          {brandData.personas.length > 0 && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Personas: {brandData.personas.length} defined
            </div>
          )}
          {brandData.brandVoices.length > 0 && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Brand Voices: {brandData.brandVoices.length} configured
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Copy to Clipboard Button */}
        <button
          onClick={copyToClipboard}
          disabled={copySuccess}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          {copySuccess ? (
            <>
              <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-600 font-medium">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-900 font-medium">Copy to Clipboard</span>
            </>
          )}
        </button>

        {/* AI Platforms Grid */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Open in AI Platform</h4>
          <div className="grid grid-cols-4 gap-2">
            {aiPlatforms.slice(0, 4).map((platform) => (
              <button
                key={platform.name}
                onClick={() => openInAIPlatform(platform)}
                disabled={isRedirecting}
                className={`
                  aspect-square flex flex-col items-center justify-center p-2 text-white rounded-md 
                  transition-colors disabled:opacity-50 group
                  ${platform.color}
                `}
                title={`Open in ${platform.name}`}
              >
                {isRedirecting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className="mb-1">
                      {React.cloneElement(platform.icon, { className: 'w-6 h-6' })}
                    </div>
                    <span className="text-xs font-medium leading-tight text-center">
                      {platform.name}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Export includes your brand profile, personas, and brand voices in JSON format
      </div>
    </div>
  );
}
