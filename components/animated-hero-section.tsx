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
      {/* Feature Cards Section */}
      <section className="py-12 px-4 bg-white mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <BookOpen className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Learn Skills</h3>
              <p className="text-gray-600 font-medium">Discover new skills from expert instructors</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Teach Others</h3>
              <p className="text-gray-600 font-medium">Share your expertise and earn rewards</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Build Reputation</h3>
              <p className="text-gray-600 font-medium">Earn on-chain credentials and recognition</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
