'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BrandProfile } from '@/types/brand';
import FormField from './FormField';
import FormSection from './FormSection';
import Textarea from './inputs/Textarea';

export default function MessagingStep() {
  const { register, control, formState: { errors } } = useFormContext<BrandProfile>();
  const { fields: messageFields, append: appendMessage, remove: removeMessage } = useFieldArray({
    control,
    name: 'messaging.keyMessages'
  });

  return (
    <FormSection
      title="Messaging"
      description="Define your core messages and communication guidelines."
    >
      <div className="space-y-6">
        <FormField
          label="Elevator Pitch"
          error={errors.messaging?.elevatorPitch?.message}
          required
          description="A 30-60 second overview of what your brand does and why it matters"
        >
          <Textarea
            {...register('messaging.elevatorPitch')}
            rows={4}
            placeholder="In 30-60 seconds, explain what your brand does, who you serve, and what makes you different..."
            error={!!errors.messaging?.elevatorPitch}
          />
        </FormField>

        <FormField
          label="Key Messages"
          error={errors.messaging?.keyMessages?.message}
          required
          description="Core messages you want to consistently communicate about your brand"
        >
          <div className="space-y-3">
            {messageFields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message {index + 1}
                  </label>
                  <Textarea
                    {...register(`messaging.keyMessages.${index}` as const)}
                    rows={2}
                    placeholder={`Key message ${index + 1}...`}
                  />
                </div>
                {messageFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMessage(index)}
                    className="p-2 text-red-600 hover:text-red-800 mt-6"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendMessage('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Key Message
            </button>
          </div>
        </FormField>

        <FormField
          label="Words/Phrases to Avoid"
          error={errors.messaging?.doNotSay?.message}
          description="Words, phrases, or concepts your brand should avoid using (optional)"
        >
          <Textarea
            {...register('messaging.doNotSay')}
            rows={3}
            placeholder="List words, phrases, or messaging approaches that don't align with your brand..."
            error={!!errors.messaging?.doNotSay}
          />
        </FormField>
      </div>
    </FormSection>
  );
}