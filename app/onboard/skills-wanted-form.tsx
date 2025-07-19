"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { skillsWantedSchema } from "@/lib/onboarding-validation"
import { X, Plus, Target } from "lucide-react"

const skillCategories = {
  Programming: ["JavaScript", "Python", "React", "Node.js", "TypeScript", "Go", "Rust"],
  Design: ["UI/UX Design", "Graphic Design", "Figma", "Adobe Creative Suite", "Prototyping"],
  "Data & AI": ["Data Science", "Machine Learning", "SQL", "Data Visualization", "AI/ML"],
  Business: ["Product Management", "Digital Marketing", "Sales", "Leadership", "Strategy"],
  Creative: ["Photography", "Video Editing", "Writing", "Music Production", "Art"],
  Languages: ["Spanish", "French", "German", "Japanese", "Mandarin", "Portuguese"],
  "Life Skills": ["Cooking", "Fitness", "Public Speaking", "Time Management", "Meditation"],
}

export function SkillsWantedForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore()

  const [learningGoals, setLearningGoals] = useState(data.learningGoals || [])
  const [newSkill, setNewSkill] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addSkill = (skill: string) => {
    if (skill.trim() && !learningGoals.includes(skill.trim())) {
      setLearningGoals((prev) => [...prev, skill.trim()])
    }
  }

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill)
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setLearningGoals((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = () => {
    try {
      skillsWantedSchema.parse({ learningGoals })
      updateData({ learningGoals })
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
          <Target className="h-5 w-5" />
          What do you want to learn?
        </CardTitle>
        <CardDescription>
          {"Select skills you'd like to learn or improve. We'll help match you with teachers!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill you want to learn"
              onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
            />
            <Button type="button" onClick={addCustomSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {learningGoals.length > 0 && (
            <div className="space-y-2">
              <Label>Your Learning Goals</Label>
              <div className="flex flex-wrap gap-2">
                {learningGoals.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Label>Browse by Category</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(skillCategories).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>

            {selectedCategory && (
              <div className="space-y-2">
                <Label>{selectedCategory} Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillCategories[selectedCategory as keyof typeof skillCategories]
                    .filter((skill) => !learningGoals.includes(skill))
                    .map((skill) => (
                      <Button
                        key={skill}
                        variant="ghost"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        className="text-xs border border-dashed"
                      >
                        + {skill}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {errors.learningGoals && <p className="text-sm text-destructive">{errors.learningGoals}</p>}
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
