"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Award, Globe, Users } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
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
        <h1 className="text-4xl font-black text-black">Welcome to SkillSwap!</h1>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Build your on-chain learning identity. This onboarding takes 10-15 minutes 
          and helps us match you with the right people, skills, and opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          {
            icon: Shield,
            title: "On-Chain Reputation",
            description: "Build verifiable reputation that follows you everywhere",
            color: "text-purple-600",
            delay: 0.4
          },
          {
            icon: Award,
            title: "NFT Certificates",
            description: "Earn blockchain-verified skill certificates",
            color: "text-yellow-600",
            delay: 0.5
          },
          {
            icon: Globe,
            title: "Web3 + Web2 Friendly",
            description: "Easy to use, powered by blockchain",
            color: "text-blue-600",
            delay: 0.6
          },
          {
            icon: Users,
            title: "Skill Matching",
            description: "Connect with perfect learning partners",
            color: "text-green-600",
            delay: 0.7
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay }}
            className="p-4 bg-white rounded-lg border-2 border-black shadow-lg"
          >
            <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-2`} />
            <h3 className="text-sm font-bold text-black mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onNext}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-3"
        >
          Let's Build Your Identity
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
