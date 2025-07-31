'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Textarea from './inputs/Textarea';

export default function BrandEssenceStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: 'brandEssence.values'
  });

  return (
    <FormSection
      title="Brand Essence"
      description="Define the core purpose, mission, vision, and values that drive your brand."
    >
      <div className="space-y-6">
        <FormField
          label="Tagline"
          error={errors.brandEssence?.tagline?.message}
          required
          description="A memorable phrase that captures your brand's essence"
        >
          <Input
            type="text"
            {...register('brandEssence.tagline')}
            placeholder="e.g., Just Do It, Think Different"
            error={!!errors.brandEssence?.tagline}
          />
        </FormField>

        <FormField
          label="Brand Purpose"
          error={errors.brandEssence?.brandPurpose?.message}
          required
          description="Why does your brand exist? What is your reason for being?"
        >
          <Textarea
            {...register('brandEssence.brandPurpose')}
            rows={3}
            placeholder="Our brand exists to..."
            error={!!errors.brandEssence?.brandPurpose}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Mission Statement"
            error={errors.brandEssence?.mission?.message}
            required
            description="What you do and how you do it"
          >
            <Textarea
              {...register('brandEssence.mission')}
              rows={4}
              placeholder="Our mission is to..."
              error={!!errors.brandEssence?.mission}
            />
          </FormField>

          <FormField
            label="Vision Statement"
            error={errors.brandEssence?.vision?.message}
            required
            description="Where you want to be in the future"
          >
            <Textarea
              {...register('brandEssence.vision')}
              rows={4}
              placeholder="Our vision is to..."
              error={!!errors.brandEssence?.vision}
            />
          </FormField>
        </div>

        <FormField
          label="Core Values"
          error={errors.brandEssence?.values?.message}
          required
          description="The fundamental beliefs that guide your brand's behavior"
        >
          <div className="space-y-3">
            {valueFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <Input
                  type="text"
                  {...register(`brandEssence.values.${index}` as const)}
                  className="flex-1"
                  placeholder={`Value ${index + 1}`}
                />
                {valueFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendValue('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Value
            </button>
          </div>
        </FormField>

        <FormField
          label="Brand Promise"
          error={errors.brandEssence?.brandPromise?.message}
          required
          description="What do you consistently deliver to your customers?"
        >
          <Textarea
            {...register('brandEssence.brandPromise')}
            rows={3}
            placeholder="We promise to consistently deliver..."
            error={!!errors.brandEssence?.brandPromise}
          />
        </FormField>
      </div>
    </FormSection>
  );
}