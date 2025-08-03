import { BrandProfile } from '@/types/brand';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  AcademicCapIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

// Dummy data for Mater Health - comprehensive brand profile
export const getMaterHealthDummyData = (): BrandProfile => ({
  companyInfo: {
    companyName: 'Mater Health',
    industry: 'Healthcare Services',
    website: 'https://www.materhealth.com.au',
    country: 'Australia',
    yearFounded: 1906,
    size: 'Enterprise (1000+ employees)'
  },
  brandEssence: {
    tagline: 'Exceptional Care, Every Time',
    brandPurpose: 'To provide compassionate, world-class healthcare that transforms lives and strengthens communities',
    mission: 'We exist to deliver exceptional healthcare services with dignity, respect, and innovation, ensuring every patient receives the highest quality care tailored to their individual needs.',
    vision: 'To be Australia\'s most trusted healthcare provider, leading in medical excellence, research innovation, and community health outcomes.',
    values: [
      'Compassion - We care deeply about every person we serve',
      'Excellence - We strive for the highest standards in everything we do',
      'Innovation - We embrace new technologies and approaches to improve health outcomes',
      'Integrity - We act with honesty, transparency, and ethical responsibility',
      'Collaboration - We work together with patients, families, and communities'
    ],
    brandPromise: 'Every patient will receive personalized, compassionate care delivered by skilled professionals using the latest medical advances and technology.'
  },
  brandPersonality: {
    archetype: 'Caregiver',
    traits: ['Compassionate', 'Professional', 'Trustworthy', 'Innovative', 'Reliable', 'Empathetic'],
    voiceTone: {
      primaryTone: 'Compassionate and Professional',
      secondaryTone: 'Reassuring and Knowledgeable'
    }
  },
  brandVisuals: {
    logoURL: '/logos/mater-health-logo.svg',
    primaryColors: [
      { name: 'Mater Blue', hex: '#0056b3' },
      { name: 'Medical White', hex: '#ffffff' }
    ],
    secondaryColors: [
      { name: 'Caring Green', hex: '#28a745' },
      { name: 'Warm Gray', hex: '#6c757d' },
      { name: 'Accent Teal', hex: '#17a2b8' }
    ],
    typography: [
      { name: 'Inter', usage: 'Headlines and headings' },
      { name: 'Open Sans', usage: 'Body text and patient information' }
    ],
    imageStyleDescription: 'Clean, professional photography featuring real patients and healthcare professionals. Warm lighting, authentic moments of care, diverse representation. Medical imagery should be approachable, not clinical or intimidating.'
  },
  targetAudience: [
    {
      name: 'Families with Young Children',
      description: 'Parents seeking comprehensive pediatric care and family health services',
      keyNeeds: 'Child-friendly facilities, emergency care, preventive health programs, family support services',
      demographics: 'Ages 25-45, middle to upper-middle income, suburban locations, health-conscious'
    },
    {
      name: 'Seniors and Aging Adults',
      description: 'Older adults requiring specialized medical care and ongoing health management',
      keyNeeds: 'Chronic disease management, accessible facilities, continuity of care, specialist services',
      demographics: 'Ages 65+, various income levels, need for convenience and accessibility'
    },
    {
      name: 'Working Professionals',
      description: 'Busy professionals needing convenient, efficient healthcare services',
      keyNeeds: 'Flexible scheduling, telehealth options, executive health programs, quick access',
      demographics: 'Ages 30-55, higher income, time-constrained, technology-savvy'
    }
  ],
  competitiveLandscape: {
    primaryCompetitors: [
      {
        name: 'St Vincent\'s Health Australia',
        website: 'https://www.svha.org.au',
        positioning: 'Catholic healthcare network focused on compassionate care and social justice'
      },
      {
        name: 'Ramsay Health Care',
        website: 'https://www.ramsayhealth.com',
        positioning: 'Private healthcare provider emphasizing quality, innovation, and patient experience'
      },
      {
        name: 'Healthscope',
        website: 'https://www.healthscope.com.au',
        positioning: 'Private hospital operator focused on clinical excellence and patient-centered care'
      }
    ],
    differentiators: 'Our unique combination of 115+ years of healthcare heritage, cutting-edge medical research through Mater Research, comprehensive service offerings from maternity to aged care, and deep community connections. We\'re the only major healthcare provider that seamlessly integrates clinical care, research, and education.'
  },
  messaging: {
    elevatorPitch: 'Mater Health is Australia\'s most trusted healthcare provider, combining over a century of medical excellence with innovative research and compassionate care. We serve patients across the full spectrum of life, from birth to aged care, with personalized treatment plans and state-of-the-art facilities.',
    keyMessages: [
      'Over 115 years of healthcare excellence and community trust',
      'Leading medical research and innovation through Mater Research Institute',
      'Comprehensive services covering all life stages and medical specialties',
      'Patient-centered care that treats the whole person, not just the condition',
      'Strong community partnerships and commitment to accessible healthcare'
    ],
    doNotSay: 'Avoid medical jargon, impersonal language, cost-focused messaging, comparison with public health system, overly clinical terminology, or anything that could create anxiety about medical procedures.'
  },
  compliance: {
    brandGuidelinesURL: 'https://brand.materhealth.com.au/guidelines',
    trademarkStatus: 'Registered trademark - Mater Health® and associated logos are protected',
    notes: 'Ensure all healthcare claims comply with TGA regulations. Patient privacy (Privacy Act 1988) must be maintained in all communications. Medical advertising must follow AHPRA guidelines. Brand usage must align with Catholic health ministry values and mission.'
  }
});

// Check if we should use dummy data
export const shouldUseDummyData = (): boolean => {
  // Check both server-side and client-side environment variables
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocal = process.env.ENV === 'local' || process.env.NEXT_PUBLIC_ENV === 'local';
  
  console.log('🔍 Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    ENV: process.env.ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    isDevelopment,
    isLocal,
    shouldUseDummy: isDevelopment && isLocal
  });
  
  return isDevelopment && isLocal;
};

// Persona interface
export interface PersonaData {
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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

// Sample personas data
export const personas: PersonaData[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 32,
    occupation: 'Marketing Manager',
    location: 'Sydney, Australia',
    income: '$85,000 - $110,000',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    description: 'Tech-savvy professional who values efficiency and quality. Early adopter of new products and services.',
    goals: [
      'Advance her career in marketing',
      'Maintain work-life balance',
      'Stay updated with latest trends',
      'Build professional network'
    ],
    painPoints: [
      'Limited time for research',
      'Information overload',
      'Difficulty finding trusted brands',
      'Budget constraints for premium products'
    ],
    preferredChannels: ['LinkedIn', 'Email', 'Webinars', 'Industry blogs'],
    buyingBehavior: 'Research-driven, reads reviews, compares options before purchasing',
    icon: BriefcaseIcon,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    age: 45,
    occupation: 'Small Business Owner',
    location: 'Melbourne, Australia',
    income: '$120,000 - $150,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    description: 'Experienced entrepreneur running a local retail business. Values reliability and long-term partnerships.',
    goals: [
      'Grow his business revenue',
      'Improve operational efficiency',
      'Build customer loyalty',
      'Expand to new markets'
    ],
    painPoints: [
      'Cash flow management',
      'Finding reliable suppliers',
      'Competing with larger businesses',
      'Managing multiple responsibilities'
    ],
    preferredChannels: ['Phone calls', 'In-person meetings', 'Industry magazines', 'Local networking'],
    buyingBehavior: 'Relationship-focused, prefers established vendors, values personal service',
    icon: ShoppingBagIcon,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 28,
    occupation: 'Registered Nurse',
    location: 'Brisbane, Australia',
    income: '$70,000 - $85,000',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    description: 'Caring healthcare professional focused on helping others. Values authentic brands with social impact.',
    goals: [
      'Provide excellent patient care',
      'Continue professional development',
      'Maintain physical and mental health',
      'Support causes she believes in'
    ],
    painPoints: [
      'Shift work affecting lifestyle',
      'Emotional stress from work',
      'Limited time for personal activities',
      'Student loan repayments'
    ],
    preferredChannels: ['Instagram', 'Facebook', 'Healthcare forums', 'Podcasts'],
    buyingBehavior: 'Values-driven, supports brands with social responsibility, influenced by peer recommendations',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-700'
  },
  {
    id: '4',
    name: 'David Kim',
    age: 55,
    occupation: 'IT Director',
    location: 'Perth, Australia',
    income: '$140,000 - $180,000',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    description: 'Senior technology executive with extensive experience. Values security, reliability, and proven solutions.',
    goals: [
      'Modernize company IT infrastructure',
      'Ensure cybersecurity compliance',
      'Mentor junior team members',
      'Plan for retirement'
    ],
    painPoints: [
      'Keeping up with rapid tech changes',
      'Budget approval processes',
      'Vendor management complexity',
      'Legacy system integration'
    ],
    preferredChannels: ['Industry conferences', 'Technical whitepapers', 'Vendor presentations', 'Professional networks'],
    buyingBehavior: 'Evidence-based, requires detailed documentation, prefers established enterprise solutions',
    icon: AcademicCapIcon,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: '5',
    name: 'Lisa Wilson',
    age: 38,
    occupation: 'Stay-at-home Parent',
    location: 'Adelaide, Australia',
    income: 'Household: $95,000 - $120,000',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    description: 'Dedicated mother of two managing household needs. Price-conscious but values quality for family products.',
    goals: [
      'Provide best for her children',
      'Manage household budget effectively',
      'Stay connected with other parents',
      'Maintain family health and wellness'
    ],
    painPoints: [
      'Limited personal time',
      'Balancing quality vs. cost',
      'Information overwhelm for product choices',
      'Managing children\'s schedules'
    ],
    preferredChannels: ['Facebook groups', 'Parenting blogs', 'YouTube reviews', 'Word of mouth'],
    buyingBehavior: 'Community-influenced, seeks recommendations, values family-friendly brands, bargain hunter',
    icon: HomeIcon,
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: '6',
    name: 'Alex Turner',
    age: 24,
    occupation: 'Graduate Student',
    location: 'Canberra, Australia',
    income: '$25,000 - $35,000',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
    description: 'Environmentally conscious student pursuing Masters degree. Values sustainability and authentic brand messaging.',
    goals: [
      'Complete degree successfully',
      'Find meaningful career opportunities',
      'Live sustainably',
      'Build professional network'
    ],
    painPoints: [
      'Limited budget',
      'Uncertain career prospects',
      'Student debt concerns',
      'Balancing study and part-time work'
    ],
    preferredChannels: ['TikTok', 'Instagram', 'University forums', 'Sustainability blogs'],
    buyingBehavior: 'Price-sensitive, values sustainability, influenced by social media, prefers ethical brands',
    icon: UserGroupIcon,
    color: 'bg-teal-100 text-teal-700'
  }
];