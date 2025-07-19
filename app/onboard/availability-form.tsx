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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { preferencesSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Clock, Calendar, X, Loader2 } from "lucide-react";

const availabilityOptions = [
  {
    id: "weekday-morning",
    label: "Weekday Mornings",
    description: "Monday - Friday, 6AM - 12PM",
    icon: "🌅",
  },
  {
    id: "weekday-afternoon",
    label: "Weekday Afternoons",
    description: "Monday - Friday, 12PM - 6PM",
    icon: "☀️",
  },
  {
    id: "weekday-evening",
    label: "Weekday Evenings",
    description: "Monday - Friday, 6PM - 11PM",
    icon: "🌆",
  },
  {
    id: "weekend-morning",
    label: "Weekend Mornings",
    description: "Saturday - Sunday, 6AM - 12PM",
    icon: "🌄",
  },
  {
    id: "weekend-afternoon",
    label: "Weekend Afternoons",
    description: "Saturday - Sunday, 12PM - 6PM",
    icon: "🌞",
  },
  {
    id: "weekend-evening",
    label: "Weekend Evenings",
    description: "Saturday - Sunday, 6PM - 11PM",
    icon: "🌃",
  },
  {
    id: "flexible",
    label: "Flexible Schedule",
    description: "I can adapt to different time slots",
    icon: "🔄",
  },
];

export function AvailabilityForm() {
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const { toast } = useToast();

  const [userAvailability, setUserAvailability] = useState(
    data.userAvailability || [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time form validation
  useEffect(() => {
    const validateForm = () => {
      try {
        preferencesSchema.parse({
          userAvailability,
          userIntent: data.userIntent || [],
        });
        setIsFormValid(true);
        setErrors({});
      } catch (error: any) {
        setIsFormValid(userAvailability.length > 0); // At least one availability selected
        if (error.errors) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            if (err.path[0] === "userAvailability") {
              newErrors[err.path[0]] = err.message;
            }
          });
          setErrors(newErrors);
        }
      }
    };

    validateForm();
  }, [userAvailability, data.userIntent]);

  const handleAvailabilityChange = (
    availabilityId: string,
    checked: boolean,
  ) => {
    if (checked) {
      setUserAvailability((prev) => [...prev, availabilityId]);
    } else {
      setUserAvailability((prev) => prev.filter((id) => id !== availabilityId));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (userAvailability.length === 0) {
        throw new Error("Please select at least one availability option");
      }

      updateData({ userAvailability });

      toast({
        title: "Success",
        description: "Your availability has been saved successfully!",
      });

      nextStep();
    } catch (error: any) {
      setErrors({
        userAvailability:
          error.message || "Please select at least one availability option",
      });

      toast({
        title: "Validation Error",
        description:
          "Please select at least one availability option to continue.",
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
          <Clock className="h-5 w-5" />
          When are you generally available?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {
            "Help us match you with people in compatible time zones and schedules"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>
            Select all time slots that work for you:{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {availabilityOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                  userAvailability.includes(option.id)
                    ? "bg-accent border-primary/50"
                    : "bg-background hover:bg-muted/20",
                )}
              >
                <Checkbox
                  id={option.id}
                  checked={userAvailability.includes(option.id)}
                  onCheckedChange={(checked) =>
                    handleAvailabilityChange(option.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none cursor-pointer"
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

          {errors.userAvailability && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              {errors.userAvailability}
            </p>
          )}

          {userAvailability.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              Please select at least one availability option to continue.
            </p>
          )}

          {userAvailability.length > 0 && (
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ✓ {userAvailability.length} time slot
                {userAvailability.length > 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                {"Don't worry about being too specific!"}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {
                  "You can always adjust your availability later and coordinate specific times when booking sessions."
                }
              </p>
            </div>
          </div>
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
