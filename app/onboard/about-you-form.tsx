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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { aboutYouSchema } from "@/lib/onboarding-validation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { X, Plus, Loader2 } from "lucide-react";

const occupationOptions = [
  "Software Engineer",
  "Designer",
  "Product Manager",
  "Data Scientist",
  "Marketing Specialist",
  "Teacher",
  "Student",
  "Entrepreneur",
  "Consultant",
  "Freelancer",
  "Artist",
  "Writer",
  "Other",
];

const ageGroups = [
  "Under 18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

export function AboutYouForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { toast } = useToast();

  const isCustomOccupation =
    data.occupation && !occupationOptions.includes(data.occupation);

  const [formData, setFormData] = useState({
    // FIX: The dropdown now controls this value. If the saved occupation is custom,
    // this should be set to "Other".
    occupation: isCustomOccupation ? "Other" : data.occupation || "",
    ageGroup: data.ageGroup || "",
    hobbies: data.hobbies || [],
  });

  // FIX: New state to separately manage the custom occupation text.
  const [customOccupation, setCustomOccupation] = useState(
    isCustomOccupation ? data.occupation : "",
  );
  const [newHobby, setNewHobby] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIX: Create a helper function to get the data that should be validated.
  // This combines the dropdown value and the custom occupation text.
  const getEffectiveData = () => {
    return {
      ...formData,
      occupation:
        formData.occupation === "Other"
          ? customOccupation
          : formData.occupation,
    };
  };

  useEffect(() => {
    const validateForm = () => {
      // FIX: Validate the effective data, not the raw form state.
      const effectiveData = getEffectiveData();
      try {
        aboutYouSchema.parse(effectiveData);
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
    // FIX: Add customOccupation to the dependency array.
  }, [formData, customOccupation]);

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const removeHobby = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h !== hobby),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // FIX: Get the final, combined data for validation and submission.
      const effectiveData = getEffectiveData();
      const validatedData = aboutYouSchema.parse(effectiveData);
      updateData(validatedData);

      toast({
        title: "Success",
        description: "Your information has been saved successfully!",
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
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-card-foreground">
          Tell us about yourself
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {"Help us understand your background and interests better"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="occupation">
            What do you do? <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.occupation}
            onValueChange={(value) => {
              // FIX: When "Other" is selected, clear the custom occupation to ensure
              // the user types a new one.
              if (value === "Other") {
                setCustomOccupation("");
              }
              setFormData((prev) => ({ ...prev, occupation: value }));
            }}
          >
            <SelectTrigger
              className={cn(
                "transition-colors",
                errors.occupation &&
                  "border-destructive focus:ring-destructive",
              )}
            >
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
          {/* FIX: This condition is now stable and won't change when typing. */}
          {formData.occupation === "Other" && (
            <Input
              placeholder="Please specify your occupation"
              // FIX: The input now controls the separate customOccupation state.
              value={customOccupation}
              onChange={(e) => setCustomOccupation(e.target.value)}
              className="mt-2"
            />
          )}
          {errors.occupation && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              {errors.occupation}
            </p>
          )}
        </div>

        {/* ... (rest of the form is unchanged) ... */}
        
        <div className="space-y-2">
          <Label htmlFor="ageGroup">
            Age Group <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.ageGroup}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, ageGroup: value }))
            }
          >
            <SelectTrigger
              className={cn(
                "transition-colors",
                errors.ageGroup && "border-destructive focus:ring-destructive",
              )}
            >
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
          {errors.ageGroup && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              {errors.ageGroup}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Hobbies & Non-Tech Interests</Label>
          <p className="text-sm text-muted-foreground">
            {
              "What do you enjoy doing outside of work? (e.g., cooking, photography, hiking)"
            }
          </p>
          <div className="flex gap-2">
            <Input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Add a hobby or interest"
              onKeyPress={(e) => e.key === "Enter" && addHobby()}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addHobby}
              size="sm"
              disabled={!newHobby.trim()}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {formData.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary" className="gap-1 text-xs">
                {hobby}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeHobby(hobby)}
                />
              </Badge>
            ))}
            {formData.hobbies.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No hobbies added yet
              </p>
            )}
          </div>
          {errors.hobbies && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              {errors.hobbies}
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