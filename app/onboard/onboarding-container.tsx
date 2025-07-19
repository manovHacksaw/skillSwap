"use client"

import { useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { Progress } from "@/components/ui/progress"
import { WelcomeScreen } from "./welcome-screen"
import { BasicInfoForm } from "./basic-info-form"
import { AboutYouForm } from "./about-you-form"
import { SkillsOfferedForm } from "./skills-offered-form"
import { UserIntentForm } from "./user-intent-form"
import { SkillsWantedForm } from "./skills-wanted-form"
import { AvailabilityForm } from "./availability-form"
import { WalletConnectForm } from "./wallet-connect-form"

const steps = [
  { component: WelcomeScreen, title: "Welcome" },
  { component: BasicInfoForm, title: "Basic Info" },
  { component: AboutYouForm, title: "About You" },
  { component: SkillsOfferedForm, title: "Skills Offered" },
  { component: UserIntentForm, title: "Your Intent" },
  { component: SkillsWantedForm, title: "Learning Goals" },
  { component: AvailabilityForm, title: "Availability" },
  { component: WalletConnectForm, title: "Wallet Connect" },
]

export function OnboardingContainer() {
  const { userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { currentStep, updateData, resetOnboarding } = useOnboardingStore()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!userId) return

      try {
        const response = await fetch("/api/user")
        const data = await response.json()

        if (data.user?.hasOnboarded) {
          router.push("/dashboard")
          return
        }

        // Pre-fill user data from Clerk
        if (user) {
          updateData({
            name: user.fullName || "",
          })
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }

    checkOnboardingStatus()
  }, [userId, user, router, updateData])

  // Listen for successful onboarding completion
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "onboarding-complete") {
        resetOnboarding()
        router.push("/dashboard")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router, resetOnboarding])

  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <span className="text-sm font-medium text-muted-foreground">{steps[currentStep].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <CurrentStepComponent />
      </div>
    </div>
  )
}
