'use client';

import React from 'react';
import { 
  BuildingOfficeIcon,
  SparklesIcon,
  FaceSmileIcon,
  PaintBrushIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';

interface BrandProfileViewProps {
  brandProfile: BrandProfile;
}

export default function BrandProfileView({ brandProfile }: BrandProfileViewProps) {
  const {
    companyInfo,
    brandEssence,
    brandPersonality,
    brandVisuals,
    targetAudience,
    competitiveLandscape,
    messaging,
    compliance
  } = brandProfile;

  const ViewSection = ({ 
    title, 
    children, 
    icon: Icon 
  }: { 
    title: string; 
    children: React.ReactNode; 
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center mb-4">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const ViewField = ({ label, value, link }: { label: string; value?: string | number | null; link?: boolean }) => {
    if (!value) return null;
    
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">
          {link && typeof value === 'string' ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-500">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    );
  };

  const ViewList = ({ label, items }: { label: string; items: string[] }) => {
    if (!items?.length) return null;
    
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-3">{label}</dt>
        <dd className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <span className="text-sm text-gray-900 leading-relaxed">{item}</span>
            </div>
          ))}
        </dd>
      </div>
    );
  };

  const ColorSwatch = ({ colors, label }: { colors: Array<{ name: string; hex: string }>; label: string }) => {
    if (!colors?.length) return null;
    
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-3">{label}</dt>
        <dd className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{color.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{color.hex.toUpperCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </dd>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-0">
      <ViewSection title="Company Information" icon={BuildingOfficeIcon}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ViewField label="Company Name" value={companyInfo.companyName} />
          <ViewField label="Industry" value={companyInfo.industry} />
          <ViewField label="Website" value={companyInfo.website} link />
          <ViewField label="Country" value={companyInfo.country} />
          <ViewField label="Year Founded" value={companyInfo.yearFounded} />
          <ViewField label="Company Size" value={companyInfo.size} />
        </dl>
      </ViewSection>

      <ViewSection title="Brand Essence" icon={SparklesIcon}>
        <dl className="space-y-4">
          <ViewField label="Tagline" value={brandEssence.tagline} />
          <ViewField label="Brand Purpose" value={brandEssence.brandPurpose} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViewField label="Mission Statement" value={brandEssence.mission} />
            <ViewField label="Vision Statement" value={brandEssence.vision} />
          </div>
          <ViewList label="Core Values" items={brandEssence.values.filter((value): value is string => value !== undefined)} />
          <ViewField label="Brand Promise" value={brandEssence.brandPromise} />
        </dl>
      </ViewSection>

      <ViewSection title="Brand Personality" icon={FaceSmileIcon}>
        <dl className="space-y-4">
          <ViewField label="Brand Archetype" value={brandPersonality.archetype} />
          <ViewList label="Brand Traits" items={brandPersonality.traits.filter((trait): trait is string => trait !== undefined)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViewField label="Primary Voice & Tone" value={brandPersonality.voiceTone.primaryTone} />
            <ViewField label="Secondary Voice & Tone" value={brandPersonality.voiceTone.secondaryTone} />
          </div>
        </dl>
      </ViewSection>

      <ViewSection title="Brand Visuals" icon={PaintBrushIcon}>
        <div className="space-y-6">
          <ViewField label="Logo URL" value={brandVisuals.logoURL} link />
          <ColorSwatch 
            colors={brandVisuals.primaryColors.filter((color): color is { name: string; hex: string } => 
              color.name !== undefined && color.hex !== undefined
            )} 
            label="Primary Colors" 
          />
          {brandVisuals.secondaryColors?.length > 0 && (
            <ColorSwatch 
              colors={brandVisuals.secondaryColors.filter((color): color is { name: string; hex: string } => 
                color.name !== undefined && color.hex !== undefined
              )} 
              label="Secondary Colors" 
            />
          )}
          {brandVisuals.typography?.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-3">Typography</dt>
              <dd className="space-y-3">
                {brandVisuals.typography.map((font, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <span className="font-semibold text-gray-900">{font.name}</span>
                      </div>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">{font.usage}</span>
                    </div>
                  </div>
                ))}
              </dd>
            </div>
          )}
          <ViewField label="Image Style Description" value={brandVisuals.imageStyleDescription} />
        </div>
      </ViewSection>

      <ViewSection title="Target Audience" icon={UserGroupIcon}>
        <div className="space-y-6">
          {targetAudience.map((segment, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">{segment.name}</h4>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ViewField label="Description" value={segment.description} />
                <ViewField label="Key Needs" value={segment.keyNeeds} />
                <ViewField label="Demographics" value={segment.demographics} />
              </dl>
            </div>
          ))}
        </div>
      </ViewSection>

      <ViewSection title="Competitive Landscape" icon={ChartBarIcon}>
        <div className="space-y-6">
          {competitiveLandscape.primaryCompetitors?.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-4">Primary Competitors</dt>
              <dd className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitiveLandscape.primaryCompetitors.map((competitor, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <h5 className="font-semibold text-gray-900">{competitor.name}</h5>
                      </div>
                      {competitor.website && (
                        <a 
                          href={competitor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{competitor.positioning}</p>
                  </div>
                ))}
              </dd>
            </div>
          )}
          <div className="pt-4">
            <ViewField label="Key Differentiators" value={competitiveLandscape.differentiators} />
          </div>
        </div>
      </ViewSection>

      <ViewSection title="Messaging" icon={ChatBubbleLeftRightIcon}>
        <dl className="space-y-4">
          <ViewField label="Elevator Pitch" value={messaging.elevatorPitch} />
          <ViewList label="Key Messages" items={messaging.keyMessages.filter((message): message is string => message !== undefined)} />
          {messaging.doNotSay && (
            <ViewField label="Words/Phrases to Avoid" value={messaging.doNotSay} />
          )}
        </dl>
      </ViewSection>

      <ViewSection title="Compliance & Legal" icon={ShieldCheckIcon}>
        <dl className="space-y-4">
          <ViewField label="Brand Guidelines URL" value={compliance.brandGuidelinesURL} link />
          <ViewField label="Trademark Status" value={compliance.trademarkStatus} />
          {compliance.notes && (
            <ViewField label="Additional Notes" value={compliance.notes} />
          )}
        </dl>
      </ViewSection>
      </div>
    </div>
  );
}