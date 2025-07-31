'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { FormStep } from '@/types/brand';

interface BrandStepProgressProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function BrandStepProgress({ steps, currentStep, onStepClick }: BrandStepProgressProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      {/* Current Step Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep]?.title}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Steps</span>
          <span>Click any completed step to jump back</span>
        </div>
        
        {/* Desktop - All steps in one row */}
        <div className="hidden md:block">
          <div className="grid grid-cols-8 gap-2">
            {steps.map((step, stepIdx) => (
              <button
                key={step.id}
                onClick={() => stepIdx <= currentStep && onStepClick(stepIdx)}
                disabled={stepIdx > currentStep}
                className={`relative p-2 rounded-lg text-left transition-all duration-200 ${
                  stepIdx === currentStep
                    ? 'bg-purple-50 border-2 border-purple-200 shadow-sm'
                    : stepIdx < currentStep
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    stepIdx === currentStep
                      ? 'bg-purple-600 text-white'
                      : stepIdx < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {stepIdx < currentStep ? (
                      <CheckIcon className="w-3 h-3" />
                    ) : (
                      <span>{stepIdx + 1}</span>
                    )}
                  </div>
                  <div className="w-full">
                    <p className={`text-xs font-medium text-center leading-tight ${
                      stepIdx <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                
                {/* Current step indicator */}
                {stepIdx === currentStep && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full">
                    <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile - Simplified view */}
        <div className="md:hidden">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => stepIdx <= currentStep && onStepClick(stepIdx)}
                disabled={stepIdx > currentStep}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  stepIdx === currentStep
                    ? 'bg-purple-600 scale-125'
                    : stepIdx < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-3">
            <p className="text-sm font-medium text-gray-900">
              {steps[currentStep]?.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}