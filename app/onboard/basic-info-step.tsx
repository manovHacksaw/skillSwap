"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { StepProps } from "@/types/onboarding"
import { useState } from "react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField, ValidatedInput, ValidatedTextarea } from "@/components/ui/form-field"

const majorInterests = [
  "Technology",
  "Design",
  "Business",
  "Creative Arts",
  "Science",
  "Health & Fitness",
  "Food & Cooking",
  "Sports",
]

const socialPlatforms = [
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/yourprofile" },
  { key: "github", label: "GitHub", placeholder: "github.com/yourusername" },
  { key: "twitter", label: "Twitter/X", placeholder: "twitter.com/yourhandle" },
]

export default function BasicInfoStep({ formData, setFormData, onNext }: StepProps) {
  const [manualInterest, setManualInterest] = useState("")
  const [manualSocialName, setManualSocialName] = useState("")
  const [manualSocialLink, setManualSocialLink] = useState("")
  const { validateStepData, getFieldError } = useFormValidation()

  const toggleInterest = (interest: string) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest]

    setFormData((prev) => ({ ...prev, interests }))
  }

  const addManualInterest = () => {
    const trimmedInterest = manualInterest.trim()
    if (trimmedInterest && !formData.interests.includes(trimmedInterest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest],
      }))
      setManualInterest("")
    } else if (formData.interests.includes(trimmedInterest)) {
      toast.info("This interest has already been added.")
    }
  }

  const updateSocialLink = (platform: string, value: string) => {
    // Validate URL format if value is not empty
    if (value && !value.match(/^https?:\/\/.+/)) {
      value = `https://${value}`
    }

    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const addManualSocialLink = () => {
    const trimmedName = manualSocialName.trim()
    let trimmedLink = manualSocialLink.trim()

    if (trimmedName && trimmedLink) {
      // Add https:// if not present
      if (!trimmedLink.match(/^https?:\/\/.+/)) {
        trimmedLink = `https://${trimmedLink}`
      }

      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [trimmedName.toLowerCase().replace(/\s/g, "")]: trimmedLink,
        },
      }))
      setManualSocialName("")
      setManualSocialLink("")
    } else {
      toast.error("Please enter both a name and a link for your custom social.")
    }
  }

  const handleNext = () => {
    const isValid = validateStepData(1, {
      displayName: formData.displayName,
      username: formData.username,
      bio: formData.bio,
      interests: formData.interests,
      socialLinks: formData.socialLinks,
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
        <h2 className="text-3xl font-black text-black">Let's set up your SkillSwap identity</h2>
        <p className="text-gray-600 font-medium">Tell us about yourself</p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="What's your name?" required error={getFieldError("displayName")}>
              <ValidatedInput
                placeholder="How you want others to see you"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                error={getFieldError("displayName")}
                required
              />
            </FormField>

            <FormField label="Pick a username/handle" error={getFieldError("username")}>
              <ValidatedInput
                placeholder="@yourhandle"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                error={getFieldError("username")}
              />
            </FormField>
          </div>

          <FormField label="Bio" error={getFieldError("bio")}>
            <ValidatedTextarea
              placeholder="What makes you unique? What are you passionate about?"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className="min-h-[100px]"
              error={getFieldError("bio")}
            />
          </FormField>

          <FormField label="What are your interests?" required error={getFieldError("interests")}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {majorInterests.map((interest) => (
                <Button
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterest(interest)}
                  className={`text-left ${
                    formData.interests.includes(interest)
                      ? "bg-blue-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {interest}
                </Button>
              ))}
            </div>

            {/* Display manually added interests */}
            {formData.interests
              .filter((interest) => !majorInterests.includes(interest))
              .map((interest) => (
                <Button
                  key={interest}
                  variant="default"
                  size="sm"
                  onClick={() => toggleInterest(interest)}
                  className="bg-blue-400 text-white border-2 border-black text-left mr-2 mb-2"
                >
                  {interest} (Custom)
                </Button>
              ))}

            {/* Manual Interest Input */}
            <div className="flex gap-2 mt-4">
              <ValidatedInput
                placeholder="Add your own interest"
                value={manualInterest}
                onChange={(e) => setManualInterest(e.target.value)}
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addManualInterest()
                  }
                }}
              />
              <Button onClick={addManualInterest} className="bg-gray-200 hover:bg-gray-300 text-black font-bold">
                Add
              </Button>
            </div>
          </FormField>

          <FormField label="Add your socials (optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.map((platform) => (
                <div key={platform.key} className="space-y-1">
                  <label className="text-sm text-gray-600">{platform.label}</label>
                  <ValidatedInput
                    placeholder={platform.placeholder}
                    value={formData.socialLinks[platform.key as keyof typeof formData.socialLinks] || ""}
                    onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                  />
                </div>
              ))}

              {/* Display manually added social links */}
              {Object.entries(formData.socialLinks).map(([key, value]) => {
                if (!socialPlatforms.some((platform) => platform.key === key)) {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-sm text-gray-600">
                        {key.charAt(0).toUpperCase() + key.slice(1)} (Custom)
                      </label>
                      <ValidatedInput value={value} onChange={(e) => updateSocialLink(key, e.target.value)} />
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Manual Social Link Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              <ValidatedInput
                placeholder="Custom Social Name (e.g., Behance)"
                value={manualSocialName}
                onChange={(e) => setManualSocialName(e.target.value)}
              />
              <div className="flex gap-2">
                <ValidatedInput
                  placeholder="Link (e.g., behance.net/yourprofile)"
                  value={manualSocialLink}
                  onChange={(e) => setManualSocialLink(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addManualSocialLink()
                    }
                  }}
                />
                <Button onClick={addManualSocialLink} className="bg-gray-200 hover:bg-gray-300 text-black font-bold">
                  Add
                </Button>
              </div>
            </div>
          </FormField>

          <div className="flex justify-end">
            <Button onClick={handleNext} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
