import React from "react";

const benefits = [
  {
    title: "DECENTRALIZED MATCHING",
    description: "Find or offer teaching sessions with no central gatekeepers.",
    accent: "bg-[#FFF9A3]",
    illustration: (
      <div className="flex justify-end w-full mt-2">
        <div className="bg-white border border-gray-300 rounded-lg p-2 w-32 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Basic: HTML and CSS</span>
          <div className="flex justify-between w-full text-xs text-gray-400">
            <span>24</span>
            <span>6</span>
            <span>👤</span>
            <span>99</span>
          </div>
        </div>
      </div>
    ),
    grid: "col-span-2 row-span-1",
  },
  {
    title: "VERIFIED REPUTATION",
    description: "Earn Soulbound Tokens to prove your skills transparently.",
    accent: "bg-white",
    illustration: null,
    grid: "col-span-1 row-span-1",
  },
  {
    title: "PORTABLE SKILL SCORE",
    description: "Bring your skill reputation to any dApp supporting CARV ID.",
    accent: "bg-white",
    illustration: null,
    grid: "col-span-1 row-span-1",
  },
  {
    title: "EARN AS YOU TEACH",
    description: "Get on-chain rewards and recognition for mentoring.",
    accent: "bg-[#D6F5F5]",
    illustration: (
      <div className="flex justify-end w-full mt-2">
        <div className="bg-white border border-gray-300 rounded-lg p-2 w-28 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Point Progress</span>
          <div className="w-16 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">8,966</div>
        </div>
      </div>
    ),
    grid: "col-span-2 row-span-1",
  },
  {
    title: "VERIFIED REPUTATION",
    description: "Earn Soulbound Tokens to prove your skills transparently.",
    accent: "bg-[#FFE5C2]",
    illustration: (
      <div className="flex justify-end w-full mt-2">
        <div className="bg-white border border-gray-300 rounded-lg p-2 w-32 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Leader Board</span>
          <div className="w-full text-xs text-gray-400 flex flex-col items-start">
            <span>1. Charlie Rawal</span>
            <span>2. Ariana Agarwal</span>
          </div>
        </div>
      </div>
    ),
    grid: "col-span-1 row-span-1",
  },
  {
    title: "PORTABLE SKILL SCORE",
    description: "Bring your skill reputation to any dApp supporting CARV ID.",
    accent: "bg-white",
    illustration: null,
    grid: "col-span-1 row-span-1",
  },
];

export default function BenefitsSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        {/* Section Label */}
        <span className="uppercase font-semibold text-xs tracking-widest bg-[#FFF9A3] text-black px-3 py-1 rounded mb-4 shadow-[2px_2px_0_0_#000] border-2 border-black">
          BENEFITS
        </span>
        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase mb-4 tracking-tight text-center" style={{ letterSpacing: '-0.02em' }}>
          EVERYTHING IS BUILT TO HELP YOU LEARN  <br className="hidden sm:block" /> AND TEACH BETTER
        </h2>
        {/* Supporting Paragraph */}
        <p className="text-center text-gray-600 max-w-2xl mb-12 font-inter font-medium">
          SkillSwap gives you the tools to match, teach, learn, and earn reputation in a decentralized way – all in one place.
        </p>
        {/* Cards Grid */}
        <div className="w-full">
          {/* Desktop: 2 rows x 3 columns masonry grid */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-[10px] w-full">
            {/* Row 1 */}
            <div className="col-span-2 row-span-1">{renderCard(benefits[0])}</div>
            <div className="col-span-1 row-span-1">{renderCard(benefits[1])}</div>
            {/* Row 2 */}
            <div className="col-span-1 row-span-1">{renderCard(benefits[2])}</div>
            <div className="col-span-1 row-span-1">{renderCard(benefits[3])}</div>
            <div className="col-span-1 row-span-1">{renderCard(benefits[4])}</div>
            <div className="col-span-1 row-span-1">{renderCard(benefits[5])}</div>
          </div>
          {/* Tablet: 2 columns */}
          <div className="hidden sm:grid lg:hidden sm:grid-cols-2 sm:grid-rows-3 gap-[10px] w-full">
            {benefits.map((card, idx) => (
              <div key={card.title}>{renderCard(card)}</div>
            ))}
          </div>
          {/* Mobile: 1 column */}
          <div className="grid sm:hidden grid-cols-1 gap-[10px] w-full">
            {benefits.map((card, idx) => (
              <div key={card.title}>{renderCard(card)}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderCard(card: typeof benefits[0]) {
  return (
    <div
      className={`relative transition-all duration-200 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] shadow-[6px_6px_0_0_#000] border-[3px] border-black rounded-xl p-5 sm:p-7 flex flex-col items-start min-h-[160px] ${card.accent}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <h3 className="text-lg sm:text-xl font-black uppercase mb-2 text-black font-inter leading-tight text-left tracking-tight" style={{letterSpacing: '-0.01em'}}>{card.title}</h3>
      <p className="text-gray-800 font-medium font-inter text-left mb-1" style={{fontSize: '1rem'}}>{card.description}</p>
      {card.illustration}
    </div>
  );
} 