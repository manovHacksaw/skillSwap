"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Clock, Globe } from "lucide-react"
import type { StepProps } from "@/types/onboarding"
import { useState } from "react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField, Input } from "@/components/ui/form-field"
import {ValidTextarea} from "@/components/ui/form-field"

const occupationOptions = [
  "Working Professional",
  "Student",
  "Freelancer/Self Employed",
  "Entrepreneur",
  "Retired",
  "Other",
]

const languageOptions = ["English", "Spanish", "French", "German", "Hindi", "Chinese", "Japanese", "Arabic"]

const timezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
]

export default function AboutYouStep({ formData, setFormData, onNext, onPrev }: StepProps) {
  const [manualLanguage, setManualLanguage] = useState("")
  const { validateStepData, getFieldError } = useFormValidation()

  const toggleLanguage = (language: string) => {
    const languages = formData.preferredLanguages.includes(language)
      ? formData.preferredLanguages.filter((l) => l !== language)
      : [...formData.preferredLanguages, language]

    setFormData((prev) => ({ ...prev, preferredLanguages: languages }))
  }

  const addManualLanguage = () => {
    const trimmedLanguage = manualLanguage.trim()
    if (trimmedLanguage && !formData.preferredLanguages.includes(trimmedLanguage)) {
      setFormData((prev) => ({
        ...prev,
        preferredLanguages: [...prev.preferredLanguages, trimmedLanguage],
      }))
      setManualLanguage("")
    }
  }

  const handleNext = () => {
    const isValid = validateStepData(2, {
      occupation: formData.occupation,
      location: formData.location,
      timezone: formData.timezone,
      age: formData.age,
      preferredLanguages: formData.preferredLanguages,
    })

    if (isValid) {
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">About You</h2>
        <p className="text-gray-600 font-medium">Help us understand your background better</p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField label="What do you currently do?" required error={getFieldError("occupation")}>
                <div className="grid grid-cols-1 gap-2">
                  {occupationOptions.map((occupation) => (
                    <Button
                      key={occupation}
                      variant={formData.occupation === occupation ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, occupation }))}
                      className={`text-left justify-start ${
                        formData.occupation === occupation
                          ? "bg-purple-400 text-white border-2 border-black"
                          : "border-2 border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      {occupation}
                    </Button>
                  ))}
                </div>
              </FormField>
            </div>

            <div className="space-y-4">
              <FormField label="Where are you located?" error={getFieldError("location")}>
                <Input
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  error={getFieldError("location")}
                />
              </FormField>

              <FormField label="Your timezone" required error={getFieldError("timezone")}>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger
                    className={`border-2 ${getFieldError("timezone") ? "border-red-500" : "border-black"}`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Age" required error={getFieldError("age")}>
                <Input
                  type="number"
                  placeholder="Your age"
                  min="13"
                  max="120"
                  value={formData.age || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    // FIX: Set age to null if input is empty, otherwise parse it.
                    // This prevents the infinite loop.
                    setFormData((prev) => ({
                      ...prev,
                      age: value === "" ? null : Number.parseInt(value, 10),
                    }))
                  }}
                  error={getFieldError("age")}
                />
              </FormField>
            </div>
          </div>

          <FormField label="What languages do you speak?" required error={getFieldError("preferredLanguages")}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {languageOptions.map((language) => (
                <Button
                  key={language}
                  variant={formData.preferredLanguages.includes(language) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleLanguage(language)}
                  className={`text-left ${
                    formData.preferredLanguages.includes(language)
                      ? "bg-green-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-green-400"
                  }`}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language}
                </Button>
              ))}

              {formData.preferredLanguages
                .filter((lang) => !languageOptions.includes(lang))
                .map((lang) => (
                  <Button
                    key={lang}
                    variant="default"
                    size="sm"
                    onClick={() => toggleLanguage(lang)}
                    className="bg-green-400 text-white border-2 border-black text-left"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {lang} (Custom)
                  </Button>
                ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add another language"
                value={manualLanguage}
                onChange={(e) => setManualLanguage(e.target.value)}
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addManualLanguage()
                  }
                }}
              />
              <Button onClick={addManualLanguage} className="bg-gray-200 hover:bg-gray-300 text-black font-bold">
                Add
              </Button>
            </div>
          </FormField>

          <div className="flex justify-between">
            <Button onClick={onPrev} variant="outline" className="border-2 border-gray-300 bg-transparent">
              Back
            </Button>
            <Button onClick={handleNext} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}