"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import Link from "next/link"

export default function AnimatedHeroSection() {
  return (
    <>
      <section className="py-20 px-4 relative">
        {/* Floating medal emoji on the left, mirroring the climber on the right */}
        <div className="absolute top-24 left-1/4 z-10 animate-float text-5xl select-none pointer-events-none flex flex-col items-center">
          <span>🏅</span>
        </div>
        {/* Floating man climbing emoji closer to the heading */}
        <div className="absolute top-24 right-1/4 z-10 animate-float text-5xl select-none pointer-events-none flex flex-col items-center">
          <span>🧗‍♂️</span>
        </div>
        {/* Floating SBT coin in the middle right side */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 z-10 animate-float select-none pointer-events-none flex flex-col items-center" style={{ width: '3.5rem', height: '3.5rem' }}>
          <span className="text-5xl relative">
            🪙
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-black" style={{letterSpacing: '0.05em'}}>SBT</span>
          </span>
        </div>
        {/* Floating teacher hat emoji between climber and SBT, slightly more right */}
        <div className="absolute top-1/3 right-[18%] z-10 animate-float select-none pointer-events-none flex flex-col items-center" style={{ width: '3.5rem', height: '3.5rem' }}>
          <span className="text-5xl">🎓</span>
        </div>
        {/* Floating lock with ZK shield emoji on the left, mirroring the teacher hat */}
        <div className="absolute top-1/3 left-[18%] z-10 animate-float select-none pointer-events-none flex flex-col items-center" style={{ width: '3.5rem', height: '3.5rem' }}>
          <span className="text-5xl relative">
            🔒
            <span className="relative">
              🛡️
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-black" style={{letterSpacing: '0.05em'}}>ZK</span>
            </span>
          </span>
        </div>
        {/* Floating custom progress bar (no background, only bars) on the left side, mirroring the SBT coin */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 z-10 animate-float select-none pointer-events-none flex flex-col items-center" style={{ width: '3.5rem', height: '3.5rem' }}>
          <svg width="56" height="24" viewBox="0 0 56 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="10" width="10" height="14" rx="2" fill="#FBBF24" />
            <rect x="12" y="6" width="10" height="18" rx="2" fill="#34D399" />
            <rect x="24" y="2" width="10" height="22" rx="2" fill="#60A5FA" />
            <rect x="36" y="8" width="10" height="16" rx="2" fill="#F472B6" />
            <rect x="48" y="14" width="10" height="10" rx="2" fill="#A78BFA" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block bg-[#FFE5C2] border-2 border-black px-6 py-2 rounded-none font-bold uppercase text-sm tracking-wider mb-8 shadow-[3px_3px_0_0_#000]" style={{letterSpacing: '0.08em'}}>
            DECENTRALIZED SKILL EXCHANGE
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight uppercase" style={{letterSpacing: '-0.03em'}}>
              LEARN, TEACH, AND<br />EARN IN WEB3
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
              Connect with amazing teachers and students in our decentralized learning community. Build your on-chain reputation while sharing knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-0">
              <Link href="/skills">
                <Button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-lg px-10 py-4 rounded-none mr-0 sm:mr-4 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95 flex items-center justify-center hover:scale-105 hover:shadow-lg" style={{ boxShadow: '3px 3px 0 0 #000' }}>
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-black font-bold text-lg px-4 py-4 rounded-none border-none shadow-none hover:scale-105 hover:shadow-lg transition-all duration-150 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
                  Dashboard
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Removed the entire problem cards section below */}
      <style jsx>{`
        .animate-float {
          animation: floatY 2.5s ease-in-out infinite;
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
        }
        .arrow-path {
          animation: wiggle 1.5s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 6; }
        }
      `}</style>
    </>
  )
}
