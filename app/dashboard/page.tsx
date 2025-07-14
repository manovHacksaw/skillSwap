"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Calendar, Plus, TrendingUp, Users, Star, Wallet } from "lucide-react"
import Link from "next/link"
import SessionCard from "@/components/session-card"

export default function DashboardPage() {
  const userStats = {
    skillScore: 850,
    skillsOffered: 5,
    skillsLearned: 12,
    totalSessions: 47,
    rating: 4.8,
    walletAddress: "0x1234...5678",
  }

  const mySkills = [
    {
      id: "1",
      title: "React Development",
      category: "Programming",
      students: 15,
      rating: 4.9,
      earnings: 450,
    },
    {
      id: "2",
      title: "UI/UX Design",
      category: "Design",
      students: 8,
      rating: 4.7,
      earnings: 320,
    },
    {
      id: "3",
      title: "Smart Contracts",
      category: "Blockchain",
      students: 6,
      rating: 5.0,
      earnings: 600,
    },
  ]

  const upcomingSessions = [
    {
      id: "1",
      title: "React Hooks Deep Dive",
      instructor: {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Dec 15, 2024",
      time: "2:00 PM",
      duration: "1.5 hours",
      type: "online" as const,
      status: "upcoming" as const,
      price: 75,
    },
    {
      id: "2",
      title: "Solidity Fundamentals",
      instructor: {
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Dec 16, 2024",
      time: "10:00 AM",
      duration: "2 hours",
      type: "online" as const,
      status: "upcoming" as const,
      price: 100,
    },
  ]

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Dashboard</h1>
              <p className="text-gray-600 font-medium">Welcome back! Here's your learning overview.</p>
            </div>
            <Link href="/create-skill">
              <Button className="btn-primary mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                New Skill
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* User Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="card-clean">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-black text-black mb-2">John Doe</h2>
                  <p className="text-gray-600 mb-3 font-medium">Full-Stack Developer & Blockchain Enthusiast</p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-mono text-sm font-medium">{userStats.walletAddress}</span>
                    </div>
                    <Badge className="bg-black text-white font-semibold">
                      <Award className="w-3 h-3 mr-1" />
                      SkillScore: {userStats.skillScore}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-black font-medium">{userStats.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="card-clean">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Skills Offered</p>
                  <p className="text-2xl font-black text-black">{userStats.skillsOffered}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-clean">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Skills Learned</p>
                  <p className="text-2xl font-black text-black">{userStats.skillsLearned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-clean">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Sessions</p>
                  <p className="text-2xl font-black text-black">{userStats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-clean">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">SkillScore</p>
                  <p className="text-2xl font-black text-black">{userStats.skillScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center justify-between">
                  My Skill Listings
                  <Link href="/create-skill">
                    <Button size="sm" className="btn-secondary">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mySkills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-black">{skill.title}</h3>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700 font-semibold">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{skill.students} students</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="font-medium">{skill.rating}</span>
                        </div>
                      </div>
                      <span className="text-green-600 font-bold">${skill.earnings}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center justify-between">
                  Upcoming Sessions
                  <Link href="/sessions">
                    <Button size="sm" className="btn-secondary">
                      <Calendar className="w-4 h-4 mr-1" />
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Reputation Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="card-clean">
            <CardHeader>
              <CardTitle className="text-black font-black">Reputation & SkillScore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Teaching Score</span>
                    <span className="text-black font-bold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Learning Score</span>
                    <span className="text-black font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Community Score</span>
                    <span className="text-black font-bold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-400 text-black font-semibold">
                  <Award className="w-3 h-3 mr-1" />
                  Top Teacher
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 font-semibold">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Quick Learner
                </Badge>
                <Badge className="bg-green-100 text-green-700 font-semibold">
                  <Users className="w-3 h-3 mr-1" />
                  Community Helper
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
