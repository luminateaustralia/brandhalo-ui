'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Input from './inputs/Input';
import Select from './inputs/Select';
import Textarea from './inputs/Textarea';

export default function ComplianceStep() {
  const { register, formState: { errors } } = useFormContext<BrandProfile>();

  const trademarkStatusOptions = [
    'Not applicable',
    'Pending application',
    'Registered trademark',
    'Common law trademark',
    'Service mark registered',
    'Under review'
  ];

  return (
    <FormSection
      title="Compliance & Legal"
      description="Brand guidelines, trademark information, and legal considerations."
    >
      <div className="space-y-6">
        <FormField
          label="Brand Guidelines URL"
          error={errors.compliance?.brandGuidelinesURL?.message}
          description="Link to your comprehensive brand guidelines document (optional)"
        >
          <Input
            type="url"
            {...register('compliance.brandGuidelinesURL')}
            placeholder="https://example.com/brand-guidelines.pdf"
            error={!!errors.compliance?.brandGuidelinesURL}
          />
        </FormField>

        <FormField
          label="Trademark Status"
          error={errors.compliance?.trademarkStatus?.message}
          required
          description="Current status of your brand's trademark protection"
        >
          <Select
            {...register('compliance.trademarkStatus')}
            error={!!errors.compliance?.trademarkStatus}
          >
            <option value="">Select trademark status</option>
            {trademarkStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Additional Notes"
          error={errors.compliance?.notes?.message}
          description="Any additional compliance requirements, legal considerations, or important notes"
        >
          <Textarea
            {...register('compliance.notes')}
            rows={4}
            placeholder="Add any additional compliance requirements, usage restrictions, legal considerations, or other important notes..."
            error={!!errors.compliance?.notes}
          />
        </FormField>
      </div>
    </FormSection>
  );
}