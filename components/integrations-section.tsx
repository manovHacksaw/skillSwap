import React from "react";

// --- 3D Web3 Emoji Icon Arrays ---
const emojiIcons = [
  "🦊", // MetaMask
  "💎", // Ethereum
  "🔗", // Chainlink
  "🪙", // Coin
  "🌐", // ENS
  "🦄", // Uniswap
  "🛡️", // Security
  "📦", // IPFS
  "🧩", // SkillSwap
  "🏅", // Reputation
  "🧬", // Ceramic
  "🟣", // Polygon
  "🦄", // Uniswap (again for color)
  "🦉", // Wisdom/DAO
  "🟢", // Solana
];
const emojiRow = [...emojiIcons, ...emojiIcons];

export default function IntegrationsSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] p-8 sm:p-12 md:p-16 flex flex-col items-center" style={{ margin: '0 0 0 0' }}>
          {/* Scrolling Emoji Rows */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            {/* Top Row - scroll left */}
            <div className="overflow-hidden">
              <div className="flex gap-10 animate-scroll-left">
                {emojiRow.map((emoji, i) => (
                  <div key={`emoji-top-${i}`} className="flex-shrink-0 text-5xl">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom Row - scroll right */}
            <div className="overflow-hidden mt-6">
              <div className="flex gap-10 animate-scroll-right">
                {emojiRow.map((emoji, i) => (
                  <div key={`emoji-bottom-${i}`} className="flex-shrink-0 text-5xl">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Section Label */}
          <span className="uppercase font-semibold text-xs tracking-widest bg-[#FFE5C2] text-black px-4 py-2 rounded-none mb-4 border-2 border-black shadow-[2px_2px_0_0_#000]" style={{ letterSpacing: '0.08em' }}>
            INTEGRATIONS
          </span>
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-center mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            SEAMLESS WEB3 <br className="hidden sm:block" /> INTEGRATIONS
          </h2>
          {/* Supporting Paragraph */}
          <p className="text-center text-gray-600 max-w-2xl mb-2 font-inter font-medium">
            SkillSwap integrates with your favorite web3 tools for effortless Sign In, Reputation, and rewards. Unlock frictionless learning and teaching with the decentralized apps you trust.
          </p>
        </div>
      </div>
      {/* Styles for animation */}
      <style jsx>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          display: flex;
          width: calc(120px * ${emojiIcons.length * 2});
          animation: scrollLeft 40s linear infinite;
        }
        .animate-scroll-right {
          display: flex;
          width: calc(120px * ${emojiIcons.length * 2});
          animation: scrollRight 40s linear infinite;
        }
      `}</style>
    </section>
  );
} 