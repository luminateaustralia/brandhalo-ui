'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Select from './inputs/Select';
import Textarea from './inputs/Textarea';

export default function BrandVisualsStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  
  const { fields: primaryColorFields, append: appendPrimaryColor, remove: removePrimaryColor } = useFieldArray({
    control,
    name: 'brandVisuals.primaryColors'
  });

  const { fields: secondaryColorFields, append: appendSecondaryColor, remove: removeSecondaryColor } = useFieldArray({
    control,
    name: 'brandVisuals.secondaryColors'
  });

  const { fields: typographyFields, append: appendTypography, remove: removeTypography } = useFieldArray({
    control,
    name: 'brandVisuals.typography'
  });

  const fontUsageOptions = [
    'Headings',
    'Body text',
    'Subheadings',
    'Captions',
    'Navigation',
    'Buttons',
    'Display'
  ];

  return (
    <FormSection
      title="Brand Visuals"
      description="Define your visual identity including logo, colors, typography, and image style."
    >
      <div className="space-y-6">
        <FormField
          label="Logo URL"
          error={errors.brandVisuals?.logoURL?.message}
          description="Link to your brand's logo file"
        >
          <Input
            type="url"
            {...register('brandVisuals.logoURL')}
            placeholder="https://example.com/logo.png"
            error={!!errors.brandVisuals?.logoURL}
          />
        </FormField>

        <FormField
          label="Primary Colors"
          error={errors.brandVisuals?.primaryColors?.message}
          required
          description="Your brand's main colors (at least one required)"
        >
          <div className="space-y-3">
            {primaryColorFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    {...register(`brandVisuals.primaryColors.${index}.name` as const)}
                    placeholder="Color name (e.g., Brand Blue)"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      {...register(`brandVisuals.primaryColors.${index}.hex` as const)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <Input
                      type="text"
                      {...register(`brandVisuals.primaryColors.${index}.hex` as const)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                {primaryColorFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrimaryColor(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendPrimaryColor({ name: '', hex: '' })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Primary Color
            </button>
          </div>
        </FormField>

        <FormField
          label="Secondary Colors"
          error={errors.brandVisuals?.secondaryColors?.message}
          description="Supporting colors for your brand palette (optional)"
        >
          <div className="space-y-3">
            {secondaryColorFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    {...register(`brandVisuals.secondaryColors.${index}.name` as const)}
                    placeholder="Color name (e.g., Accent Gray)"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      {...register(`brandVisuals.secondaryColors.${index}.hex` as const)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <Input
                      type="text"
                      {...register(`brandVisuals.secondaryColors.${index}.hex` as const)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSecondaryColor(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSecondaryColor({ name: '', hex: '' })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Secondary Color
            </button>
          </div>
        </FormField>

        <FormField
          label="Typography"
          error={errors.brandVisuals?.typography?.message}
          required
          description="Fonts used in your brand communications"
        >
          <div className="space-y-3">
            {typographyFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    {...register(`brandVisuals.typography.${index}.name` as const)}
                    placeholder="Font name (e.g., Montserrat, Arial)"
                  />
                  <Select
                    {...register(`brandVisuals.typography.${index}.usage` as const)}
                  >
                    <option value="">Select usage</option>
                    {fontUsageOptions.map((usage) => (
                      <option key={usage} value={usage}>
                        {usage}
                      </option>
                    ))}
                  </Select>
                </div>
                {typographyFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTypography(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTypography({ name: '', usage: '' })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Font
            </button>
          </div>
        </FormField>

        <FormField
          label="Image Style Description"
          error={errors.brandVisuals?.imageStyleDescription?.message}
          required
          description="Describe the visual style and aesthetic of images used in your brand"
        >
          <Textarea
            {...register('brandVisuals.imageStyleDescription')}
            rows={3}
            placeholder="e.g., Clean and minimalist photography with bright natural lighting, authentic people in real environments..."
            error={!!errors.brandVisuals?.imageStyleDescription}
          />
        </FormField>
      </div>
    </FormSection>
  );
}