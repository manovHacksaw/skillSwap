import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
  // Basic Info
  name: string
  username: string
  bio: string
  interests: string[]
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
  }
  
  // About You
  occupation: string
  ageGroup: string
  hobbies: string[]
  
  // Skills Offered
  skillsOffered: Array<{
    skill: string
    proficiency: 'Beginner' | 'Intermediate' | 'Expert'
  }>
  
  // User Intent
  userIntent: string[]
  otherIntent?: string
  
  // Skills Wanted
  learningGoals: string[]
  
  // Availability
  userAvailability: string[]
  
  // Wallet
  walletAddress?: string
  walletSignature?: string
}

interface OnboardingStore {
  currentStep: number
  data: OnboardingData
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentStep: (step: number) => void
  updateData: (data: Partial<OnboardingData>) => void
  nextStep: () => void
  prevStep: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetOnboarding: () => void
  submitOnboarding: () => Promise<boolean>
}

const initialData: OnboardingData = {
  name: '',
  username: '',
  bio: '',
  interests: [],
  socialLinks: {},
  occupation: '',
  ageGroup: '',
  hobbies: [],
  skillsOffered: [],
  userIntent: [],
  learningGoals: [],
  userAvailability: [],
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      data: initialData,
      isLoading: false,
      error: null,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
      })),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 7)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      resetOnboarding: () => set({
        currentStep: 0,
        data: initialData,
        isLoading: false,
        error: null
      }),
      
      submitOnboarding: async () => {
        const { data } = get()
        set({ isLoading: true, error: null })
        
        try {
          // Transform data to match API expectations
          const formData = {
            name: data.name,
            username: data.username,
            bio: data.bio,
            interests: data.interests,
            socialLinks: data.socialLinks,
            occupation: data.occupation,
            ageGroup: data.ageGroup,
            skillsOffered: data.skillsOffered.map(s => s.skill),
            learningGoals: data.learningGoals,
            userIntent: data.userIntent,
            userAvailability: data.userAvailability,
            walletAddress: data.walletAddress,
            preferredLanguages: ['English'], // Default
            location: '', // Can be added later
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            avatarUrl: '', // Will be filled from Clerk
          }
          
          const response = await fetch('/api/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formData })
          })
          
          if (!response.ok) {
            throw new Error('Failed to submit onboarding')
          }
          
          set({ isLoading: false })
          return true
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          })
          return false
        }
      }
    }),
    {
      name: 'skillswap-onboarding',
      partialize: (state) => ({ 
        currentStep: state.currentStep, 
        data: state.data 
      })
    }
  )
)
