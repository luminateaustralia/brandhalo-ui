import { z } from 'zod';

// Color validation schema
const colorSchema = z.object({
  name: z.string().min(1, 'Color name is required'),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
});

// Font validation schema
const fontSchema = z.object({
  name: z.string().min(1, 'Font name is required'),
  usage: z.string().min(1, 'Font usage is required')
});

// Competitor validation schema
const competitorSchema = z.object({
  name: z.string().min(1, 'Competitor name is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  positioning: z.string().min(1, 'Positioning is required')
});

// Audience segment validation schema
const audienceSegmentSchema = z.object({
  name: z.string().min(1, 'Audience segment name is required'),
  description: z.string().min(1, 'Description is required'),
  keyNeeds: z.string().min(1, 'Key needs are required'),
  demographics: z.string().min(1, 'Demographics are required')
});

// Company Info validation
export const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  country: z.string().min(1, 'Country is required'),
  yearFounded: z.number().min(1800).max(new Date().getFullYear()).nullable(),
  size: z.string().min(1, 'Company size is required')
});

// Brand Essence validation
export const brandEssenceSchema = z.object({
  tagline: z.string().min(1, 'Tagline is required'),
  brandPurpose: z.string().min(1, 'Brand purpose is required'),
  mission: z.string().min(1, 'Mission is required'),
  vision: z.string().min(1, 'Vision is required'),
  values: z.array(z.string().min(1)).min(1, 'At least one value is required'),
  brandPromise: z.string().min(1, 'Brand promise is required')
});

// Brand Personality validation
export const brandPersonalitySchema = z.object({
  archetype: z.string().min(1, 'Brand archetype is required'),
  traits: z.array(z.string().min(1)).min(1, 'At least one trait is required'),
  voiceTone: z.object({
    primaryTone: z.string().min(1, 'Primary tone is required'),
    secondaryTone: z.string().min(1, 'Secondary tone is required')
  })
});

// Brand Visuals validation
export const brandVisualsSchema = z.object({
  logoURL: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  primaryColors: z.array(colorSchema).min(1, 'At least one primary color is required'),
  secondaryColors: z.array(colorSchema),
  typography: z.array(fontSchema).min(1, 'At least one font is required'),
  imageStyleDescription: z.string().min(1, 'Image style description is required')
});

// Competitive Landscape validation
export const competitiveLandscapeSchema = z.object({
  primaryCompetitors: z.array(competitorSchema),
  differentiators: z.string().min(1, 'Differentiators are required')
});

// Messaging validation
export const messagingSchema = z.object({
  elevatorPitch: z.string().min(1, 'Elevator pitch is required'),
  keyMessages: z.array(z.string().min(1)).min(1, 'At least one key message is required'),
  doNotSay: z.string().optional().or(z.literal(''))
});

// Compliance validation
export const complianceSchema = z.object({
  brandGuidelinesURL: z.string().url('Invalid guidelines URL').optional().or(z.literal('')),
  trademarkStatus: z.string().min(1, 'Trademark status is required'),
  notes: z.string().optional().or(z.literal(''))
});

// Full Brand Profile validation
export const brandProfileSchema = z.object({
  companyInfo: companyInfoSchema,
  brandEssence: brandEssenceSchema,
  brandPersonality: brandPersonalitySchema,
  brandVisuals: brandVisualsSchema,
  targetAudience: z.array(audienceSegmentSchema).min(1, 'At least one target audience segment is required'),
  competitiveLandscape: competitiveLandscapeSchema,
  messaging: messagingSchema,
  compliance: complianceSchema
});

// Individual section validation functions
export const validateCompanyInfo = (data: any) => companyInfoSchema.safeParse(data);
export const validateBrandEssence = (data: any) => brandEssenceSchema.safeParse(data);
export const validateBrandPersonality = (data: any) => brandPersonalitySchema.safeParse(data);
export const validateBrandVisuals = (data: any) => brandVisualsSchema.safeParse(data);
export const validateTargetAudience = (data: any) => z.array(audienceSegmentSchema).safeParse(data);
export const validateCompetitiveLandscape = (data: any) => competitiveLandscapeSchema.safeParse(data);
export const validateMessaging = (data: any) => messagingSchema.safeParse(data);
export const validateCompliance = (data: any) => complianceSchema.safeParse(data);

// Full brand profile validation
export const validateBrandProfile = (data: any) => brandProfileSchema.safeParse(data);