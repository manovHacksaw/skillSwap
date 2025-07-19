import type React from "react"
export interface FormData {
  // Basic Info
  displayName: string
  username: string
  bio: string
  avatarUrl?: string

  // Interests & Social
  interests: string[]
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    website?: string
    instagram?: string
  }

  // Personal Details
  occupation: string
  location: string
  timezone: string
  age: number
  preferredLanguages: string[]

  // Skills & Learning
  skillsOffered: Array<{ name: string; category: string; proficiency: string }>
  learningGoals: Array<{ name: string; category: string; priority: string }>
  userIntent: string[]

  // Availability
  userAvailability: string[]

  // Wallet
  walletAddress: string
  walletSignature: string
}

export interface StepProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  onNext: () => void
  onPrev: () => void
}
