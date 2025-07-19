"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { aboutYouSchema } from "@/lib/validation"
import { X, Plus } from 'lucide-react'

const occupationOptions = [
  "Software Engineer", "Designer", "Product Manager", "Data Scientist",
  "Marketing Specialist", "Teacher", "Student", "Entrepreneur",
  "Consultant", "Freelancer", "Artist", "Writer", "Other"
]

const ageGroups = [
  "Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
]

export function AboutYouForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()
  
  const [formData, setFormData] = useState({
    occupation: data.occupation || '',
    ageGroup: data.ageGroup || '',
    hobbies: data.hobbies || []
  })
  
  const [newHobby, setNewHobby] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }))
      setNewHobby('')
    }
  }

  const removeHobby = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }))
  }

  const handleSubmit = () => {
    try {
      aboutYouSchema.parse(formData)
      updateData(formData)
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
        <CardTitle>Tell us about yourself</CardTitle>
        <CardDescription>
          {"Help us understand your background and interests better"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="occupation">What do you do?</Label>
          <Select 
            value={formData.occupation} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your occupation" />
            </SelectTrigger>
            <SelectContent>
              {occupationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.occupation === 'Other' && (
            <Input
              placeholder="Please specify your occupation"
              onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
            />
          )}
          {errors.occupation && <p className="text-sm text-destructive">{errors.occupation}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageGroup">Age Group</Label>
          <Select 
            value={formData.ageGroup} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your age group" />
            </SelectTrigger>
            <SelectContent>
              {ageGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup}</p>}
        </div>

        <div className="space-y-2">
          <Label>Hobbies & Non-Tech Interests</Label>
          <p className="text-sm text-muted-foreground">
            {"What do you enjoy doing outside of work? (e.g., cooking, photography, hiking)"}
          </p>
          <div className="flex gap-2">
            <Input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Add a hobby or interest"
              onKeyPress={(e) => e.key === 'Enter' && addHobby()}
            />
            <Button type="button" onClick={addHobby} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary" className="gap-1">
                {hobby}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeHobby(hobby)}
                />
              </Badge>
            ))}
          </div>
          {errors.hobbies && <p className="text-sm text-destructive">{errors.hobbies}</p>}
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
