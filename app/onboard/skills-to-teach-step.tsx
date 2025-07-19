"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input for manual skill entry
import { Lightbulb } from "lucide-react"
import { toast } from "sonner"
import type { StepProps } from "@/types/onboarding"
import { useState } from "react" // Import useState for managing manual skill input

const coreSkills = [
  { name: "Programming", category: "Tech" },
  { name: "Design", category: "Creative" },
  { name: "Marketing", category: "Business" },
  { name: "Writing", category: "Communication" },
  { name: "Data Analysis", category: "Tech" },
  { name: "Project Management", category: "Business" },
]

export default function SkillsToTeachStep({ formData, setFormData, onNext, onPrev }: StepProps) {
  const [manualSkillName, setManualSkillName] = useState("")
  const [manualSkillCategory, setManualSkillCategory] = useState("")

  const addSkill = (skillName: string, category: string) => {
    const exists = formData.skillsOffered.some((skill) => skill.name === skillName)
    if (exists) {
      toast.info(`${skillName} is already in your teaching skills`)
      return
    }

    setFormData((prev) => ({
      ...prev,
      skillsOffered: [
        ...prev.skillsOffered,
        {
          name: skillName,
          category,
          proficiency: "Intermediate", // Default proficiency
        },
      ],
    }))
  }

  const addManualSkill = () => {
    const trimmedName = manualSkillName.trim()
    const trimmedCategory = manualSkillCategory.trim()

    if (trimmedName && trimmedCategory) {
      addSkill(trimmedName, trimmedCategory)
      setManualSkillName("")
      setManualSkillCategory("")
    } else {
      toast.error("Please enter both a skill name and category.")
    }
  }

  const removeSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((skill) => skill.name !== skillName),
    }))
  }

  const updateSkillProficiency = (skillName: string, proficiency: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.map((skill) => (skill.name === skillName ? { ...skill, proficiency } : skill)),
    }))
  }

  const handleNext = () => {
    if (formData.skillsOffered.length === 0) {
      toast.error("Please select at least one skill you can teach")
      return
    }
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">What skills could you share with the world?</h2>
        <p className="text-gray-600 font-medium">Select at least one skill you can teach others</p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Popular Skills */}
          <div className="space-y-4">
            <Label className="text-black font-bold">Popular Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {coreSkills.map((skill) => (
                <Button
                  key={skill.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill.name, skill.category)}
                  className="justify-start text-left h-auto p-3 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 font-medium"
                  disabled={formData.skillsOffered.some((s) => s.name === skill.name)}
                >
                  <div>
                    <div className="font-bold text-black text-xs">{skill.name}</div>
                    <div className="text-xs text-gray-500">{skill.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Manually Add Skill */}
          <div className="space-y-4">
            <Label className="text-black font-bold">Add Your Own Skill</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Skill Name (e.g., Chess, Public Speaking)"
                value={manualSkillName}
                onChange={(e) => setManualSkillName(e.target.value)}
                className="border-2 border-gray-300 rounded-lg font-medium"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Category (e.g., Hobby, Communication)"
                  value={manualSkillCategory}
                  onChange={(e) => setManualSkillCategory(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg font-medium flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addManualSkill();
                    }
                  }}
                />
                <Button onClick={addManualSkill} className="bg-gray-200 hover:bg-gray-300 text-black font-bold">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Selected Teaching Skills */}
          {formData.skillsOffered.length > 0 && (
            <div className="space-y-4">
              <Label className="text-black font-bold">Your Teaching Skills</Label>
              <div className="space-y-3">
                {formData.skillsOffered.map((skill) => (
                  <div key={skill.name} className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-black">{skill.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Proficiency Level</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Expert"].map((level) => (
                          <Button
                            key={level}
                            variant={skill.proficiency === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSkillProficiency(skill.name, level)}
                            className={`text-xs ${
                              skill.proficiency === level
                                ? "bg-green-600 text-white"
                                : "border-green-300 hover:border-green-500"
                            }`}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.skillsOffered.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select or add skills you can teach to continue</p>
            </div>
          )}

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