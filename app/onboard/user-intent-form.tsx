"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { userIntentSchema } from "@/lib/onboarding-validation"
import { GraduationCap, Users, Lightbulb, Wallet, MoreHorizontal } from "lucide-react"

const intentOptions = [
  {
    id: "teach",
    label: "Teach",
    description: "Share my knowledge and help others learn",
    icon: GraduationCap,
  },
  {
    id: "learn",
    label: "Learn new things",
    description: "Acquire new skills and expand my knowledge",
    icon: Lightbulb,
  },
  {
    id: "network",
    label: "Meet people",
    description: "Connect with like-minded individuals",
    icon: Users,
  },
  {
    id: "web3",
    label: "Explore Web3",
    description: "Discover blockchain and decentralized technologies",
    icon: Wallet,
  },
  {
    id: "other",
    label: "Other",
    description: "I have different goals in mind",
    icon: MoreHorizontal,
  },
]

export function UserIntentForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()

  const [userIntent, setUserIntent] = useState(data.userIntent || [])
  const [otherIntent, setOtherIntent] = useState(data.otherIntent || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleIntentChange = (intentId: string, checked: boolean) => {
    if (checked) {
      setUserIntent((prev) => [...prev, intentId])
    } else {
      setUserIntent((prev) => prev.filter((id) => id !== intentId))
    }
  }

  const handleSubmit = () => {
    try {
      userIntentSchema.parse({ userIntent })
      updateData({ userIntent, otherIntent })
      nextStep()
    } catch (error) {
      if (error instanceof Error) {
        const zodError = JSON.parse(error.message)
        const newErrors: Record<string, string> = {}
        zodError.forEach((err: any) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Why are you here?</CardTitle>
        <CardDescription>{"Help us understand your goals so we can personalize your experience"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select all that apply:</Label>
          <div className="grid grid-cols-1 gap-4">
            {intentOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <Checkbox
                  id={option.id}
                  checked={userIntent.includes(option.id)}
                  onCheckedChange={(checked) => handleIntentChange(option.id, checked as boolean)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4 text-primary" />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          {userIntent.includes("other") && (
            <div className="space-y-2">
              <Label htmlFor="otherIntent">Please specify:</Label>
              <Input
                id="otherIntent"
                value={otherIntent}
                onChange={(e) => setOtherIntent(e.target.value)}
                placeholder="Tell us about your specific goals..."
              />
            </div>
          )}

          {errors.userIntent && <p className="text-sm text-destructive">{errors.userIntent}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  )
}
