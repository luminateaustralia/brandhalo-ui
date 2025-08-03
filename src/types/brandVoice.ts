export interface BrandVoice {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  bio: string;
  profileImage?: string;
  
  // Voice characteristics
  communicationStyle: string;
  tone: string;
  personalityTraits: string[];
  
  // Content preferences
  contentFocus: string[];
  preferredTopics: string[];
  expertiseAreas: string[];
  
  // Social media and content guidelines
  doList: string[];
  dontList: string[];
  keyMessages: string[];
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandVoiceFormData {
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  bio: string;
  profileImage?: string;
  communicationStyle: string;
  tone: string;
  personalityTraits: string[];
  contentFocus: string[];
  preferredTopics: string[];
  expertiseAreas: string[];
  doList: string[];
  dontList: string[];
  keyMessages: string[];
  isActive: boolean;
}

export interface BrandVoiceEntity {
  id: string;
  organizationId: string;
  voiceData: BrandVoice;
  createdAt: string;
  updatedAt: string;
}

export type BrandVoiceFormMode = 'create' | 'edit' | 'view';

// Predefined options for form dropdowns
export const COMMUNICATION_STYLES = [
  'Professional & Formal',
  'Friendly & Conversational',
  'Technical & Expert',
  'Casual & Approachable',
  'Authoritative & Direct',
  'Supportive & Encouraging'
];

export const TONE_OPTIONS = [
  'Confident',
  'Empathetic',
  'Enthusiastic',
  'Professional',
  'Witty',
  'Serious',
  'Inspirational',
  'Educational'
];

export const PERSONALITY_TRAITS = [
  'Analytical',
  'Creative',
  'Innovative',
  'Reliable',
  'Collaborative',
  'Detail-oriented',
  'Strategic',
  'Results-driven',
  'Customer-focused',
  'Tech-savvy'
];

export const CONTENT_FOCUS_AREAS = [
  'Product Updates',
  'Industry Insights',
  'Company Culture',
  'Thought Leadership',
  'Customer Success',
  'Technical Education',
  'Market Trends',
  'Best Practices'
];

export const DEPARTMENT_OPTIONS = [
  'Marketing',
  'Sales',
  'Product',
  'Engineering',
  'Customer Success',
  'HR',
  'Leadership',
  'Business Development'
];