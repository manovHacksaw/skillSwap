"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, TrendingUp, Users, Award } from "lucide-react"
import FeedItem from "@/components/feed-item"
import { Badge } from "@/components/ui/badge"

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const mockFeedItems = [
    {
      id: "1",
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        skillScore: 1250,
      },
      type: "skill_learned" as const,
      content: "Just completed an advanced React course! Excited to apply these new concepts in my projects.",
      skill: "React Development",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: false,
    },
    {
      id: "2",
      user: {
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        skillScore: 890,
      },
      type: "skill_taught" as const,
      content: "Had an amazing session teaching UI/UX design principles. My student created their first wireframe!",
      skill: "UI/UX Design",
      timestamp: "4 hours ago",
      likes: 31,
      comments: 12,
      isLiked: true,
    },
    {
      id: "3",
      user: {
        name: "Elena Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        skillScore: 1450,
      },
      type: "achievement" as const,
      content: "Reached 1000+ SkillScore! Thank you to everyone who has supported my learning journey.",
      timestamp: "6 hours ago",
      likes: 67,
      comments: 23,
      isLiked: false,
    },
    {
      id: "4",
      user: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        skillScore: 1100,
      },
      type: "endorsement" as const,
      content: "Received an endorsement for Smart Contract Development from the DAO community!",
      skill: "Smart Contracts",
      timestamp: "8 hours ago",
      likes: 45,
      comments: 15,
      isLiked: true,
    },
    {
      id: "5",
      user: {
        name: "Jake Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        skillScore: 720,
      },
      type: "skill_learned" as const,
      content: "Started learning Spanish today! Looking forward to practicing conversation skills.",
      skill: "Spanish Language",
      timestamp: "12 hours ago",
      likes: 18,
      comments: 6,
      isLiked: false,
    },
  ]

  const filteredItems = mockFeedItems.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.skill && item.skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab = activeTab === "all" || item.type === activeTab

    return matchesSearch && matchesTab
  })

  const stats = [
    {
      label: "Active Learners",
      value: "2,847",
      icon: <Users className="w-6 h-6 text-black" />,
      change: "+12%",
    },
    {
      label: "Skills Shared",
      value: "1,234",
      icon: <Award className="w-6 h-6 text-black" />,
      change: "+8%",
    },
    {
      label: "Sessions Today",
      value: "156",
      icon: <TrendingUp className="w-6 h-6 text-black" />,
      change: "+24%",
    },
  ]

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: '#F9F6F3',
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Activity Feed</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Stay updated with the latest learning activities and achievements from our community
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-black text-black">{stat.value}</p>
                    <p className="text-green-600 text-sm font-medium">{stat.change} from yesterday</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg border-2 border-black">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search activities, users, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-2 border-black text-black placeholder:text-gray-500 bg-white"
                      />
                    </div>
                    <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000]">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feed Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000]">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
                  >
                    All Activities
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skill_learned" 
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
                  >
                    Skills Learned
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skill_taught" 
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
                  >
                    Skills Taught
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievement" 
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
                  >
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="endorsement" 
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold"
                  >
                    Endorsements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <FeedItem item={item} />
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">No activities found</h3>
                <p className="text-gray-600 mb-6 font-medium">Try adjusting your search or browse all activities</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Trending Topics */}
            <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
              <CardHeader>
                <CardTitle className="text-black font-black">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["React Development", "Web3", "UI/UX Design", "Smart Contracts", "Spanish Language"].map((topic) => (
                  <div key={topic} className="flex items-center justify-between p-3 rounded-lg border-2 border-black bg-gray-50">
                    <span className="font-medium text-black">{topic}</span>
                    <Badge variant="outline" className="border-2 border-black bg-white">
                      Hot
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
              <CardHeader>
                <CardTitle className="text-black font-black">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg border-2 border-black bg-yellow-50">
                  <div className="text-2xl font-black text-black">15,847</div>
                  <div className="text-sm text-gray-600 font-medium">Total Members</div>
                </div>
                <div className="text-center p-4 rounded-lg border-2 border-black bg-blue-50">
                  <div className="text-2xl font-black text-black">2,341</div>
                  <div className="text-sm text-gray-600 font-medium">Active Sessions</div>
                </div>
                <div className="text-center p-4 rounded-lg border-2 border-black bg-green-50">
                  <div className="text-2xl font-black text-black">89%</div>
                  <div className="text-sm text-gray-600 font-medium">Success Rate</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
