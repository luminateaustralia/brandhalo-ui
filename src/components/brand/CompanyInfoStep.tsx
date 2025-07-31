'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Select from './inputs/Select';

export default function CompanyInfoStep() {
  const { register, formState: { errors } } = useFormContext<BrandProfile>();

  const companySizeOptions = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  return (
    <FormSection
      title="Company Information"
      description="Tell us about your company's basic details and background."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          error={errors.companyInfo?.companyName?.message}
          required
        >
          <Input
            type="text"
            {...register('companyInfo.companyName')}
            placeholder="e.g., Acme Corporation"
            error={!!errors.companyInfo?.companyName}
          />
        </FormField>

        <FormField
          label="Industry"
          error={errors.companyInfo?.industry?.message}
          required
        >
          <Input
            type="text"
            {...register('companyInfo.industry')}
            placeholder="e.g., Technology, Healthcare, Finance"
            error={!!errors.companyInfo?.industry}
          />
        </FormField>

        <FormField
          label="Website"
          error={errors.companyInfo?.website?.message}
        >
          <Input
            type="url"
            {...register('companyInfo.website')}
            placeholder="https://www.example.com"
            error={!!errors.companyInfo?.website}
          />
        </FormField>

        <FormField
          label="Country"
          error={errors.companyInfo?.country?.message}
          required
        >
          <Input
            type="text"
            {...register('companyInfo.country')}
            placeholder="e.g., United States, United Kingdom"
            error={!!errors.companyInfo?.country}
          />
        </FormField>

        <FormField
          label="Year Founded"
          error={errors.companyInfo?.yearFounded?.message}
        >
          <Input
            type="number"
            {...register('companyInfo.yearFounded', { 
              valueAsNumber: true,
              setValueAs: (value) => value === '' ? null : Number(value)
            })}
            placeholder="e.g., 2020"
            min="1800"
            max={new Date().getFullYear()}
            error={!!errors.companyInfo?.yearFounded}
          />
        </FormField>

        <FormField
          label="Company Size"
          error={errors.companyInfo?.size?.message}
          required
        >
          <Select
            {...register('companyInfo.size')}
            error={!!errors.companyInfo?.size}
          >
            <option value="">Select company size</option>
            {companySizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
    </FormSection>
  );
}