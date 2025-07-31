'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Textarea from './inputs/Textarea';

export default function CompetitiveLandscapeStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  const { fields: competitorFields, append: appendCompetitor, remove: removeCompetitor } = useFieldArray({
    control,
    name: 'competitiveLandscape.primaryCompetitors'
  });

  return (
    <FormSection
      title="Competitive Landscape"
      description="Identify your main competitors and what sets your brand apart."
    >
      <div className="space-y-6">
        <FormField
          label="Primary Competitors"
          description="List your main competitors (optional but recommended)"
        >
          <div className="space-y-4">
            {competitorFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-900">Competitor {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeCompetitor(index)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Competitor Name"
                    error={errors.competitiveLandscape?.primaryCompetitors?.[index]?.name?.message}
                    required
                  >
                    <Input
                      type="text"
                      {...register(`competitiveLandscape.primaryCompetitors.${index}.name` as const)}
                      placeholder="Company name"
                      error={!!errors.competitiveLandscape?.primaryCompetitors?.[index]?.name}
                    />
                  </FormField>

                  <FormField
                    label="Website"
                    error={errors.competitiveLandscape?.primaryCompetitors?.[index]?.website?.message}
                  >
                    <Input
                      type="url"
                      {...register(`competitiveLandscape.primaryCompetitors.${index}.website` as const)}
                      placeholder="https://competitor.com"
                      error={!!errors.competitiveLandscape?.primaryCompetitors?.[index]?.website}
                    />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField
                    label="Positioning"
                    error={errors.competitiveLandscape?.primaryCompetitors?.[index]?.positioning?.message}
                    required
                    description="How do they position themselves in the market?"
                  >
                    <Textarea
                      {...register(`competitiveLandscape.primaryCompetitors.${index}.positioning` as const)}
                      rows={2}
                      placeholder="Describe their market positioning, key messages, and value proposition..."
                      error={!!errors.competitiveLandscape?.primaryCompetitors?.[index]?.positioning}
                    />
                  </FormField>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendCompetitor({ name: '', website: '', positioning: '' })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Competitor
            </button>
          </div>
        </FormField>

        <FormField
          label="Key Differentiators"
          error={errors.competitiveLandscape?.differentiators?.message}
          required
          description="What makes your brand unique compared to competitors?"
        >
          <Textarea
            {...register('competitiveLandscape.differentiators')}
            rows={4}
            placeholder="Describe what sets your brand apart from the competition. This could include unique features, superior quality, better service, different approach, etc."
            error={!!errors.competitiveLandscape?.differentiators}
          />
        </FormField>
      </div>
    </FormSection>
  );
}