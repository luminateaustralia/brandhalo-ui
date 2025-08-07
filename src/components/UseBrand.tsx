'use client';

import React, { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { 
  ClipboardDocumentIcon,
  ChatBubbleLeftRightIcon,
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

  // Fetch all brand-related data
  useEffect(() => {
    const fetchBrandData = async () => {
      if (!isOrgLoaded || !organization) return;
      
      try {
        setIsLoading(true);
        
        // Fetch brand profile, personas, and brand voices in parallel
        const [brandResponse, personasResponse, voicesResponse] = await Promise.all([
          fetch('/api/brand').catch(() => ({ ok: false, status: 500 })),
          fetch('/api/personas').catch(() => ({ ok: false, status: 500 })),
          fetch('/api/brand-voices').catch(() => ({ ok: false, status: 500 }))
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
            personas = Array.isArray(personasData) ? personasData.map((item: any) => item.personaData || item) : [];
          } catch (error) {
            console.error('Error parsing personas response:', error);
            personas = [];
          }
        }

        if (voicesResponse.ok) {
          try {
            const voicesData = await voicesResponse.json();
            brandVoices = Array.isArray(voicesData) ? voicesData.map((item: any) => item.voiceData || item) : [];
          } catch (error) {
            console.error('Error parsing brand voices response:', error);
            brandVoices = [];
          }
        }

        setBrandData({ brand, personas, brandVoices });
      } catch (error) {
        console.error('Error fetching brand data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [isOrgLoaded, organization]);

  // Create JSON data for export
  const createExportData = () => {
    const exportData: any = {
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

  // Open in ChatGPT function
  const openInChatGPT = () => {
    setIsRedirecting(true);
    const exportData = createExportData();
    const prompt = `I'm providing you with my brand information including brand profile, personas, and brand voices. Please help me with brand-related tasks using this context:\n\n${JSON.stringify(exportData, null, 2)}`;
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    // Open in new tab
    window.open(chatGPTUrl, '_blank');
    
    setTimeout(() => setIsRedirecting(false), 1000);
  };

  // Check if there's any data available
  const hasData = brandData.brand || brandData.personas.length > 0 || brandData.brandVoices.length > 0;

  if (isLoading) {
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
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400" />
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
      <div className="space-y-3">
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

        <button
          onClick={openInChatGPT}
          disabled={isRedirecting}
          className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isRedirecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="font-medium">Opening ChatGPT...</span>
            </>
          ) : (
            <>
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Open in ChatGPT</span>
            </>
          )}
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Export includes your brand profile, personas, and brand voices in JSON format
      </div>
    </div>
  );
}
