'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Textarea from './inputs/Textarea';

export default function TargetAudienceStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  const { fields: audienceFields, append: appendAudience, remove: removeAudience } = useFieldArray({
    control,
    name: 'targetAudience'
  });

  return (
    <FormSection
      title="Target Audience"
      description="Define your key audience segments and their characteristics."
    >
      <div className="space-y-8">
        {audienceFields.map((field, index) => (
          <div key={field.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Audience Segment {index + 1}
              </h4>
              {audienceFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAudience(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Segment Name"
                error={errors.targetAudience?.[index]?.name?.message}
                required
              >
                <Input
                  type="text"
                  {...register(`targetAudience.${index}.name` as const)}
                  placeholder="e.g., Tech-Savvy Millennials, Small Business Owners"
                  error={!!errors.targetAudience?.[index]?.name}
                />
              </FormField>

              <FormField
                label="Key Needs"
                error={errors.targetAudience?.[index]?.keyNeeds?.message}
                required
              >
                <Input
                  type="text"
                  {...register(`targetAudience.${index}.keyNeeds` as const)}
                  placeholder="e.g., Convenience, Cost savings, Innovation"
                  error={!!errors.targetAudience?.[index]?.keyNeeds}
                />
              </FormField>
            </div>

            <div className="mt-6 space-y-6">
              <FormField
                label="Description"
                error={errors.targetAudience?.[index]?.description?.message}
                required
              >
                <Textarea
                  {...register(`targetAudience.${index}.description` as const)}
                  rows={3}
                  placeholder="Describe this audience segment in detail..."
                  error={!!errors.targetAudience?.[index]?.description}
                />
              </FormField>

              <FormField
                label="Demographics"
                error={errors.targetAudience?.[index]?.demographics?.message}
                required
              >
                <Textarea
                  {...register(`targetAudience.${index}.demographics` as const)}
                  rows={2}
                  placeholder="Age range, location, income level, job titles, etc."
                  error={!!errors.targetAudience?.[index]?.demographics}
                />
              </FormField>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendAudience({ name: '', description: '', keyNeeds: '', demographics: '' })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Audience Segment
        </button>
      </div>
    </FormSection>
  );
}