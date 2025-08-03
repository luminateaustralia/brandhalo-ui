'use client';

import React, { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
}

export default function FormSection({ children }: FormSectionProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}