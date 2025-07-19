import { z } from "zod"

// Enhanced validation schemas based on your Prisma User model
export const clerkIdSchema = z
  .string()
  .min(1, "Clerk ID is required")
  .regex(/^user_[a-zA-Z0-9]+$/, "Invalid Clerk ID format")

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
  .transform((val) => val.toLowerCase())
  .optional()
  .or(z.literal(""))

export const nameSchema = z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").trim()

export const bioSchema = z
  .string()
  .max(1000, "Bio must be less than 1000 characters")
  .trim()
  .optional()
  .or(z.literal(""))

export const avatarUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .max(500, "Avatar URL must be less than 500 characters")
  .optional()
  .or(z.literal(""))

export const interestsSchema = z
  .array(z.string().min(1, "Interest cannot be empty").max(50, "Interest must be less than 50 characters"))
  .min(1, "Please select at least one interest")
  .max(20, "You can select up to 20 interests")

export const socialLinksSchema = z
  .record(
    z.string().min(1, "Platform name is required"),
    z.string().url("Please enter a valid URL").max(500, "URL must be less than 500 characters"),
  )
  .optional()
  .refine((links) => !links || Object.keys(links).length <= 10, "You can add up to 10 social links")

export const preferredLanguagesSchema = z
  .array(z.string().min(1, "Language cannot be empty").max(30, "Language name must be less than 30 characters"))
  .min(1, "Please select at least one language")
  .max(15, "You can select up to 15 languages")

export const occupationSchema = z
  .string()
  .min(1, "Please select your occupation")
  .max(100, "Occupation must be less than 100 characters")

export const locationSchema = z
  .string()
  .max(100, "Location must be less than 100 characters")
  .trim()
  .optional()
  .or(z.literal(""))

export const timezoneSchema = z
  .string()
  .min(1, "Please select your timezone")
  .regex(/^UTC[+-]\d{2}:\d{2}$/, "Invalid timezone format")

export const ageSchema = z
  .number()
  .int("Age must be a whole number")
  .min(13, "You must be at least 13 years old")
  .max(120, "Please enter a valid age")

export const skillsArraySchema = z
  .array(z.string().min(1, "Skill cannot be empty").max(100, "Skill name must be less than 100 characters"))
  .min(1, "Please select at least one skill")
  .max(50, "You can add up to 50 skills")

export const userIntentSchema = z
  .array(z.string().min(1, "Intent cannot be empty").max(100, "Intent must be less than 100 characters"))
  .min(1, "Please select at least one goal")
  .max(10, "You can select up to 10 goals")

export const userAvailabilitySchema = z
  .array(z.string().min(1, "Availability option cannot be empty"))
  .min(1, "Please select at least one availability option")
  .max(10, "You can select up to 10 availability options")

export const walletAddressSchema = z
  .string()
  .min(1, "Wallet address is required")
  .regex(/^0x[a-fA-F0-9]{40}$/, "Please enter a valid Ethereum wallet address")

// Step-specific validation schemas
export const basicInfoStepSchema = z.object({
  displayName: nameSchema,
  username: usernameSchema,
  bio: bioSchema,
  interests: interestsSchema,
  socialLinks: socialLinksSchema,
})

export const aboutYouStepSchema = z.object({
  occupation: occupationSchema,
  location: locationSchema,
  timezone: timezoneSchema,
  age: ageSchema,
  preferredLanguages: preferredLanguagesSchema,
})

export const skillsToTeachStepSchema = z.object({
  skillsOffered: skillsArraySchema,
})

export const skillsToLearnStepSchema = z.object({
  learningGoals: skillsArraySchema,
})

export const preferencesStepSchema = z.object({
  userAvailability: userAvailabilitySchema,
  userIntent: userIntentSchema,
})

export const walletStepSchema = z.object({
  walletAddress: walletAddressSchema,
  walletSignature: z.string().min(1, "Wallet signature is required"),
})

// Complete form validation schema
export const completeOnboardingSchema = z.object({
  clerkId: clerkIdSchema,
  email: emailSchema,
  name: nameSchema,
  username: usernameSchema,
  bio: bioSchema.nullable(),
  avatarUrl: avatarUrlSchema.nullable(),
  interests: interestsSchema,
  socialLinks: socialLinksSchema.nullable(),
  preferredLanguages: preferredLanguagesSchema,
  occupation: occupationSchema,
  location: locationSchema.nullable(),
  timezone: timezoneSchema,
  age: ageSchema,
  skillsOffered: skillsArraySchema,
  learningGoals: skillsArraySchema,
  userIntent: userIntentSchema,
  userAvailability: userAvailabilitySchema,
  walletAddress: walletAddressSchema.nullable(),
})

export type ValidationError = {
  field: string
  message: string
  code?: string
}

export type ValidationResult = {
  success: boolean
  errors: ValidationError[]
  data?: any
}
