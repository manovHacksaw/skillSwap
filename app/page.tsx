"use client"

import { motion } from "framer-motion"
import AnimatedHeroSection from "@/components/animated-hero-section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Award, Shield, Globe, Zap, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BenefitsSection from "@/components/benefits-section";
import IntegrationsSection from "@/components/integrations-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FAQSection from "@/components/faq-section";

// FeatureCard component for the features grid
function FeatureCard({ icon, title, description, bg }: { icon: string; title: string; description: string; bg: string }) {
  return (
    <div
      className="border-2 border-black rounded-lg p-8 flex flex-col items-center shadow-none"
      style={{ background: bg }}
    >
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="font-black text-xl mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-[#F8F6F3] min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-20 border-b-2 border-black bg-[#FFF8F0]">
        <AnimatedHeroSection />
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4" style={{ backgroundColor: "#FFF9DB" }}>
        <h2 className="text-4xl sm:text-5xl font-black uppercase mb-14 text-center tracking-tight">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            icon="⚡"
            title="Instant Skill Matching"
            description="Find the perfect skill swap partner in seconds with our smart matching algorithm."
            bg="#FFF4A3"
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Private"
            description="Your data is protected with industry-leading security and privacy standards."
            bg="#E0F7FA"
          />
          <FeatureCard
            icon="🎯"
            title="Goal Tracking"
            description="Set learning goals and track your progress visually on your dashboard."
            bg="#E8E4FF"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t-2 border-black bg-[#E8E4FF]">
        <BenefitsSection />
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <HowItWorksSection />
      </section>

      {/* Integrations / Social Proof */}
      <section className="py-20 border-t-2 border-black bg-[#E0F7FA]">
        <IntegrationsSection />
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <FAQSection />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-black bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h4 className="font-black text-2xl mb-4 uppercase">Ready to swap skills?</h4>
          <form className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <input
              type="email"
              placeholder="Your email"
              className="border-2 border-black rounded px-4 py-2 flex-1 min-w-0"
              required
            />
            <button
              type="submit"
              className="bg-[#FFD700] text-black font-bold px-6 py-2 rounded border-2 border-black hover:scale-105 transition"
            >
              Join Now
            </button>
          </form>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
