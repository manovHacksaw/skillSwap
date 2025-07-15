import React from "react";

const benefits = [
  {
    title: "DECENTRALIZED MATCHING",
    description: "Find or offer teaching sessions with no central gatekeepers.",
    accent: "bg-yellow-50 border-yellow-200",
  },
  {
    title: "VERIFIED REPUTATION",
    description: "Earn Soulbound Tokens to prove your skills transparently.",
    accent: "bg-blue-50 border-blue-200",
  },
  {
    title: "SECURE WALLET SIGN-IN",
    description: "Connect with WalletConnect or email – privacy first.",
    accent: "bg-green-50 border-green-200",
  },
  {
    title: "EARN AS YOU TEACH",
    description: "Get on-chain rewards and recognition for mentoring.",
    accent: "bg-pink-50 border-pink-200",
  },
  {
    title: "PORTABLE SKILL SCORE",
    description: "Bring your skill reputation to any dApp supporting CARV ID.",
    accent: "bg-purple-50 border-purple-200",
  },
  {
    title: "SIMPLE & INTUITIVE UI",
    description: "Designed for real learners and mentors with clean navigation.",
    accent: "bg-yellow-50 border-yellow-200",
  },
];

export default function BenefitsSection() {
  return (
    <section className="w-full bg-[#F9FAFB] py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        {/* Section Label */}
        <span className="uppercase font-semibold text-xs tracking-widest bg-[#FBBF24] text-black px-3 py-1 rounded mb-4">
          BENEFITS
        </span>
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-center mb-4 font-inter text-black">
          EVERYTHING IS BUILT TO HELP YOU LEARN AND TEACH BETTER
        </h2>
        {/* Supporting Paragraph */}
        <p className="text-center text-gray-600 max-w-2xl mb-12 font-inter font-medium">
          SkillSwap gives you the tools to match, teach, learn, and earn reputation in a decentralized way – all in one place.
        </p>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {benefits.map((card, idx) => (
            <div
              key={card.title}
              className={`transition-all duration-200 hover:-translate-y-2 hover:shadow-xl shadow-md border ${card.accent} rounded-xl p-7 flex flex-col items-start min-h-[170px]`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <h3 className="text-lg font-bold uppercase mb-2 text-black font-inter">{card.title}</h3>
              <p className="text-gray-600 font-medium font-inter">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 