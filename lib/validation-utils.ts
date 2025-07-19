import type { ValidationResult, ValidationError } from "./validation-schema"
import {
  basicInfoStepSchema,
  aboutYouStepSchema,
  skillsToTeachStepSchema,
  skillsToLearnStepSchema,
  preferencesStepSchema,
  walletStepSchema,
  completeOnboardingSchema,
} from "./validation-schema"
import { z } from "zod"

// Performance-optimized validation with caching
const validationCache = new Map<string, ValidationResult>()

export function validateStep(step: number, data: any, useCache = true): ValidationResult {
  const cacheKey = `step-${step}-${JSON.stringify(data)}`

  if (useCache && validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!
  }

  const errors: ValidationError[] = []
  let schema: z.ZodSchema

  try {
    switch (step) {
      case 1: // Basic Info
        schema = basicInfoStepSchema
        break
      case 2: // About You
        schema = aboutYouStepSchema
        break
      case 3: // Skills to Teach
        schema = skillsToTeachStepSchema
        break
      case 4: // Skills to Learn
        schema = skillsToLearnStepSchema
        break
      case 5: // Preferences
        schema = preferencesStepSchema
        break
      case 6: // Wallet
        schema = walletStepSchema
        break
      default:
        return { success: false, errors: [{ field: "step", message: "Invalid step number" }] }
    }

    const result = schema.parse(data)
    const validationResult = { success: true, errors: [], data: result }

    if (useCache) {
      validationCache.set(cacheKey, validationResult)
    }

    return validationResult
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        })
      })
    } else {
      errors.push({
        field: "unknown",
        message: "An unexpected validation error occurred",
      })
    }

    const validationResult = { success: false, errors }

    if (useCache) {
      validationCache.set(cacheKey, validationResult)
    }

    return validationResult
  }
}

export function validateCompleteForm(data: any): ValidationResult {
  const errors: ValidationError[] = []

  try {
    const result = completeOnboardingSchema.parse(data)
    return { success: true, errors: [], data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        })
      })
    }

    return { success: false, errors }
  }
}

// Debounced validation for real-time feedback
export function createDebouncedValidator(delay = 300) {
  let timeoutId: NodeJS.Timeout

  return function debouncedValidate(step: number, data: any, callback: (result: ValidationResult) => void) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      const result = validateStep(step, data, false) // Don't use cache for real-time validation
      callback(result)
    }, delay)
  }
}

// Clear validation cache (useful for memory management)
export function clearValidationCache() {
  validationCache.clear()
}

// Sanitize data before validation
export function sanitizeFormData(data: any): any {
  const sanitized = { ...data }

  // Trim string fields
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key].trim()
    }
  })

  // Clean arrays
  if (Array.isArray(sanitized.interests)) {
    sanitized.interests = sanitized.interests.filter(Boolean).map((item: string) => item.trim())
  }
  if (Array.isArray(sanitized.preferredLanguages)) {
    sanitized.preferredLanguages = sanitized.preferredLanguages.filter(Boolean).map((item: string) => item.trim())
  }
  if (Array.isArray(sanitized.skillsOffered)) {
    sanitized.skillsOffered = sanitized.skillsOffered
      .filter(Boolean)
      .map((item: any) => (typeof item === "string" ? item.trim() : item.name?.trim() || ""))
  }
  if (Array.isArray(sanitized.learningGoals)) {
    sanitized.learningGoals = sanitized.learningGoals
      .filter(Boolean)
      .map((item: any) => (typeof item === "string" ? item.trim() : item.name?.trim() || ""))
  }

  // Clean social links
  if (sanitized.socialLinks && typeof sanitized.socialLinks === "object") {
    const cleanedLinks: Record<string, string> = {}
    Object.entries(sanitized.socialLinks).forEach(([key, value]) => {
      if (value && typeof value === "string" && value.trim()) {
        cleanedLinks[key.trim()] = value.trim()
      }
    })
    sanitized.socialLinks = Object.keys(cleanedLinks).length > 0 ? cleanedLinks : null
  }

  return sanitized
}
