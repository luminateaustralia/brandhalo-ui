// Brand Profile Types - Comprehensive brand information structure
export interface BrandProfile {
  companyInfo: CompanyInfo;
  brandEssence: BrandEssence;
  brandPersonality: BrandPersonality;
  brandVisuals: BrandVisuals;
  targetAudience: AudienceSegment[];
  competitiveLandscape: CompetitiveLandscape;
  messaging: Messaging;
  compliance: Compliance;
}

export interface CompanyInfo {
  companyName: string;
  industry?: string;
  website?: string;
  country?: string;
  yearFounded: number | null;
  size?: string; // e.g., Small, Medium, Large, Number of Employees
}

export interface BrandEssence {
  tagline?: string;
  brandPurpose?: string; // "Why does your brand exist?"
  mission?: string;
  vision?: string;
  values: (string | undefined)[];
  brandPromise?: string; // "What do you consistently deliver to your customers?"
}

export interface BrandPersonality {
  archetype?: string; // e.g., Explorer, Sage, Everyman
  traits: (string | undefined)[]; // e.g., Friendly, Innovative, Reliable
  voiceTone: {
    primaryTone?: string;
    secondaryTone?: string;
  }; // e.g., Bold, Empathetic, Playful
}

export interface BrandVisuals {
  logoURL?: string;
  primaryColors: ColorInfo[];
  secondaryColors: ColorInfo[];
  typography: FontInfo[];
  imageStyleDescription?: string;
}

export interface ColorInfo {
  name?: string;
  hex?: string;
}

export interface FontInfo {
  name?: string;
  usage?: string; // e.g., "Headings", "Body text"
}

export interface AudienceSegment {
  name?: string;
  description?: string;
  keyNeeds?: string;
  demographics?: string;
}

export interface CompetitiveLandscape {
  primaryCompetitors: Competitor[];
  differentiators?: string;
}

export interface Competitor {
  name?: string;
  website?: string;
  positioning?: string;
}

export interface Messaging {
  elevatorPitch?: string;
  keyMessages: (string | undefined)[];
  doNotSay?: string; // Words/phrases to avoid
}

export interface Compliance {
  brandGuidelinesURL?: string;
  trademarkStatus?: string;
  notes?: string;
}

// Form step configuration for multi-step form
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  isCompleted?: boolean;
}

// Database entity
export interface BrandProfileEntity {
  id: string;
  organizationId: string;
  brandData: BrandProfile;
  createdAt: string;
  updatedAt: string;
}

// Form mode types
export type FormMode = 'create' | 'edit' | 'view';

// Form validation state
export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}