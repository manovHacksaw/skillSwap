"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { basicInfoSchema } from "@/lib/validation"
import { X, Plus, Github, Linkedin, Twitter } from "lucide-react"

export function BasicInfoForm() {
  const { user } = useUser()
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()

  const [formData, setFormData] = useState({
    name: data.name || user?.fullName || "",
    username: data.username || "",
    bio: data.bio || "",
    interests: data.interests || [],
    socialLinks: data.socialLinks || {},
  })

  const [newInterest, setNewInterest] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username !== data.username) {
        console.log("checking username:", formData.username)
        setIsCheckingUsername(true)
        try {
          const response = await fetch("/api/user/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: formData.username }),
          })
          const result = await response.json()
          if (!result.isUnique) {
            setErrors((prev) => ({ ...prev, username: "Username is already taken" }))
          } else {
            setErrors((prev) => ({ ...prev, username: "" }))
          }
        } catch (error) {
          console.error("Username check failed:", error)
        }
        setIsCheckingUsername(false)
      }
    }

    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [formData.username, data.username])

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const handleSubmit = () => {
    try {
      basicInfoSchema.parse(formData)
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
        <CardTitle>{"Let's set up your SkillSwap identity"}</CardTitle>
        <CardDescription>{"Mind sharing a few quick things about yourself?"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="unique_username"
            />
            {isCheckingUsername && <p className="text-sm text-muted-foreground">Checking availability...</p>}
            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself, your background, and what makes you unique..."
            rows={4}
          />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
        </div>

        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest"
              onKeyPress={(e) => e.key === "Enter" && addInterest()}
            />
            <Button type="button" onClick={addInterest} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
              </Badge>
            ))}
          </div>
          {errors.interests && <p className="text-sm text-destructive">{errors.interests}</p>}
        </div>

        <div className="space-y-4">
          <Label>Social Links (Optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <Label htmlFor="github">GitHub</Label>
              </div>
              <Input
                id="github"
                value={formData.socialLinks.github || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, github: e.target.value },
                  }))
                }
                placeholder="github.com/username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <Label htmlFor="linkedin">LinkedIn</Label>
              </div>
              <Input
                id="linkedin"
                value={formData.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                  }))
                }
                placeholder="linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <Label htmlFor="twitter">Twitter/X</Label>
              </div>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                  }))
                }
                placeholder="@username"
              />
            </div>
          </div>
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
