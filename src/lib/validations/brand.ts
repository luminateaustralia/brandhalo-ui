import { z } from 'zod';

// Color validation schema
const colorSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  hex: z.string().optional().or(z.literal(''))
});

// Font validation schema
const fontSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  usage: z.string().optional().or(z.literal(''))
});

// Competitor validation schema
const competitorSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  positioning: z.string().optional().or(z.literal(''))
});

// Audience segment validation schema
const audienceSegmentSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  keyNeeds: z.string().optional().or(z.literal('')),
  demographics: z.string().optional().or(z.literal(''))
});

// Company Info validation
export const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  yearFounded: z.number().min(1800).max(new Date().getFullYear()).nullable(),
  size: z.string().optional().or(z.literal(''))
});

// Brand Essence validation
export const brandEssenceSchema = z.object({
  tagline: z.string().optional().or(z.literal('')),
  brandPurpose: z.string().optional().or(z.literal('')),
  mission: z.string().optional().or(z.literal('')),
  vision: z.string().optional().or(z.literal('')),
  values: z.array(z.string().optional()).optional().default(['']),
  brandPromise: z.string().optional().or(z.literal(''))
});

// Brand Personality validation
export const brandPersonalitySchema = z.object({
  archetype: z.string().optional().or(z.literal('')),
  traits: z.array(z.string().optional()).optional().default(['']),
  voiceTone: z.object({
    primaryTone: z.string().optional().or(z.literal('')),
    secondaryTone: z.string().optional().or(z.literal(''))
  })
});

// Brand Visuals validation
export const brandVisualsSchema = z.object({
  logoURL: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  primaryColors: z.array(colorSchema).optional().default([{ name: '', hex: '' }]),
  secondaryColors: z.array(colorSchema).optional().default([]),
  typography: z.array(fontSchema).optional().default([{ name: '', usage: '' }]),
  imageStyleDescription: z.string().optional().or(z.literal(''))
});

// Competitive Landscape validation
export const competitiveLandscapeSchema = z.object({
  primaryCompetitors: z.array(competitorSchema).optional().default([]),
  differentiators: z.string().optional().or(z.literal(''))
});

// Messaging validation
export const messagingSchema = z.object({
  elevatorPitch: z.string().optional().or(z.literal('')),
  keyMessages: z.array(z.string().optional()).optional().default(['']),
  doNotSay: z.string().optional().or(z.literal(''))
});

// Compliance validation
export const complianceSchema = z.object({
  brandGuidelinesURL: z.string().url('Invalid guidelines URL').optional().or(z.literal('')),
  trademarkStatus: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

// Full Brand Profile validation
export const brandProfileSchema = z.object({
  companyInfo: companyInfoSchema,
  brandEssence: brandEssenceSchema,
  brandPersonality: brandPersonalitySchema,
  brandVisuals: brandVisualsSchema,
  targetAudience: z.array(audienceSegmentSchema).optional().default([{ name: '', description: '', keyNeeds: '', demographics: '' }]),
  competitiveLandscape: competitiveLandscapeSchema,
  messaging: messagingSchema,
  compliance: complianceSchema
});

// Individual section validation functions
export const validateCompanyInfo = (data: unknown) => companyInfoSchema.safeParse(data);
export const validateBrandEssence = (data: unknown) => brandEssenceSchema.safeParse(data);
export const validateBrandPersonality = (data: unknown) => brandPersonalitySchema.safeParse(data);
export const validateBrandVisuals = (data: unknown) => brandVisualsSchema.safeParse(data);
export const validateTargetAudience = (data: unknown) => z.array(audienceSegmentSchema).safeParse(data);
export const validateCompetitiveLandscape = (data: unknown) => competitiveLandscapeSchema.safeParse(data);
export const validateMessaging = (data: unknown) => messagingSchema.safeParse(data);
export const validateCompliance = (data: unknown) => complianceSchema.safeParse(data);

// Full brand profile validation
export const validateBrandProfile = (data: unknown) => brandProfileSchema.safeParse(data);