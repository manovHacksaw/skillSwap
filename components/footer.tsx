import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-transparent mt-20">
      <div className="w-full flex justify-center items-center py-16">
        <div className="bg-[#FFF9A3] border-[3px] border-black shadow-[8px_8px_0_0_#000] max-w-3xl w-full mx-4 p-8 sm:p-12 flex flex-col items-center">
          {/* Section Label */}
          <span className="uppercase font-semibold text-xs tracking-widest bg-[#FFE5C2] text-black px-4 py-2 rounded-none mb-4 border-2 border-black shadow-[2px_2px_0_0_#000]" style={{ letterSpacing: '0.08em' }}>
            NEWSLETTER
          </span>
          {/* Heading */}
          <h4 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 uppercase tracking-tight text-center">
            Ready to swap skills?
          </h4>
          {/* Subheading */}
          <p className="text-gray-700 text-center mb-8 max-w-xl mx-auto font-medium">
            The decentralized platform for skill exchange. Connect, learn, and teach in a Web3 environment with on-chain reputation and DAO validation.
          </p>
          {/* Newsletter Form */}
          <form className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center mb-0 w-full max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="border-[3px] border-black rounded-full px-6 py-4 flex-1 min-w-0 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-white"
              required
            />
            <button
              type="submit"
              className="bg-black text-white font-bold px-6 py-4 rounded-full border-[3px] border-black flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-none w-full sm:w-auto -ml-2 sm:ml-0"
              style={{ boxShadow: '0 2px 0 #000' }}
            >
              <span className="sr-only">Subscribe</span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <div className="text-center text-gray-600 mt-8 mb-4">
        <p>&copy; 2024 SkillSwap. Built for the decentralized future.</p>
      </div>
    </footer>
  )
}
