import React from "react";

// --- SVG Icon Components ---
const WalletConnectIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.733 4.292a1.2 1.2 0 011.697 0l4.33 4.33a1.2 1.2 0 010 1.697l-1.33 1.33a1.2 1.2 0 01-1.697 0L4.4 7.318a1.2 1.2 0 010-1.697l1.33-1.33zm12.534 0a1.2 1.2 0 011.697 0l1.33 1.33a1.2 1.2 0 010 1.697L17 11.652a1.2 1.2 0 01-1.697 0l-4.33-4.33a1.2 1.2 0 010-1.697l4.33-4.33zM4.4 15.352a1.2 1.2 0 010-1.697l4.33-4.33a1.2 1.2 0 011.697 0l1.33 1.33a1.2 1.2 0 010 1.697l-4.33 4.33a1.2 1.2 0 01-1.697 0l-1.33-1.33z" />
  </svg>
);
const MetaMaskIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.33 9.53l-2.88-5.3a.5.5 0 00-.86-.1L16.4 8.5v-.02l-4.5-2.9L7.6.13a.5.5 0 00-.86.1L4 5.33l6.5 4.33 4.5-2.9 2.05 1.36.14.09 4.97-3.32a.5.5 0 00.17-.36zM12.02 14.93l-4.52 2.9-2.8-5.18.15.1 7.17-4.7zM16.4 14.88l-4.5 2.9-4.38-2.85v.02l-2.88-5.3a.5.5 0 00-.63.03l-2.2 3.8a.5.5 0 00.22.67l7.15 4.75a.5.5 0 00.5 0l7.17-4.75a.5.5 0 00.22-.67l-2.2-3.8a.5.5 0 00-.63-.03l-2.88 5.3z" />
  </svg>
);
const ENSIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8m-4-4h8" />
  </svg>
);
const EthereumIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 17.97L4.58 11.99l7.364-5.98 7.364 5.98-7.364 5.98zM12 21l-8-6.5V7.5L12 1l8 6.5v7L12 21z" />
  </svg>
);
const PolygonIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.343 3.931l5.657 5.657-5.657 5.657-1.414-1.414L8.515 9.588 4.929 6.002l1.414-2.071zm11.314 0l1.414 2.071-3.586 3.586 3.586 3.586-1.414 1.414-5.657-5.657 5.657-5.657zm-5.657 8.485l-1.414 1.414-3.586-3.586 3.586-3.586 1.414 1.414-2.172 2.172 2.172 2.172z" />
  </svg>
);
const SolanaIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.125 7.5c0-1.24.99-2.25 2.22-2.25h11.31c.64 0 1.23.28 1.65.75l-8.055 8.06c-.42.42-1.01.69-1.65.69H6.345c-1.23 0-2.22-1-2.22-2.25v-4.5zm15.75 9c0 1.24-.99 2.25-2.22 2.25H6.345c-.64 0-1.23-.28-1.65-.75l8.055-8.06c.42-.42 1.01-.69 1.65-.69h1.335c1.23 0 2.22 1 2.22 2.25v4.5z" />
  </svg>
);
const CarvIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.03 15.42l-4.42-4.42 1.41-1.41 3.01 3.01 7.42-7.42 1.41 1.41-8.83 8.83z" />
  </svg>
);
const IPFSIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 16.95V14h2v4.95l-1 0.5-1-0.5zm7.66-10.43l-3.32 1.87-3.34-1.87-1.34.75 4.68 2.63 4.68-2.63-1.36-.75zM4 8.53l8 4.47 8-4.47-8-4.47-8 4.47z" />
  </svg>
);
const CeramicIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM10 17H8v-2h2v2zm0-4H8V9h2v4zm4 4h-2v-2h2v2zm0-4h-2V9h2v4z" />
  </svg>
);
const ReputationBadgeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const SkillSwapIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5M4 21L21 4M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);
// --- End SVG Icon Components ---

const icons = [
  { name: "WalletConnect", svg: <WalletConnectIcon /> },
  { name: "MetaMask", svg: <MetaMaskIcon /> },
  { name: "ENS", svg: <ENSIcon /> },
  { name: "Ethereum", svg: <EthereumIcon /> },
  { name: "Polygon", svg: <PolygonIcon /> },
  { name: "Solana", svg: <SolanaIcon /> },
  { name: "CARV ID", svg: <CarvIcon /> },
  { name: "IPFS", svg: <IPFSIcon /> },
  { name: "Ceramic", svg: <CeramicIcon /> },
  { name: "Reputation Badge", svg: <ReputationBadgeIcon /> },
  { name: "SkillSwap", svg: <SkillSwapIcon /> },
];

const iconRow = [...icons, ...icons];

export default function IntegrationsSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] p-8 sm:p-12 md:p-16 flex flex-col items-center" style={{ margin: '0 0 0 0' }}>
          {/* Scrolling Icon Rows */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            {/* Fade mask */}
            <div className="pointer-events-none absolute inset-0 z-10 flex">
              <div className="w-16 bg-gradient-to-r from-white to-transparent" />
              <div className="flex-1" />
              <div className="w-16 bg-gradient-to-l from-white to-transparent" />
            </div>
            {/* Top Row - scroll left */}
            <div className="overflow-hidden">
              <div className="flex gap-10 animate-scroll-left">
                {iconRow.map((icon, i) => (
                  <div key={`top-${i}`} className="flex-shrink-0 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    {icon.svg}
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom Row - scroll right */}
            <div className="overflow-hidden mt-6">
              <div className="flex gap-10 animate-scroll-right">
                {iconRow.map((icon, i) => (
                  <div key={`bottom-${i}`} className="flex-shrink-0 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    {icon.svg}
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
          width: calc(250px * ${icons.length * 2});
          animation: scrollLeft 40s linear infinite;
        }
        .animate-scroll-right {
          display: flex;
          width: calc(250px * ${icons.length * 2});
          animation: scrollRight 40s linear infinite;
        }
      `}</style>
    </section>
  );
} 