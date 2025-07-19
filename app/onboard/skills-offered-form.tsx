"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { skillsOfferedSchema } from "@/lib/onboarding-validation"
import { X, Plus, Star } from "lucide-react"

const skillSuggestions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "HTML/CSS",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Content Writing",
  "Photography",
  "Video Editing",
  "Public Speaking",
  "Project Management",
  "Leadership",
  "Cooking",
  "Language Teaching",
  "Music",
  "Art",
  "Fitness Training",
]

const proficiencyLevels = [
  { value: "Beginner", label: "Beginner", description: "I can teach the basics" },
  { value: "Intermediate", label: "Intermediate", description: "I have solid experience" },
  { value: "Expert", label: "Expert", description: "I'm highly experienced" },
]

export function SkillsOfferedForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()

  const [skillsOffered, setSkillsOffered] = useState(data.skillsOffered || [])
  const [newSkill, setNewSkill] = useState("")
  const [newProficiency, setNewProficiency] = useState<"Beginner" | "Intermediate" | "Expert">("Beginner")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addSkill = () => {
    if (newSkill.trim() && !skillsOffered.some((s) => s.skill === newSkill.trim())) {
      setSkillsOffered((prev) => [
        ...prev,
        {
          skill: newSkill.trim(),
          proficiency: newProficiency,
        },
      ])
      setNewSkill("")
      setNewProficiency("Beginner")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkillsOffered((prev) => prev.filter((s) => s.skill !== skillToRemove))
  }

  const addSuggestedSkill = (skill: string) => {
    if (!skillsOffered.some((s) => s.skill === skill)) {
      setSkillsOffered((prev) => [
        ...prev,
        {
          skill,
          proficiency: "Beginner",
        },
      ])
    }
  }

  const updateSkillProficiency = (skill: string, proficiency: "Beginner" | "Intermediate" | "Expert") => {
    setSkillsOffered((prev) => prev.map((s) => (s.skill === skill ? { ...s, proficiency } : s)))
  }

  const handleSubmit = () => {
    try {
      skillsOfferedSchema.parse({ skillsOffered })
      updateData({ skillsOffered })
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

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Expert":
        return "text-green-600 bg-green-50"
      case "Intermediate":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-orange-600 bg-orange-50"
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>What skills can you teach others?</CardTitle>
        <CardDescription>{"Share your expertise! Include both technical and non-technical skills."}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill you can teach"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
            </div>
            <Select
              value={newProficiency}
              onValueChange={(value: "Beginner" | "Intermediate" | "Expert") => setNewProficiency(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      {level.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {skillsOffered.length > 0 && (
            <div className="space-y-3">
              <Label>Your Skills</Label>
              {skillsOffered.map((skill) => (
                <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge className={getProficiencyColor(skill.proficiency)}>{skill.proficiency}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={skill.proficiency}
                      onValueChange={(value: "Beginner" | "Intermediate" | "Expert") =>
                        updateSkillProficiency(skill.skill, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.skill)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label>Popular Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions
                .filter((skill) => !skillsOffered.some((s) => s.skill === skill))
                .slice(0, 12)
                .map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestedSkill(skill)}
                    className="text-xs"
                  >
                    + {skill}
                  </Button>
                ))}
            </div>
          </div>

          {errors.skillsOffered && <p className="text-sm text-destructive">{errors.skillsOffered}</p>}
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
