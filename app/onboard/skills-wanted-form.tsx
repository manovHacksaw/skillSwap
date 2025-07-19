"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { skillsWantedSchema } from "@/lib/onboarding-validation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { X, Plus, Target, Loader2 } from "lucide-react";

const skillCategories = {
  Programming: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Go",
    "Rust",
  ],
  Design: [
    "UI/UX Design",
    "Graphic Design",
    "Figma",
    "Adobe Creative Suite",
    "Prototyping",
  ],
  "Data & AI": [
    "Data Science",
    "Machine Learning",
    "SQL",
    "Data Visualization",
    "AI/ML",
  ],
  Business: [
    "Product Management",
    "Digital Marketing",
    "Sales",
    "Leadership",
    "Strategy",
  ],
  Creative: [
    "Photography",
    "Video Editing",
    "Writing",
    "Music Production",
    "Art",
  ],
  Languages: [
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Mandarin",
    "Portuguese",
  ],
  "Life Skills": [
    "Cooking",
    "Fitness",
    "Public Speaking",
    "Time Management",
    "Meditation",
  ],
};

export function SkillsWantedForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { toast } = useToast();

  const [learningGoals, setLearningGoals] = useState(data.learningGoals || []);
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time form validation
  useEffect(() => {
    const validateForm = () => {
      try {
        skillsWantedSchema.parse({ learningGoals });
        setIsFormValid(true);
        setErrors({});
      } catch (error: any) {
        setIsFormValid(false);
        if (error.errors) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
        }
      }
    };

    validateForm();
  }, [learningGoals]);

  const addSkill = (skill: string) => {
    if (skill.trim() && !learningGoals.includes(skill.trim())) {
      setLearningGoals((prev) => [...prev, skill.trim()]);
    }
  };

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setLearningGoals((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      skillsWantedSchema.parse({ learningGoals });

      updateData({ learningGoals });

      toast({
        title: "Success",
        description: "Your learning goals have been saved successfully!",
      });

      nextStep();
    } catch (error: any) {
      const newErrors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }

      setErrors(newErrors);

      toast({
        title: "Validation Error",
        description: "Please add at least one skill you want to learn.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Target className="h-5 w-5" />
          What do you want to learn?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {
            "Select skills you'd like to learn or improve. We'll help match you with teachers!"
          }
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
              className={cn(
                "flex-1 transition-colors",
                errors.learningGoals &&
                  "border-destructive focus:ring-destructive",
              )}
            />
            <Button
              type="button"
              onClick={addCustomSkill}
              size="sm"
              disabled={!newSkill.trim()}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {learningGoals.length > 0 && (
            <div className="space-y-2">
              <Label>Your Learning Goals ({learningGoals.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg min-h-[3rem]">
                {learningGoals.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeSkill(skill)}
                    />
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
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? null : category,
                    )
                  }
                  className="text-xs transition-colors"
                >
                  {category}
                </Button>
              ))}
            </div>

            {selectedCategory && (
              <div className="space-y-2">
                <Label>{selectedCategory} Skills</Label>
                <div className="flex flex-wrap gap-2 p-3 border border-dashed rounded-lg">
                  {skillCategories[
                    selectedCategory as keyof typeof skillCategories
                  ]
                    .filter((skill) => !learningGoals.includes(skill))
                    .map((skill) => (
                      <Button
                        key={skill}
                        variant="ghost"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        className="text-xs border border-dashed hover:bg-accent"
                      >
                        + {skill}
                      </Button>
                    ))}
                  {skillCategories[
                    selectedCategory as keyof typeof skillCategories
                  ].filter((skill) => !learningGoals.includes(skill)).length ===
                    0 && (
                    <p className="text-sm text-muted-foreground italic">
                      All skills from this category have been added!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.learningGoals && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              {errors.learningGoals}
            </p>
          )}

          {learningGoals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              No learning goals added yet. Add at least one skill to continue.
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
