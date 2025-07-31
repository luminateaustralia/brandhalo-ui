'use client';

import React from 'react';
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

  const ViewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
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
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </dd>
      </div>
    );
  };

  const ColorSwatch = ({ colors, label }: { colors: Array<{ name: string; hex: string }>; label: string }) => {
    if (!colors?.length) return null;
    
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-2">{label}</dt>
        <dd className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-md border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{color.name}</div>
                <div className="text-xs text-gray-500">{color.hex}</div>
              </div>
            </div>
          ))}
        </dd>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-0">
      <ViewSection title="Company Information">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ViewField label="Company Name" value={companyInfo.companyName} />
          <ViewField label="Industry" value={companyInfo.industry} />
          <ViewField label="Website" value={companyInfo.website} link />
          <ViewField label="Country" value={companyInfo.country} />
          <ViewField label="Year Founded" value={companyInfo.yearFounded} />
          <ViewField label="Company Size" value={companyInfo.size} />
        </dl>
      </ViewSection>

      <ViewSection title="Brand Essence">
        <dl className="space-y-4">
          <ViewField label="Tagline" value={brandEssence.tagline} />
          <ViewField label="Brand Purpose" value={brandEssence.brandPurpose} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViewField label="Mission Statement" value={brandEssence.mission} />
            <ViewField label="Vision Statement" value={brandEssence.vision} />
          </div>
          <ViewList label="Core Values" items={brandEssence.values} />
          <ViewField label="Brand Promise" value={brandEssence.brandPromise} />
        </dl>
      </ViewSection>

      <ViewSection title="Brand Personality">
        <dl className="space-y-4">
          <ViewField label="Brand Archetype" value={brandPersonality.archetype} />
          <ViewList label="Brand Traits" items={brandPersonality.traits} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViewField label="Primary Voice & Tone" value={brandPersonality.voiceTone.primaryTone} />
            <ViewField label="Secondary Voice & Tone" value={brandPersonality.voiceTone.secondaryTone} />
          </div>
        </dl>
      </ViewSection>

      <ViewSection title="Brand Visuals">
        <div className="space-y-6">
          <ViewField label="Logo URL" value={brandVisuals.logoURL} link />
          <ColorSwatch colors={brandVisuals.primaryColors} label="Primary Colors" />
          {brandVisuals.secondaryColors?.length > 0 && (
            <ColorSwatch colors={brandVisuals.secondaryColors} label="Secondary Colors" />
          )}
          {brandVisuals.typography?.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">Typography</dt>
              <dd className="space-y-2">
                {brandVisuals.typography.map((font, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{font.name}</span>
                    <span className="text-sm text-gray-500">{font.usage}</span>
                  </div>
                ))}
              </dd>
            </div>
          )}
          <ViewField label="Image Style Description" value={brandVisuals.imageStyleDescription} />
        </div>
      </ViewSection>

      <ViewSection title="Target Audience">
        <div className="space-y-6">
          {targetAudience.map((segment, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">{segment.name}</h4>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ViewField label="Description" value={segment.description} />
                <ViewField label="Key Needs" value={segment.keyNeeds} />
                <ViewField label="Demographics" value={segment.demographics} />
              </dl>
            </div>
          ))}
        </div>
      </ViewSection>

      <ViewSection title="Competitive Landscape">
        <div className="space-y-4">
          {competitiveLandscape.primaryCompetitors?.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-3">Primary Competitors</dt>
              <dd className="space-y-3">
                {competitiveLandscape.primaryCompetitors.map((competitor, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                      {competitor.website && (
                        <a 
                          href={competitor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-500"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{competitor.positioning}</p>
                  </div>
                ))}
              </dd>
            </div>
          )}
          <ViewField label="Key Differentiators" value={competitiveLandscape.differentiators} />
        </div>
      </ViewSection>

      <ViewSection title="Messaging">
        <dl className="space-y-4">
          <ViewField label="Elevator Pitch" value={messaging.elevatorPitch} />
          <ViewList label="Key Messages" items={messaging.keyMessages} />
          {messaging.doNotSay && (
            <ViewField label="Words/Phrases to Avoid" value={messaging.doNotSay} />
          )}
        </dl>
      </ViewSection>

      <ViewSection title="Compliance & Legal">
        <dl className="space-y-4">
          <ViewField label="Brand Guidelines URL" value={compliance.brandGuidelinesURL} link />
          <ViewField label="Trademark Status" value={compliance.trademarkStatus} />
          {compliance.notes && (
            <ViewField label="Additional Notes" value={compliance.notes} />
          )}
        </dl>
      </ViewSection>
    </div>
  );
}