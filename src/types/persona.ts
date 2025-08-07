export interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  image: string;
  description: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaFormData {
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  image: string;
  description: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
  isActive: boolean;
}

export interface PersonaEntity {
  id: string;
  organizationId: string;
  personaData: Persona;
  createdAt: string;
  updatedAt: string;
}

export type PersonaFormMode = 'create' | 'edit' | 'view';

// Predefined options for form dropdowns
export const OCCUPATION_OPTIONS = [
  'Marketing Manager',
  'Software Engineer',
  'Sales Representative',
  'Business Owner',
  'Product Manager',
  'Designer',
  'Consultant',
  'Teacher/Educator',
  'Healthcare Professional',
  'Financial Advisor',
  'Executive/C-Suite',
  'Student',
  'Retired',
  'Stay-at-home Parent',
  'Other'
];

export const INCOME_RANGES = [
  'Under $30,000',
  '$30,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000 - $150,000',
  '$150,000 - $200,000',
  '$200,000+',
  'Prefer not to say'
];

export const CHANNEL_OPTIONS = [
  'Email',
  'LinkedIn',
  'Facebook',
  'Instagram',
  'Twitter/X',
  'TikTok',
  'YouTube',
  'WhatsApp',
  'SMS',
  'Phone calls',
  'In-person meetings',
  'Webinars',
  'Industry blogs',
  'Podcasts',
  'Print media',
  'Radio',
  'TV',
  'Online forums',
  'Professional networks',
  'Word of mouth'
];

export const BUYING_BEHAVIOR_OPTIONS = [
  'Research-driven, compares multiple options',
  'Impulse buyer, makes quick decisions',
  'Brand loyal, sticks to trusted companies',
  'Price-sensitive, seeks best deals',
  'Quality-focused, willing to pay premium',
  'Social proof driven, reads reviews extensively',
  'Relationship-based, prefers personal recommendations',
  'Values-driven, supports brands with purpose',
  'Early adopter, tries new products first',
  'Risk-averse, waits for proven solutions'
];
