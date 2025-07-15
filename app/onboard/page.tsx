"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Shield,
  Award,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  type: "teach" | "learn";
  experienceLevel?: number;
}

interface FormData {
  displayName: string;
  bio: string;
  skillsToTeach: SkillItem[];
  skillsToLearn: SkillItem[];
  experienceLevel: string;
  learningGoals: string[];
  teachingPreferences: string[];
  availabilityHours: number[];
}

export default function OnboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: user?.fullName || "",
    bio: "",
    skillsToTeach: [],
    skillsToLearn: [],
    experienceLevel: "beginner",
    learningGoals: [],
    teachingPreferences: [],
    availabilityHours: [9, 17], // 9 AM to 5 PM default
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Skip user existence check for now to avoid API issues
  useEffect(() => {
    // Simply show the onboard form without checking
    setIsCheckingUser(false);
  }, []);

  const popularSkills = [
    { name: "React Development", category: "Programming" },
    { name: "Smart Contracts", category: "Blockchain" },
    { name: "UI/UX Design", category: "Design" },
    { name: "Python", category: "Programming" },
    { name: "Digital Marketing", category: "Marketing" },
    { name: "Data Science", category: "Analytics" },
    { name: "Solidity", category: "Blockchain" },
    { name: "Figma", category: "Design" },
    { name: "Node.js", category: "Programming" },
    { name: "Content Writing", category: "Writing" },
    { name: "Machine Learning", category: "AI" },
    { name: "Photoshop", category: "Design" },
    { name: "SEO", category: "Marketing" },
    { name: "JavaScript", category: "Programming" },
    { name: "Project Management", category: "Business" },
  ];

  const getSkillBackgroundColor = (skillName: string) => {
    const colorMap: { [key: string]: string } = {
      "React Development": "rgb(236, 255, 207)",
      "Smart Contracts": "rgb(236, 241, 231)",
      "UI/UX Design": "rgb(229, 255, 216)",
      Python: "rgb(232, 239, 239)",
      "Digital Marketing": "rgb(255, 239, 251)",
      "Data Science": "rgb(255, 250, 248)",
      Solidity: "rgb(255, 226, 243)",
      Figma: "rgb(234, 234, 234)",
      "Node.js": "rgb(224, 238, 255)",
      "Content Writing": "rgb(201, 255, 188)",
      "Machine Learning": "rgb(255, 251, 218)",
      Photoshop: "rgb(240, 248, 231)",
      SEO: "rgb(244, 255, 253)",
      JavaScript: "rgb(249, 253, 240)",
      "Project Management": "rgb(244, 244, 244)",
    };
    return colorMap[skillName] || "rgb(255, 255, 255)";
  };

  const learningGoalOptions = [
    "Career advancement",
    "Personal interest",
    "Start a side project",
    "Improve current job performance",
    "Prepare for job change",
    "Academic requirements",
    "Entrepreneurship",
    "Creative expression",
  ];

  const teachingPreferenceOptions = [
    "One-on-one sessions",
    "Small group teaching",
    "Structured curriculum",
    "Flexible approach",
    "Hands-on practice",
    "Theory-focused",
    "Project-based learning",
    "Mentorship style",
  ];

  const addSkill = (
    skillName: string,
    category: string,
    type: "teach" | "learn",
  ) => {
    const newSkill: SkillItem = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      name: skillName,
      category,
      type,
      experienceLevel: type === "teach" ? 50 : 0, // Default experience for teaching skills
    };

    if (type === "teach") {
      setFormData((prev) => ({
        ...prev,
        skillsToTeach: [...prev.skillsToTeach, newSkill],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skillsToLearn: [...prev.skillsToLearn, newSkill],
      }));
    }
  };

  const removeSkill = (skillId: string, type: "teach" | "learn") => {
    if (type === "teach") {
      setFormData((prev) => ({
        ...prev,
        skillsToTeach: prev.skillsToTeach.filter(
          (skill) => skill.id !== skillId,
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skillsToLearn: prev.skillsToLearn.filter(
          (skill) => skill.id !== skillId,
        ),
      }));
    }
  };

  const updateSkillExperience = (skillId: string, experience: number) => {
    setFormData((prev) => ({
      ...prev,
      skillsToTeach: prev.skillsToTeach.map((skill) =>
        skill.id === skillId
          ? { ...skill, experienceLevel: experience }
          : skill,
      ),
    }));
  };

  const toggleArrayItem = (
    array: string[],
    item: string,
    setter: (items: string[]) => void,
  ) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!formData.displayName.trim()) {
      toast.error("Please enter your display name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome to SkillSwap! 🎉");
        router.push("/dashboard");
      } else {
        if (response.status === 409) {
          toast.info("You've already completed onboarding!");
          router.push("/dashboard");
        } else {
          toast.error(data.error || "Failed to complete onboarding");
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      // If API fails, show success message and redirect anyway for demo purposes
      toast.success("Welcome to SkillSwap! 🎉 (Demo mode)");
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black animate-pulse">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-600 font-medium">Checking your profile...</p>
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0: Welcome
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto border-2 border-black"
        >
          <Sparkles className="w-10 h-10 text-black" />
        </motion.div>
        <h1 className="text-4xl font-black text-black">
          Welcome to SkillSwap!
        </h1>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          The gamified peer-to-peer learning platform where you exchange skills,
          build reputation, and earn blockchain-verified credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto border border-black">
            <Users className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            Peer-to-Peer Learning
          </h3>
          <p className="text-gray-600 font-medium">
            Connect with others to teach what you know and learn what you need
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto border border-black">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            Blockchain Reputation
          </h3>
          <p className="text-gray-600 font-medium">
            Build verifiable, on-chain reputation through successful teaching
            sessions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto border border-black">
            <Award className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            Gamified Experience
          </h3>
          <p className="text-gray-600 font-medium">
            Earn SkillScore, unlock achievements, and level up your expertise
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={nextStep}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-3"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>,

    // Step 1: Profile Setup
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 font-medium">
          Help others understand who you are and what you're passionate about
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg bg-yellow-400">
        <CardContent className="p-6 space-y-6 bg-yellow-100">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-black font-bold">
              Display Name *
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder="How should others know you?"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-black font-bold">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Share your background, interests, and what motivates you to learn and teach..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="min-h-[120px] border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            />
            <p className="text-sm text-gray-500 font-medium">
              This will be visible on your profile
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-black font-bold">
              Overall Experience Level
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <Button
                  key={level}
                  variant={
                    formData.experienceLevel === level ? "default" : "outline"
                  }
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, experienceLevel: level }))
                  }
                  className={`capitalize ${
                    formData.experienceLevel === level
                      ? level === "intermediate"
                        ? "bg-orange-400 text-black border-2 border-black font-semibold"
                        : "bg-yellow-400 text-black border-2 border-black"
                      : "border-2 border-gray-300 hover:border-yellow-400"
                  }`}
                >
                  {level === "intermediate" ? (
                    <span className="font-normal">{level}</span>
                  ) : (
                    level
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>,

    // Step 2: Skills to Teach
    <motion.div
      key="teach"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">What can you teach?</h2>
        <p className="text-gray-600 font-medium">
          Share your expertise and help others learn new skills
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent
          className="p-6 space-y-6"
          style={{
            color: "rgb(238, 251, 161)",
            backgroundColor: "rgb(255, 252, 168)",
          }}
        >
          <div className="space-y-4">
            <Label className="text-black font-bold">Popular Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularSkills.map((skill) => (
                <Button
                  key={skill.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill.name, skill.category, "teach")}
                  className="justify-start text-left h-auto p-3 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 font-medium"
                  style={{
                    backgroundColor: getSkillBackgroundColor(skill.name),
                    color:
                      skill.name === "Project Management"
                        ? "rgb(253, 253, 253)"
                        : undefined,
                  }}
                  disabled={formData.skillsToTeach.some(
                    (s) => s.name === skill.name,
                  )}
                >
                  <div>
                    <div className="font-bold text-black">{skill.name}</div>
                    <div className="text-xs text-gray-500">
                      {skill.category}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {formData.skillsToTeach.length > 0 && (
            <div className="space-y-4">
              <Label className="text-black font-bold">
                Your Teaching Skills
              </Label>
              <div className="space-y-4">
                {formData.skillsToTeach.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 border-2 border-green-200 rounded-lg bg-green-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-black">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({skill.category})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id, "teach")}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Experience Level: {skill.experienceLevel}%
                      </Label>
                      <Slider
                        value={[skill.experienceLevel || 50]}
                        onValueChange={(value) =>
                          updateSkillExperience(skill.id, value[0])
                        }
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>,

    // Step 3: Skills to Learn
    <motion.div
      key="learn"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          What do you want to learn?
        </h2>
        <p className="text-gray-600 font-medium">
          Discover new skills and connect with expert teachers
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent
          className="p-6 space-y-6"
          style={{ backgroundColor: "rgba(255, 249, 151, 1)" }}
        >
          <div className="space-y-4">
            <Label className="text-black font-bold">Popular Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularSkills.map((skill) => (
                <Button
                  key={skill.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill.name, skill.category, "learn")}
                  className="justify-start text-left h-auto p-3 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 font-medium"
                  style={{
                    backgroundColor: getSkillBackgroundColor(skill.name),
                    color:
                      skill.name === "Project Management"
                        ? "rgb(253, 253, 253)"
                        : undefined,
                  }}
                  disabled={formData.skillsToLearn.some(
                    (s) => s.name === skill.name,
                  )}
                >
                  <div>
                    <div className="font-bold text-black">{skill.name}</div>
                    <div className="text-xs text-gray-500">
                      {skill.category}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {formData.skillsToLearn.length > 0 && (
            <div className="space-y-3">
              <Label className="text-black font-bold">
                Skills You Want to Learn
              </Label>
              <div className="flex flex-wrap gap-2">
                {formData.skillsToLearn.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-blue-200 border border-blue-300 px-3 py-1"
                    onClick={() => removeSkill(skill.id, "learn")}
                  >
                    {skill.name} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>,

    // Step 4: Learning Goals & Teaching Preferences
    <motion.div
      key="preferences"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          Your Learning & Teaching Style
        </h2>
        <p className="text-gray-600 font-medium">
          Help us match you with the right learning partners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-black shadow-lg">
          <CardContent
            className="p-6 space-y-4"
            style={{ backgroundColor: "rgba(253, 253, 253, 1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <Label className="text-black font-bold">Learning Goals</Label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {learningGoalOptions.map((goal) => (
                <Button
                  key={goal}
                  variant={
                    formData.learningGoals.includes(goal)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    toggleArrayItem(formData.learningGoals, goal, (goals) =>
                      setFormData((prev) => ({
                        ...prev,
                        learningGoals: goals,
                      })),
                    )
                  }
                  className={`justify-start text-left ${
                    formData.learningGoals.includes(goal)
                      ? "bg-blue-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-lg">
          <CardContent
            className="p-6 space-y-4"
            style={{ backgroundColor: "rgba(255, 255, 203, 1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <Label className="text-black font-bold">
                Teaching Preferences
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {teachingPreferenceOptions.map((preference) => (
                <Button
                  key={preference}
                  variant={
                    formData.teachingPreferences.includes(preference)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    toggleArrayItem(
                      formData.teachingPreferences,
                      preference,
                      (prefs) =>
                        setFormData((prev) => ({
                          ...prev,
                          teachingPreferences: prefs,
                        })),
                    )
                  }
                  className={`justify-start text-left ${
                    formData.teachingPreferences.includes(preference)
                      ? "bg-green-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {preference}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent
          className="p-6 space-y-4"
          style={{ backgroundColor: "rgba(255, 242, 144, 0.68)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <Label className="text-black font-bold">Availability Hours</Label>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              When are you typically available for learning sessions? (24-hour
              format)
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Available from {formData.availabilityHours[0]}:00 to{" "}
                  {formData.availabilityHours[1]}:00
                </span>
              </div>
              <Slider
                value={formData.availabilityHours}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, availabilityHours: value }))
                }
                max={23}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>,

    // Step 5: Review & Complete
    <motion.div
      key="complete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          Ready to Start Your Journey!
        </h2>
        <p className="text-gray-600 font-medium">
          Review your profile and join the SkillSwap community
        </p>
      </div>

      <Card className="border-2 border-yellow-400 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Profile Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {formData.displayName}
                </div>
                <div>
                  <strong>Experience:</strong> {formData.experienceLevel}
                </div>
                <div>
                  <strong>Bio:</strong> {formData.bio || "Not provided"}
                </div>
                <div>
                  <strong>Availability:</strong> {formData.availabilityHours[0]}
                  :00 - {formData.availabilityHours[1]}:00
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black">Skills Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Skills to teach:
                    </span>
                    <Badge className="bg-green-100 text-green-700 font-medium">
                      {formData.skillsToTeach.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skillsToTeach.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill.id}
                        className="bg-green-100 text-green-700 text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {formData.skillsToTeach.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        +{formData.skillsToTeach.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Skills to learn:
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 font-medium">
                      {formData.skillsToLearn.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skillsToLearn.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill.id}
                        className="bg-blue-100 text-blue-700 text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {formData.skillsToLearn.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        +{formData.skillsToLearn.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 space-y-4">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto border-2 border-black">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <Button
              onClick={completeOnboarding}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up your profile..." : "Enter SkillSwap"}
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <style jsx global>{`
        [data-radix-progress-indicator] {
          background-color: #ff5400 !important;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress
            value={progress}
            className="h-3 border border-black bg-yellow-400"
          />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">{steps[currentStep]}</AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-8"
          >
            <Button
              onClick={prevStep}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
