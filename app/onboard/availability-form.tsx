"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { availabilitySchema } from "@/lib/onboarding-validation"
import { Clock, Calendar } from 'lucide-react'

const availabilityOptions = [
  {
    id: 'weekday-morning',
    label: 'Weekday Mornings',
    description: 'Monday - Friday, 6AM - 12PM',
    icon: '🌅'
  },
  {
    id: 'weekday-afternoon',
    label: 'Weekday Afternoons',
    description: 'Monday - Friday, 12PM - 6PM',
    icon: '☀️'
  },
  {
    id: 'weekday-evening',
    label: 'Weekday Evenings',
    description: 'Monday - Friday, 6PM - 11PM',
    icon: '🌆'
  },
  {
    id: 'weekend-morning',
    label: 'Weekend Mornings',
    description: 'Saturday - Sunday, 6AM - 12PM',
    icon: '🌄'
  },
  {
    id: 'weekend-afternoon',
    label: 'Weekend Afternoons',
    description: 'Saturday - Sunday, 12PM - 6PM',
    icon: '🌞'
  },
  {
    id: 'weekend-evening',
    label: 'Weekend Evenings',
    description: 'Saturday - Sunday, 6PM - 11PM',
    icon: '🌃'
  },
  {
    id: 'flexible',
    label: 'Flexible Schedule',
    description: 'I can adapt to different time slots',
    icon: '🔄'
  }
]

export function AvailabilityForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()
  
  const [userAvailability, setUserAvailability] = useState(data.userAvailability || [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAvailabilityChange = (availabilityId: string, checked: boolean) => {
    if (checked) {
      setUserAvailability(prev => [...prev, availabilityId])
    } else {
      setUserAvailability(prev => prev.filter(id => id !== availabilityId))
    }
  }

  const handleSubmit = () => {
    try {
      availabilitySchema.parse({ userAvailability })
      updateData({ userAvailability })
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
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          When are you generally available?
        </CardTitle>
        <CardDescription>
          {"Help us match you with people in compatible time zones and schedules"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select all time slots that work for you:</Label>
          <div className="grid grid-cols-1 gap-4">
            {availabilityOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <Checkbox
                  id={option.id}
                  checked={userAvailability.includes(option.id)}
                  onCheckedChange={(checked) => handleAvailabilityChange(option.id, checked as boolean)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <Label 
                      htmlFor={option.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {errors.userAvailability && <p className="text-sm text-destructive">{errors.userAvailability}</p>}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">{"Don't worry about being too specific!"}</h4>
              <p className="text-sm text-blue-700 mt-1">
                {"You can always adjust your availability later and coordinate specific times when booking sessions."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
