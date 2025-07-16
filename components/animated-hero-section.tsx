"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import Link from "next/link"

export default function AnimatedHeroSection() {
  return (
    <>
      <section className="py-20 px-4">
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
                <Button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-lg px-10 py-4 rounded-none mr-0 sm:mr-4 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95 flex items-center justify-center" style={{ boxShadow: '3px 3px 0 0 #000' }}>
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-black font-bold text-lg px-4 py-4 rounded-none border-none shadow-none hover:underline inline-flex items-center justify-center">
                  Dashboard
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Removed the entire problem cards section below */}
    </>
  )
}
