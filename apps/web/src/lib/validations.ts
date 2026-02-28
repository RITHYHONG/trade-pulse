import { z } from 'zod';

// Auth validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Contact validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

// New contact schemas for Trader's Daily Edge
export const supportFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject is required'),
  urgency: z.enum(['Low - General question', 'Medium - Feature not working', 'High - Cannot access platform', 'Critical - Platform down']),
  platform: z.enum(['Web Dashboard', 'Mobile App', 'Both']),
  description: z.string().min(20, 'Please provide more details'),
  attachments: z.array(z.instanceof(File)).optional(),
});

export const partnershipsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject is required'),
  company: z.string().min(2, 'Company name is required'),
  role: z.string().min(2, 'Role is required'),
  useCase: z.string().min(20, 'Please describe your use case'),
  timeline: z.enum(['Exploring options', '1-3 months', '3-6 months', '6+ months']),
});

export const generalInquiriesSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject is required'),
  inquiryType: z.enum(['Billing Question', 'Account Management', 'Feature Request', 'Platform Feedback', 'Other']),
  message: z.string().min(10, 'Message is required'),
});

export const pressMediaSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject is required'),
  outlet: z.string().min(2, 'Media outlet is required'),
  deadline: z.string().optional(),
  requestType: z.enum(['Interview Request', 'Media Kit', 'Press Release', 'Quote Request', 'Speaking Engagement']),
  details: z.string().min(20, 'Please provide details'),
});

// Calendar API response validation
export const economicEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.enum(["US", "EU", "UK", "Asia", "EM"]),
  datetime: z.string(), // Will be parsed to Date
  impact: z.enum(["high", "medium", "low"]),
  category: z.enum(["inflation", "employment", "gdp", "centralBank", "trade", "retail", "manufacturing", "housing"]),
  actual: z.number().optional(),
  consensus: z.number(),
  previous: z.number(),
  unit: z.string(),
  historicalData: z.object({
    avgMove: z.number(),
    directionBias: z.enum(["bullish", "bearish", "neutral"]),
    biasSuccessRate: z.number(),
    peakImpactMinutes: z.number(),
    fadeTimeHours: z.number(),
  }),
  consensusIntelligence: z.object({
    estimateDistribution: z.array(z.number()),
    revisionMomentum: z.enum(["up", "down", "stable"]),
    surpriseProbability: z.number(),
    whisperNumber: z.number().optional(),
  }),
  tradingSetup: z.object({
    strategyTag: z.string(),
    correlatedAssets: z.array(z.string()),
    expectedMove: z.number(),
    confidenceScore: z.number(),
  }),
  affectedAssets: z.array(z.string()),
});

export const centralBankEventSchema = z.object({
  id: z.string(),
  bank: z.string(),
  type: z.enum(["meeting", "speech", "minutes"]),
  datetime: z.string(), // Will be parsed to Date
  speaker: z.string().optional(),
  rateProbabilities: z.object({
    cut: z.number(),
    hold: z.number(),
    hike: z.number(),
  }),
  keyTopics: z.array(z.string()),
});

export const calendarApiResponseSchema = z.object({
  events: z.array(economicEventSchema),
  centralBankEvents: z.array(centralBankEventSchema),
  intelligence: z.object({
    overallSummary: z.string(),
    keyRisks: z.array(z.string()),
    marketVerdict: z.string(),
  }).optional(),
  correlations: z.array(z.object({
    event1: z.string(),
    event2: z.string(),
    strength: z.number(),
    leadLag: z.string(),
    lagMinutes: z.number().optional(),
    category: z.string(),
  })).optional(),
});

// Auth validation
export const sessionValidateResponseSchema = z.object({
  valid: z.boolean(),
  success: z.boolean().optional(),
  refreshed: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Type exports
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SupportFormData = z.infer<typeof supportFormSchema>;
export type PartnershipsFormData = z.infer<typeof partnershipsSchema>;
export type GeneralInquiriesFormData = z.infer<typeof generalInquiriesSchema>;
export type PressMediaFormData = z.infer<typeof pressMediaSchema>;
export type CalendarApiResponse = z.infer<typeof calendarApiResponseSchema>;