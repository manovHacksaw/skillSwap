"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Calendar,
  MapPin,
  Star,
  Users,
  MessageCircle,
  Shield,
  Wallet,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"
import SkillCard from "@/components/skill-card"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false)

  const profileData = {
    name: "Sarah Chen",
    bio: "Full-stack developer passionate about Web3 and decentralized technologies. Love teaching React and helping others build amazing applications.",
    avatar: "/placeholder.svg?height=120&width=120",
    location: "San Francisco, CA",
    joinDate: "March 2023",
    skillScore: 1250,
    rating: 4.9,
    totalSessions: 89,
    studentsHelped: 156,
    walletAddress: "0xabcd...ef12",
    isVerified: true,
  }

  const skillsOffered = [
    {
      id: "1",
      title: "React & Next.js Development",
      description: "Learn modern React development with Next.js, TypeScript, and best practices.",
      category: "Programming",
      instructor: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      price: 75,
      duration: "2 hours",
      students: 124,
      location: "Online",
      tags: ["React", "Next.js", "TypeScript"],
    },
    {
      id: "2",
      title: "Web3 Development Basics",
      description: "Introduction to blockchain development and smart contracts.",
      category: "Programming",
      instructor: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5.0,
      },
      price: 100,
      duration: "3 hours",
      students: 67,
      location: "Online",
      tags: ["Web3", "Solidity", "Ethereum"],
    },
  ]

  const skillsLearned = [
    { name: "Smart Contract Security", level: 85, category: "Blockchain" },
    { name: "Advanced TypeScript", level: 92, category: "Programming" },
    { name: "System Design", level: 78, category: "Architecture" },
    { name: "UI/UX Design", level: 65, category: "Design" },
  ]

  const achievements = [
    { name: "Top Teacher", description: "Rated 5 stars by 50+ students", icon: Award, color: "text-yellow-600" },
    { name: "Quick Responder", description: "Responds within 2 hours", icon: MessageCircle, color: "text-blue-600" },
    { name: "Verified Expert", description: "Skills verified by community", icon: Shield, color: "text-green-600" },
    { name: "Community Helper", description: "Active in community discussions", icon: Users, color: "text-purple-600" },
  ]

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: '#F9F6F3',
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex flex-col items-center lg:items-start">
                  <Avatar className="w-32 h-32 mb-4 border-2 border-black">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl bg-yellow-400 text-black">{profileData.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-mono text-sm font-medium">{profileData.walletAddress}</span>
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                        <h1 className="text-3xl font-black text-black">{profileData.name}</h1>
                        {profileData.isVerified && <Shield className="w-6 h-6 text-green-600" />}
                      </div>
                      <div className="flex items-center justify-center lg:justify-start space-x-4 text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{profileData.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Joined {profileData.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                      <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Request Session
                      </Button>
                      <Button className="bg-white hover:bg-gray-50 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000]">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 max-w-2xl font-medium">{profileData.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border-2 border-black bg-yellow-50">
                      <div className="text-2xl font-black text-black mb-1">{profileData.skillScore}</div>
                      <div className="text-sm text-gray-600 font-medium">SkillScore</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border-2 border-black bg-blue-50">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-2xl font-black text-black">{profileData.rating}</span>
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Rating</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border-2 border-black bg-green-50">
                      <div className="text-2xl font-black text-black mb-1">{profileData.totalSessions}</div>
                      <div className="text-sm text-gray-600 font-medium">Sessions</div>
                    </div>
                    <div className="text-center p-4 rounded-lg border-2 border-black bg-purple-50">
                      <div className="text-2xl font-black text-black mb-1">{profileData.studentsHelped}</div>
                      <div className="text-sm text-gray-600 font-medium">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isPrivacyEnabled ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <h3 className="text-black font-bold">Profile Visibility</h3>
                    <p className="text-gray-600 text-sm font-medium">Control who can see your skill listings</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrivacyEnabled(!isPrivacyEnabled)}
                  className={`${isPrivacyEnabled ? "border-red-300 text-red-600 bg-red-50" : "border-green-300 text-green-600 bg-green-50"} font-medium border-2 shadow-[2px_2px_0_0_#000]`}
                >
                  {isPrivacyEnabled ? "Private" : "Public"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000]">
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
              >
                Skills Offered
              </TabsTrigger>
              <TabsTrigger 
                value="learning" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
              >
                Skills Learning
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
              >
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsOffered.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-6">
              <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
                <CardHeader>
                  <CardTitle className="text-black font-black">Skills in Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skillsLearned.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-black">{skill.name}</h4>
                          <p className="text-sm text-gray-600">{skill.category}</p>
                        </div>
                        <Badge variant="outline" className="border-2 border-black bg-white">
                          {skill.level}%
                        </Badge>
                      </div>
                      <Progress value={skill.level} className="h-2 border-2 border-black" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.name} className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg border-2 border-black bg-yellow-50`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-black">{achievement.name}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
