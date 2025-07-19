"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"
import type { StepProps } from "@/types/onboarding"

const timingOptions = [
  "Early mornings (6-9 AM)",
  "Mornings (9 AM-12 PM)",
  "Afternoons (12-5 PM)",
  "Evenings (5-8 PM)",
  "Late evenings (8-11 PM)",
  "Weekends",
  "Flexible/Anytime",
]

const intentOptions = [
  "I want to teach others",
  "I want to learn new skills",
  "I want to meet new people",
  "I'm curious about Web3",
  "Career advancement",
  "Personal growth",
  "Build my reputation",
  "Earn certificates",
  "Network with professionals",
  "Share my expertise",
]

export default function PreferencesStep({ formData, setFormData, onNext, onPrev }: StepProps) {
  const toggleTiming = (timing: string) => {
    const timings = formData.userAvailability.includes(timing)
      ? formData.userAvailability.filter((t) => t !== timing)
      : [...formData.userAvailability, timing]

    setFormData((prev) => ({ ...prev, userAvailability: timings }))
  }

  const toggleIntent = (intent: string) => {
    const intents = formData.userIntent.includes(intent)
      ? formData.userIntent.filter((i) => i !== intent)
      : [...formData.userIntent, intent]

    setFormData((prev) => ({ ...prev, userIntent: intents }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">Your Preferences</h2>
        <p className="text-gray-600 font-medium">When are you available and what are your goals?</p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="text-black font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              When would you generally be available?
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timingOptions.map((timing) => (
                <div key={timing} className="flex items-center space-x-3">
                  <Checkbox
                    id={timing}
                    checked={formData.userAvailability.includes(timing)}
                    onCheckedChange={() => toggleTiming(timing)}
                    className="border-2 border-black"
                  />
                  <Label htmlFor={timing} className="text-black font-medium cursor-pointer">
                    {timing}
                  </Label>
                </div>
              ))}
            </div>
            {formData.userAvailability.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <h3 className="font-bold text-black mb-2">Your Availability:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.userAvailability.map((timing) => (
                    <Badge key={timing} className="bg-purple-100 text-purple-700">
                      {timing}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-black font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              What brings you to SkillSwap?
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intentOptions.map((intent) => (
                <div key={intent} className="flex items-center space-x-3">
                  <Checkbox
                    id={intent}
                    checked={formData.userIntent.includes(intent)}
                    onCheckedChange={() => toggleIntent(intent)}
                    className="border-2 border-black"
                  />
                  <Label htmlFor={intent} className="text-black font-medium cursor-pointer">
                    {intent}
                  </Label>
                </div>
              ))}
            </div>
            {formData.userIntent.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="font-bold text-black mb-2">Your Goals:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.userIntent.map((intent) => (
                    <Badge key={intent} className="bg-blue-100 text-blue-700">
                      {intent}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button onClick={onPrev} variant="outline" className="border-2 border-gray-300 bg-transparent">
              Back
            </Button>
            <Button onClick={onNext} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
