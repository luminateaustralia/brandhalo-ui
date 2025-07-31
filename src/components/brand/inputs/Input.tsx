'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styles
          "w-full px-4 py-3 text-sm bg-white border rounded-lg transition-all duration-200",
          "placeholder:text-gray-400 focus:outline-none",
          // Border and focus states
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100",
          // Disabled state
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;