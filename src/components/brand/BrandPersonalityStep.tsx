'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Select from './inputs/Select';

export default function BrandPersonalityStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  const { fields: traitFields, append: appendTrait, remove: removeTrait } = useFieldArray({
    control,
    name: 'brandPersonality.traits'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const brandArchetypes = [
    'The Innocent',
    'The Explorer',
    'The Sage',
    'The Hero',
    'The Outlaw',
    'The Magician',
    'The Regular Guy/Girl',
    'The Lover',
    'The Jester',
    'The Caregiver',
    'The Creator',
    'The Ruler'
  ];

  const voiceTones = [
    'Professional',
    'Friendly',
    'Authoritative',
    'Playful',
    'Empathetic',
    'Bold',
    'Sophisticated',
    'Casual',
    'Inspiring',
    'Trustworthy',
    'Innovation-focused',
    'Caring'
  ];

  return (
    <FormSection
      title="Brand Personality"
      description="Define your brand's character, traits, and communication style."
    >
      <div className="space-y-6">
        <FormField
          label="Brand Archetype"
          error={errors.brandPersonality?.archetype?.message}
          required
          description="Choose the archetypal character that best represents your brand"
        >
          <Select
            {...register('brandPersonality.archetype')}
            error={!!errors.brandPersonality?.archetype}
          >
            <option value="">Select an archetype</option>
            {brandArchetypes.map((archetype) => (
              <option key={archetype} value={archetype}>
                {archetype}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Brand Traits"
          error={errors.brandPersonality?.traits?.message}
          required
          description="Key personality characteristics that define your brand"
        >
          <div className="space-y-3">
            {traitFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <Input
                  type="text"
                  {...register(`brandPersonality.traits.${index}` as const)}
                  className="flex-1"
                  placeholder={`Trait ${index + 1} (e.g., Innovative, Reliable, Friendly)`}
                />
                {traitFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrait(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTrait('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Trait
            </button>
          </div>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Primary Voice & Tone"
            error={errors.brandPersonality?.voiceTone?.primaryTone?.message}
            required
            description="The main tone your brand uses in communications"
          >
            <Select
              {...register('brandPersonality.voiceTone.primaryTone')}
              error={!!errors.brandPersonality?.voiceTone?.primaryTone}
            >
              <option value="">Select primary tone</option>
              {voiceTones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Secondary Voice & Tone"
            error={errors.brandPersonality?.voiceTone?.secondaryTone?.message}
            required
            description="A complementary tone that adds depth to your brand voice"
          >
            <Select
              {...register('brandPersonality.voiceTone.secondaryTone')}
              error={!!errors.brandPersonality?.voiceTone?.secondaryTone}
            >
              <option value="">Select secondary tone</option>
              {voiceTones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </div>
    </FormSection>
  );
}