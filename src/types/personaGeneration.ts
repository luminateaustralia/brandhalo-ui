// Schema for AI-generated personas response
export interface AIGeneratedPersona {
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  image?: string; // Optional - AI may not always provide this
  description: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
  isActive: boolean;
}

export interface PersonaGenerationRequest {
  brandName: string;
  website?: string;
  businessType?: string;
  targetMarket?: string;
}

export interface PersonaGenerationResponse {
  personas: AIGeneratedPersona[];
  metadata?: {
    generatedAt: string;
    basedOn: string; // What information was used to generate these personas
    confidence: number; // 0-100, how confident the AI is in these personas
  };
}

// Validation schema for the persona generation request
export const PERSONA_GENERATION_DEFAULTS = {
  defaultAge: 35,
  defaultIncome: '$50,000 - $75,000',
  defaultActive: true
} as const;
