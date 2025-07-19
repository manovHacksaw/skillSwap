"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { basicInfoStepSchema } from "@/lib/validation-schema";
import { X, Plus, Github, Linkedin, Twitter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function BasicInfoForm() {
  const { user } = useUser();
  const { userId } = useAuth();
  const { toast } = useToast();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();

  const [formData, setFormData] = useState({
    displayName: data.name || user?.fullName || "",
    username: data.username || "",
    bio: data.bio || "",
    interests: data.interests || [],
    socialLinks: data.socialLinks || {},
  });

  const [newInterest, setNewInterest] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  // Pre-fill user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setIsLoadingUserData(true);
        const response = await fetch("/api/user");
        const result = await response.json();

        if (response.ok && result.user) {
          setFormData((prev) => ({
            ...prev,
            displayName: result.user.name || user?.fullName || "",
            username: result.user.username || "",
            bio: result.user.bio || "",
            interests: result.user.interests || [],
            socialLinks: result.user.socialLinks || {},
          }));

          updateData({
            name: result.user.name || user?.fullName || "",
            username: result.user.username || "",
            bio: result.user.bio || "",
            interests: result.user.interests || [],
            socialLinks: result.user.socialLinks || {},
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [userId, user, updateData, toast]);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username.length < 3) {
        setErrors((prev) => ({ ...prev, username: "" }));
        return;
      }

      if (formData.username !== data.username) {
        setIsCheckingUsername(true);
        try {
          const response = await fetch("/api/user/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: formData.username }),
          });
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to check username");
          }

          if (!result.isUnique) {
            setErrors((prev) => ({
              ...prev,
              username: "Username is already taken",
            }));
          } else {
            setErrors((prev) => ({ ...prev, username: "" }));
          }
        } catch (error) {
          console.error("Username check failed:", error);
          setErrors((prev) => ({
            ...prev,
            username: "Unable to verify username. Please try again.",
          }));
        }
        setIsCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username, data.username]);

  // Validate form in real-time
  useEffect(() => {
    const validateForm = () => {
      try {
        basicInfoStepSchema.parse(formData);
        const hasUsernameErrors = errors.username && errors.username.length > 0;
        setIsFormValid(!hasUsernameErrors && !isCheckingUsername);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    validateForm();
  }, [formData, errors.username, isCheckingUsername]);

  const addInterest = () => {
    if (
      newInterest.trim() &&
      !formData.interests.includes(newInterest.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async () => {
    try {
      const validatedData = basicInfoStepSchema.parse(formData);

      // Update the store with the validated data
      updateData({
        name: validatedData.displayName,
        username: validatedData.username,
        bio: validatedData.bio,
        interests: validatedData.interests,
        socialLinks: validatedData.socialLinks,
      });

      nextStep();

      toast({
        title: "Success",
        description: "Basic information saved successfully!",
      });
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
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{"Let's set up your SkillSwap identity"}</CardTitle>
        <CardDescription>
          {"Mind sharing a few quick things about yourself?"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingUserData && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-muted-foreground">
              Loading your information...
            </span>
          </div>
        )}

        {!isLoadingUserData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  placeholder="Your full name"
                  className={cn(
                    "transition-colors",
                    errors.displayName &&
                      "border-destructive focus:ring-destructive",
                  )}
                  required
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.displayName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase(),
                    }))
                  }
                  placeholder="unique_username"
                  className={cn(
                    "transition-colors",
                    errors.username &&
                      "border-destructive focus:ring-destructive",
                    !errors.username &&
                      formData.username &&
                      !isCheckingUsername &&
                      "border-success",
                  )}
                  required
                />
                {isCheckingUsername && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking availability...
                  </p>
                )}
                {!isCheckingUsername &&
                  !errors.username &&
                  formData.username &&
                  formData.username.length >= 3 && (
                    <p className="text-sm text-success flex items-center gap-1">
                      ✓ Username is available
                    </p>
                  )}
                {errors.username && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.username}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Tell us about yourself, your background, and what makes you unique..."
            rows={4}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio}</p>
          )}
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
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeInterest(interest)}
                />
              </Badge>
            ))}
          </div>
          {errors.interests && (
            <p className="text-sm text-destructive">{errors.interests}</p>
          )}
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
                    socialLinks: {
                      ...prev.socialLinks,
                      github: e.target.value,
                    },
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
                    socialLinks: {
                      ...prev.socialLinks,
                      linkedin: e.target.value,
                    },
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
                    socialLinks: {
                      ...prev.socialLinks,
                      twitter: e.target.value,
                    },
                  }))
                }
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {!isLoadingUserData && (
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isLoadingUserData}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isCheckingUsername || isLoadingUserData}
              className="min-w-[100px]"
            >
              {isCheckingUsername ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
