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
      className="border-2 border-black rounded-lg p-6 sm:p-8 flex flex-col items-center shadow-none min-h-[260px]"
      style={{ background: bg }}
    >
      <span className="text-4xl sm:text-5xl mb-4">{icon}</span>
      <h3 className="font-black text-lg sm:text-xl mb-2 uppercase tracking-tight text-center">{title}</h3>
      <p className="text-gray-700 text-center text-base sm:text-lg">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans w-full"
      style={{
        backgroundColor: '#F9F6F3',
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
      }}
    >
      {/* Hero Section */}
      <motion.section
        className="py-16 sm:py-24 flex flex-col items-center justify-center text-center"
        style={{ background: 'none' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="mb-8 w-full px-4 sm:px-0">
          <AnimatedHeroSection />
        </div>
      </motion.section>

      {/* Problem Section */}
      <motion.section
        className="py-16 sm:py-24 flex flex-col items-center justify-center text-center"
        style={{ background: 'none' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      >
        <span className="inline-block bg-[#FFD700] border-2 border-black rounded px-4 py-1 text-black font-bold uppercase tracking-wider text-sm mb-6 shadow-[4px_4px_0_0_#000]">Problem</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          LEARNING NEW SKILLS<br className="hidden sm:block" /> SHOULDN'T BE CENTRALIZED
        </h2>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-12 font-medium">
        Today’s learning platforms gatekeeping knowledge, hide credentials behind paywalls, and don’t respect your data. SkillSwap empowers peer-to-peer learning with on-chain reputation you own.
        </p>
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-2 sm:px-0">
          {[
            {
              title: 'Centralized Control',
              desc: 'Skills and reputation are locked in closed platforms.',
            },
            {
              title: 'NO VERIFIABLE CREDENTIALS',
              desc: 'Theres no way to prove you taught or learned transparently.',
            },
            {
              title: 'NO FAIR INCENTIVES',
              desc: 'Mentors and learners don’t earn or own their impact.',
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="relative bg-white border-2 border-black rounded-lg p-8 flex flex-col items-center shadow-[6px_6px_0_0_#000] min-h-[220px]"
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full border-2 border-black bg-[#FFD700] text-2xl font-bold shadow-[2px_2px_0_0_#000]">
                <span className="text-red-600">✗</span>
              </span>
              <h3 className="font-black text-xl sm:text-2xl mb-2 uppercase tracking-tight text-center mt-8">
                {item.title}
              </h3>
              <p className="text-gray-700 text-center text-base sm:text-lg font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="py-16 sm:py-24"
        style={{ background: 'none' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <BenefitsSection />
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      >
        <HowItWorksSection />
      </motion.section>

      {/* Integrations / Social Proof */}
      <motion.section
        className="py-16 sm:py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <IntegrationsSection />
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
      >
        <FAQSection />
      </motion.section>

      {/* Newsletter Section - restored */}
      <section className="w-full flex justify-center items-center py-16 px-4">
        <div className="bg-[#FFF9A3] border-2 border-black shadow-[8px_8px_0_0_#000] max-w-4xl w-full mx-auto flex flex-col items-center p-10 relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-6 py-2 font-bold uppercase text-sm tracking-wider shadow-[2px_2px_0_0_#000]">Newsletter</span>
          <h2 className="text-4xl sm:text-5xl font-black text-black text-center mb-4 mt-8 uppercase leading-tight">READY TO SWAP SKILLS ?</h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl">The decentralized platform for skill exchange.Connect , learn and teach in a Web3 environment with on-chain reputaionand DAO validation.</p>
          <form className="w-full max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="example@mail.com"
              className="flex-1 rounded-full border-2 border-black px-6 py-3 text-lg shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="rounded-full bg-black text-white w-12 h-12 flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] hover:scale-105 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer is now handled by the new newsletter/footer component */}
    </main>
  );
}
