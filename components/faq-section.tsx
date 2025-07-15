import React, { useState } from "react";

const faqs = [
  {
    question: "How does SkillSwap work?",
    answer:
      "SkillSwap connects people who want to learn with those who want to teach. You list your skills and get matched with partners for a peer-to-peer learning experience.",
  },
  {
    question: "Do I need to pay to use SkillSwap?",
    answer:
      "No, SkillSwap is free to join. You can teach or learn without any cost. In future, premium features may be introduced for advanced options.",
  },
  {
    question: "What skills can I offer or learn?",
    answer:
      "Anything! From coding, design, marketing, writing, to personal development. Our goal is to enable decentralized knowledge exchange for any skill.",
  },
  {
    question: "How do I build my reputation?",
    answer:
      "By teaching well and getting positive feedback. Your on-chain reputation grows as you complete learning swaps and earn credentials.",
  },
  {
    question: "Is my data secure and decentralized?",
    answer:
      "Yes. We use blockchain-backed credentials to ensure your learning history and reputation are verifiable, portable, and secure.",
  },
  {
    question: "Can I match with multiple partners?",
    answer:
      "Absolutely! You can have multiple learning swaps at once and grow your network of learning partners.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full py-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section Label */}
        <div className="flex justify-center w-full">
          <span className="uppercase font-semibold text-xs tracking-widest bg-[#FFF9A3] text-black px-3 py-1 rounded mb-4 shadow-[2px_2px_0_0_#000] border-2 border-black text-center">
            FAQ
          </span>
        </div>
        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase mb-4 tracking-tight text-center" style={{ letterSpacing: '-0.02em' }}>
          Common Questions <br className="hidden sm:block" /> Answered Clearly
        </h2>
        {/* Subtitle */}
        <p className="text-gray-500 font-inter mb-10 text-center">
          Here are clear answers to the most common questions about SkillSwap.
        </p>
        {/* FAQ List */}
        <div className="flex flex-col gap-5">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={`faq-answer-${idx}`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="text-lg font-black text-black font-inter text-left">
                  {faq.question}
                </span>
                <span
                  className={`ml-4 transform transition-transform duration-300 ${
                    open === idx ? "rotate-90 text-[#FBBF24]" : "rotate-0 text-black"
                  }`}
                >
                  {/* Right Arrow SVG */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: open === idx ? 200 : 0,
                  opacity: open === idx ? 1 : 0,
                  padding: open === idx ? "0 1.5rem 1.25rem 1.5rem" : "0 1.5rem 0 1.5rem",
                }}
              >
                <p className="text-gray-700 font-inter font-medium text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 