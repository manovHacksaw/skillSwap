"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import Link from "next/link"

export default function AnimatedHeroSection() {
  return (
    <>
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="badge-accent inline-block mb-6">DECENTRALIZED SKILL EXCHANGE</div>

            <h1 className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight">
              LEARN, TEACH, AND
              <br />
              EARN IN WEB3
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
              Connect with amazing teachers and students in our decentralized learning community. Build your on-chain
              reputation while sharing knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/skills">
                <Button className="btn-primary text-lg px-8 py-4">
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button className="btn-secondary text-lg px-8 py-4">Dashboard</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Problem Cards Section */}
      <div className="flex flex-col items-center justify-center py-16 bg-background">
        <span className="mb-2 px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold text-xs tracking-widest">
          PROBLEM
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          LEARNING NEW SKILLS SHOULDN’T BE CENTRALIZED
        </h2>
        <p className="text-center max-w-xl text-muted-foreground mb-10">
          Today’s learning platforms gatekeeping knowledge, hide credentials behind paywalls, and don’t respect your data. SkillSwap empowers peer-to-peer learning with on-chain reputation you own.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="bg-white border-2 border-black rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">📚</span>
            <h3 className="font-bold text-lg mb-2">CENTRALIZED CONTROL</h3>
            <p className="text-muted-foreground">
              Skills and reputation are locked in closed platforms.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border-2 border-black rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🔒</span>
            <h3 className="font-bold text-lg mb-2">NO VERIFIABLE CREDENTIALS</h3>
            <p className="text-muted-foreground">
              There's no way to prove you taught or learned transparently.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border-2 border-black rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">💰</span>
            <h3 className="font-bold text-lg mb-2">NO FAIR INCENTIVES</h3>
            <p className="text-muted-foreground">
              Mentors and learners don’t earn or own their impact.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
