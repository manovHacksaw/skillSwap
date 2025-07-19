"use client"

import { useState, useCallback } from "react"
import { validateStep, type ValidationError } from "@/lib/validation"
import { toast } from "sonner"

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const validateStepData = useCallback((step: number, data: any): boolean => {
    setIsValidating(true)
    const validationErrors = validateStep(step, data)
    setErrors(validationErrors)
    setIsValidating(false)

    if (validationErrors.length > 0) {
      // Show first error as toast
      toast.error(validationErrors[0].message)
      return false
    }

    return true
  }, [])

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      const error = errors.find((err) => err.field === fieldName)
      return error?.message
    },
    [errors],
  )

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  return {
    errors,
    isValidating,
    validateStepData,
    getFieldError,
    clearErrors,
  }
}
