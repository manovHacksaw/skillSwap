import { z } from "zod"

// Validation schemas based on your Prisma User model
export const basicInfoSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .trim()
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  socialLinks: z.record(z.string().url("Please enter a valid URL").optional()).optional(),
})

export const aboutYouSchema = z.object({
  occupation: z.string().min(1, "Please select your occupation"),
  location: z.string().max(100, "Location must be less than 100 characters").optional().or(z.literal("")),
  timezone: z.string().min(1, "Please select your timezone"),
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  preferredLanguages: z.array(z.string()).min(1, "Please select at least one language"),
})

export const skillsSchema = z.object({
  skillsOffered: z
    .array(
      z.object({
        name: z.string().min(1, "Skill name is required"),
        category: z.string().min(1, "Category is required"),
        proficiency: z.enum(["Beginner", "Intermediate", "Expert"]),
      }),
    )
    .min(1, "Please select at least one skill you can teach"),
  learningGoals: z
    .array(
      z.object({
        name: z.string().min(1, "Skill name is required"),
        category: z.string().min(1, "Category is required"),
        priority: z.enum(["Low", "Medium", "High"]),
      }),
    )
    .min(1, "Please select at least one skill you want to learn"),
})

export const preferencesSchema = z.object({
  userAvailability: z.array(z.string()).min(1, "Please select at least one availability option"),
  userIntent: z.array(z.string()).min(1, "Please select at least one goal"),
})

export const walletSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  walletSignature: z.string().min(1, "Wallet signature is required"),
})

// Complete form validation
export const completeFormSchema = basicInfoSchema
  .merge(aboutYouSchema)
  .merge(skillsSchema)
  .merge(preferencesSchema)
  .merge(walletSchema)

export type ValidationError = {
  field: string
  message: string
}

export function validateStep(step: number, data: any): ValidationError[] {
  const errors: ValidationError[] = []

  try {
    switch (step) {
      case 1: // Basic Info
        basicInfoSchema.parse(data)
        break
      case 2: // About You
        aboutYouSchema.parse(data)
        break
      case 3: // Skills to Teach
        z.object({ skillsOffered: skillsSchema.shape.skillsOffered }).parse(data)
        break
      case 4: // Skills to Learn
        z.object({ learningGoals: skillsSchema.shape.learningGoals }).parse(data)
        break
      case 5: // Preferences
        preferencesSchema.parse(data)
        break
      case 6: // Wallet
        walletSchema.parse(data)
        break
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
        })
      })
    }
  }

  return errors
}

export function validateCompleteForm(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  try {
    completeFormSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
        })
      })
    }
  }

  return errors
}
