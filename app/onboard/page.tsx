"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Shield,
  Award,
  Clock,
  BookOpen,
  Lightbulb,
  Zap,
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import WalletConnect from "@/components/wallet-connect";

interface FormData {
  // Basic Info
  displayName: string;
  username: string;
  bio: string;
  interests: string[];
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;

  // About You
  occupation: string;
  ageGroup: string;
  hobbies: string[];

  // Skills & Learning
  skillsToTeach: Array<{ name: string; category: string; proficiency: string }>;
  skillsToLearn: Array<{ name: string; category: string }>;
  motivations: string[];

  // Preferences
  availableTimings: string[];

  // Wallet
  walletAddress: string;
  walletSignature: string;
}

export default function OnboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    displayName: user?.fullName || "",
    username: "",
    bio: "",
    interests: [],
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    occupation: "",
    ageGroup: "",
    hobbies: [],
    skillsToTeach: [],
    skillsToLearn: [],
    motivations: [],
    availableTimings: [],
    walletAddress: "",
    walletSignature: "",
  });

  const totalSteps = 8;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Check if user already exists
  useEffect(() => {
    const checkUserExists = async () => {
      try {
        const response = await fetch("/api/onboard");
        const data = await response.json();

        if (data.exists && data.user?.onboardingStatus === "complete") {
          toast.info("You've already completed onboarding!");
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    if (user) {
      checkUserExists();
    }
  }, [user, router]);

  const popularSkills = [
    { name: "JavaScript", category: "Programming" },
    { name: "React", category: "Programming" },
    { name: "Python", category: "Programming" },
    { name: "UI/UX Design", category: "Design" },
    { name: "Figma", category: "Design" },
    { name: "Photoshop", category: "Design" },
    { name: "Video Editing", category: "Creative" },
    { name: "Public Speaking", category: "Communication" },
    { name: "Digital Marketing", category: "Marketing" },
    { name: "SEO", category: "Marketing" },
    { name: "Cooking", category: "Lifestyle" },
    { name: "Language Learning", category: "Education" },
    { name: "Photography", category: "Creative" },
    { name: "Writing", category: "Communication" },
    { name: "Data Science", category: "Analytics" },
    { name: "Blockchain", category: "Web3" },
    { name: "Smart Contracts", category: "Web3" },
    { name: "Project Management", category: "Business" },
    { name: "Finance", category: "Business" },
    { name: "Music Production", category: "Creative" },
  ];

  const interestOptions = [
    "Technology",
    "Design",
    "Business",
    "Creative Arts",
    "Science",
    "Health & Fitness",
    "Travel",
    "Food & Cooking",
    "Music",
    "Sports",
    "Reading",
    "Gaming",
    "Photography",
    "Writing",
    "Languages",
  ];

  const occupationOptions = [
    "Student",
    "Software Developer",
    "Designer",
    "Freelancer",
    "Entrepreneur",
    "Marketing Professional",
    "Data Scientist",
    "Product Manager",
    "Teacher/Educator",
    "Consultant",
    "Artist/Creative",
    "Engineer",
    "Researcher",
    "Other",
  ];

  const ageGroupOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];

  const hobbyOptions = [
    "Reading",
    "Gaming",
    "Sports",
    "Music",
    "Art & Crafts",
    "Gardening",
    "Cooking",
    "Travel",
    "Photography",
    "Fitness",
    "Movies & TV",
    "Board Games",
    "Hiking",
    "Dancing",
    "Volunteering",
  ];

  const motivationOptions = [
    "I want to teach",
    "I want to learn new things",
    "I want to meet new people",
    "I'm curious about Web3",
    "Career advancement",
    "Personal growth",
    "Build my reputation",
    "Earn certificates",
  ];

  const timingOptions = [
    "Early mornings (6-9 AM)",
    "Mornings (9 AM-12 PM)",
    "Afternoons (12-5 PM)",
    "Evenings (5-8 PM)",
    "Late evenings (8-11 PM)",
    "Weekends",
    "Flexible/Anytime",
  ];

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

  const addSkill = (
    skillName: string,
    category: string,
    type: "teach" | "learn",
    proficiency?: string,
  ) => {
    if (type === "teach") {
      // Check if skill already exists
      const exists = formData.skillsToTeach.some(
        (skill) => skill.name === skillName,
      );
      if (exists) {
        toast.info(`${skillName} is already in your teaching skills`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skillsToTeach: [
          ...prev.skillsToTeach,
          {
            name: skillName,
            category,
            proficiency: proficiency || "Intermediate",
          },
        ],
      }));
    } else {
      // Check if skill already exists
      const exists = formData.skillsToLearn.some(
        (skill) => skill.name === skillName,
      );
      if (exists) {
        toast.info(`${skillName} is already in your learning skills`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skillsToLearn: [...prev.skillsToLearn, { name: skillName, category }],
      }));
    }
  };

  const removeSkill = (skillName: string, type: "teach" | "learn") => {
    if (type === "teach") {
      setFormData((prev) => ({
        ...prev,
        skillsToTeach: prev.skillsToTeach.filter(
          (skill) => skill.name !== skillName,
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skillsToLearn: prev.skillsToLearn.filter(
          (skill) => skill.name !== skillName,
        ),
      }));
    }
  };

  const updateSkillProficiency = (skillName: string, proficiency: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsToTeach: prev.skillsToTeach.map((skill) =>
        skill.name === skillName ? { ...skill, proficiency } : skill,
      ),
    }));
  };

  const nextStep = () => {
    // Validation for required steps
    if (currentStep === 1) {
      if (!formData.displayName.trim()) {
        toast.error("Please enter your display name");
        return;
      }
      if (formData.displayName.trim().length < 2) {
        toast.error("Display name must be at least 2 characters long");
        return;
      }
      if (
        formData.username &&
        formData.username.trim().length > 0 &&
        formData.username.trim().length < 3
      ) {
        toast.error("Username must be at least 3 characters long");
        return;
      }
    }
    if (currentStep === 3 && formData.skillsToTeach.length === 0) {
      toast.error("Please select at least one skill you can teach");
      return;
    }
    if (currentStep === 5 && formData.skillsToLearn.length === 0) {
      toast.error("Please select at least one skill you want to learn");
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWalletConnected = (walletData: {
    address: string;
    signature: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      walletAddress: walletData.address,
      walletSignature: walletData.signature,
    }));
    // Auto-proceed to completion
    setTimeout(() => {
      completeOnboarding(walletData);
    }, 1000);
  };

  const completeOnboarding = async (walletData?: {
    address: string;
    signature: string;
  }) => {
    const finalData = walletData
      ? {
          ...formData,
          walletAddress: walletData.address,
          walletSignature: walletData.signature,
        }
      : formData;

    // Validation before submission
    if (!finalData.displayName.trim()) {
      toast.error("Please enter your display name");
      return;
    }

    if (!finalData.walletAddress || !finalData.walletSignature) {
      toast.error("Please connect your wallet to continue");
      return;
    }

    if (finalData.skillsToTeach.length === 0) {
      toast.error("Please select at least one skill you can teach");
      return;
    }

    if (finalData.skillsToLearn.length === 0) {
      toast.error("Please select at least one skill you want to learn");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Welcome to SkillSwap! Your on-chain learning identity is ready! 🎉",
        );
        router.push("/dashboard");
      } else {
        // Handle specific error codes
        switch (data.code) {
          case "ALREADY_ONBOARDED":
            toast.info("You've already completed onboarding!");
            router.push("/dashboard");
            break;
          case "WALLET_ALREADY_CONNECTED":
            toast.error(
              "This wallet is already connected to another account. Please use a different wallet or disconnect from the other account first.",
            );
            // Reset wallet data to allow user to connect a different wallet
            setFormData((prev) => ({
              ...prev,
              walletAddress: "",
              walletSignature: "",
            }));
            setCurrentStep(7); // Go back to wallet step
            break;
          case "USERNAME_TAKEN":
            toast.error("Username is already taken. Please choose another.");
            setCurrentStep(1); // Go back to basic info step
            break;
          case "EMAIL_ALREADY_EXISTS":
            toast.error(
              "This email is already registered. Please contact support if you believe this is an error.",
            );
            break;
          case "DATABASE_ERROR":
            toast.error(
              "Database error occurred. Please try again in a few moments.",
            );
            break;
          default:
            toast.error(
              data.error || "Failed to complete onboarding. Please try again.",
            );
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(
        "Network error occurred. Please check your connection and try again.",
      );
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
    // Step 0: Welcome Screen
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
          <Zap className="w-10 h-10 text-black" />
        </motion.div>
        <h1 className="text-4xl font-black text-black">
          Welcome to SkillSwap!
        </h1>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Build your on-chain learning identity. This onboarding takes 10-15
          minutes and helps us match you with the right people, skills, and
          opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-black mb-1">
            On-Chain Reputation
          </h3>
          <p className="text-xs text-gray-600">
            Build verifiable reputation that follows you everywhere
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-black mb-1">
            NFT Certificates
          </h3>
          <p className="text-xs text-gray-600">
            Earn blockchain-verified skill certificates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-black mb-1">
            Web3 + Web2 Friendly
          </h3>
          <p className="text-xs text-gray-600">
            Easy to use, powered by blockchain
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 bg-white rounded-lg border-2 border-black shadow-lg"
        >
          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-black mb-1">Skill Matching</h3>
          <p className="text-xs text-gray-600">
            Connect with perfect learning partners
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
          Let's Build Your Identity
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>,

    // Step 1: Basic Information Collection
    <motion.div
      key="basic-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          Let's set up your SkillSwap identity
        </h2>
        <p className="text-gray-600 font-medium">
          Mind sharing a few quick things?
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-black font-bold">
                What's your name? *
              </Label>
              <Input
                id="displayName"
                placeholder="How you want others to see you"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className="border-2 border-black rounded-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-black font-bold">
                Pick a username/handle
              </Label>
              <Input
                id="username"
                placeholder="@yourhandle"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="border-2 border-black rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-black font-bold">
              Tell us a bit about you
            </Label>
            <Textarea
              id="bio"
              placeholder="What makes you unique? What are you passionate about?"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="min-h-[100px] border-2 border-black rounded-lg font-medium"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-black font-bold">
              What are your interests?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map((interest) => (
                <Button
                  key={interest}
                  variant={
                    formData.interests.includes(interest)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    toggleArrayItem(formData.interests, interest, (interests) =>
                      setFormData((prev) => ({ ...prev, interests })),
                    )
                  }
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
          </div>

          <div className="space-y-4">
            <Label className="text-black font-bold">
              Add your socials (optional)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-gray-600">LinkedIn</Label>
                <Input
                  placeholder="linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-gray-600">GitHub</Label>
                <Input
                  placeholder="github.com/yourusername"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-gray-600">Twitter/X</Label>
                <Input
                  placeholder="twitter.com/yourhandle"
                  value={formData.twitterUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twitterUrl: e.target.value,
                    }))
                  }
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>,

    // Step 2: About You
    <motion.div
      key="about-you"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">About You</h2>
        <p className="text-gray-600 font-medium">
          Help us understand your background better
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-black font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              What do you currently do?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {occupationOptions.map((occupation) => (
                <Button
                  key={occupation}
                  variant={
                    formData.occupation === occupation ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, occupation }))
                  }
                  className={`text-left ${
                    formData.occupation === occupation
                      ? "bg-purple-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {occupation}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-black font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              What's your age group?
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {ageGroupOptions.map((age) => (
                <Button
                  key={age}
                  variant={formData.ageGroup === age ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, ageGroup: age }))
                  }
                  className={`${
                    formData.ageGroup === age
                      ? "bg-green-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-black font-bold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              What are your hobbies or non-tech interests?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hobbyOptions.map((hobby) => (
                <Button
                  key={hobby}
                  variant={
                    formData.hobbies.includes(hobby) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    toggleArrayItem(formData.hobbies, hobby, (hobbies) =>
                      setFormData((prev) => ({ ...prev, hobbies })),
                    )
                  }
                  className={`text-left ${
                    formData.hobbies.includes(hobby)
                      ? "bg-pink-400 text-white border-2 border-black"
                      : "border-2 border-gray-300 hover:border-pink-400"
                  }`}
                >
                  {hobby}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>,

    // Step 3: What Can You Teach?
    <motion.div
      key="teach-skills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          What skills could you share with the world?
        </h2>
        <p className="text-gray-600 font-medium">
          Select at least one skill you can teach others
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularSkills.map((skill) => (
              <Button
                key={skill.name}
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill.name, skill.category, "teach")}
                className="justify-start text-left h-auto p-3 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 font-medium"
                disabled={formData.skillsToTeach.some(
                  (s) => s.name === skill.name,
                )}
              >
                <div>
                  <div className="font-bold text-black text-xs">
                    {skill.name}
                  </div>
                  <div className="text-xs text-gray-500">{skill.category}</div>
                </div>
              </Button>
            ))}
          </div>

          {formData.skillsToTeach.length > 0 && (
            <div className="space-y-4">
              <Label className="text-black font-bold">
                Your Teaching Skills
              </Label>
              <div className="space-y-3">
                {formData.skillsToTeach.map((skill) => (
                  <div
                    key={skill.name}
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
                        onClick={() => removeSkill(skill.name, "teach")}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Proficiency Level
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Expert"].map((level) => (
                          <Button
                            key={level}
                            variant={
                              skill.proficiency === level
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateSkillProficiency(skill.name, level)
                            }
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

          {formData.skillsToTeach.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select skills you can teach to continue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>,

    // Step 4: Why Are You Here?
    <motion.div
      key="motivations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          What brings you to SkillSwap?
        </h2>
        <p className="text-gray-600 font-medium">Select all that apply</p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motivationOptions.map((motivation) => (
              <div key={motivation} className="flex items-center space-x-3">
                <Checkbox
                  id={motivation}
                  checked={formData.motivations.includes(motivation)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        motivations: [...prev.motivations, motivation],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        motivations: prev.motivations.filter(
                          (m) => m !== motivation,
                        ),
                      }));
                    }
                  }}
                  className="border-2 border-black"
                />
                <Label
                  htmlFor={motivation}
                  className="text-black font-medium cursor-pointer"
                >
                  {motivation}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-black font-bold">
              Other (please specify)
            </Label>
            <Input
              placeholder="Tell us more about what brings you here..."
              className="border-2 border-gray-300 rounded-lg"
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  const customMotivation = `Other: ${e.target.value.trim()}`;
                  if (
                    !formData.motivations.some((m) => m.startsWith("Other:"))
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      motivations: [...prev.motivations, customMotivation],
                    }));
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>,

    // Step 5: What Do You Want to Learn?
    <motion.div
      key="learn-skills"
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
          Select at least one skill you'd like to master
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularSkills.map((skill) => (
              <Button
                key={skill.name}
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill.name, skill.category, "learn")}
                className="justify-start text-left h-auto p-3 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 font-medium"
                disabled={formData.skillsToLearn.some(
                  (s) => s.name === skill.name,
                )}
              >
                <div>
                  <div className="font-bold text-black text-xs">
                    {skill.name}
                  </div>
                  <div className="text-xs text-gray-500">{skill.category}</div>
                </div>
              </Button>
            ))}
          </div>

          {formData.skillsToLearn.length > 0 && (
            <div className="space-y-3">
              <Label className="text-black font-bold">
                Skills You Want to Learn
              </Label>
              <div className="flex flex-wrap gap-2">
                {formData.skillsToLearn.map((skill) => (
                  <Badge
                    key={skill.name}
                    className="bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-blue-200 border border-blue-300 px-3 py-1"
                    onClick={() => removeSkill(skill.name, "learn")}
                  >
                    {skill.name} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {formData.skillsToLearn.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select skills you want to learn to continue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>,

    // Step 6: Preferred Timings
    <motion.div
      key="timings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black">
          When would you generally be available?
        </h2>
        <p className="text-gray-600 font-medium">
          Select your preferred times for teaching or learning
        </p>
      </div>

      <Card className="border-2 border-black shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <Label className="text-black font-bold">Available Times</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timingOptions.map((timing) => (
              <div key={timing} className="flex items-center space-x-3">
                <Checkbox
                  id={timing}
                  checked={formData.availableTimings.includes(timing)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        availableTimings: [...prev.availableTimings, timing],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        availableTimings: prev.availableTimings.filter(
                          (t) => t !== timing,
                        ),
                      }));
                    }
                  }}
                  className="border-2 border-black"
                />
                <Label
                  htmlFor={timing}
                  className="text-black font-medium cursor-pointer"
                >
                  {timing}
                </Label>
              </div>
            ))}
          </div>

          {formData.availableTimings.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-bold text-black mb-2">
                Your Availability Summary:
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.availableTimings.map((timing) => (
                  <Badge key={timing} className="bg-purple-100 text-purple-700">
                    {timing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>,

    // Step 7: Sign with Wallet
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <WalletConnect
        onWalletConnected={handleWalletConnected}
        isLoading={isSubmitting}
      />
    </motion.div>,
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
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
          <Progress value={progress} className="h-3 border border-black" />
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
