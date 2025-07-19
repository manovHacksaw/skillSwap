// components/onboarding/OnboardingLayout.tsx
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isSubmitting,
  children,
}: OnboardingLayoutProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

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
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-8"
          >
            <Button
              onClick={onPrev}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={onNext}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              disabled={isSubmitting} // Disable during submission
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