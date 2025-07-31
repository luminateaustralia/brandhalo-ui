import { BrandProfile } from '@/types/brand';

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