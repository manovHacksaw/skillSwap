"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  Award,
  Calendar,
  Clock,
  Star,
  Zap,
  Shield,
  Settings,
  Bell,
  Edit3,
  Plus,
  Trophy,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import { toast } from "sonner"
import { DashboardSkeleton } from "./dashboard-skeleton"

interface DashboardData {
  user: {
    id: string
    displayName: string
    username?: string
    bio?: string
    avatarUrl?: string
    reputation: number
    rating: number
    totalXP: number
    skillsTeaching: number
    skillsLearning: number
    sessionsCompleted: number
    nftCertificates: number
  }
  skills: {
    teaching: Array<{
      id: string
      skillName: string
      category: string
      proficiency: string
      xp: number
      sessionsCount: number
    }>
    learning: Array<{
      id: string
      skillName: string
      category: string
      proficiency: string
      xp: number
      sessionsCount: number
    }>
  }
  recentSessions: {
    taught: Array<{
      id: string
      skill: string
      learner: { displayName: string; avatarUrl?: string }
      status: string
      createdAt: string
      scheduledAt?: string
    }>
    learned: Array<{
      id: string
      skill: string
      teacher: { displayName: string; avatarUrl?: string }
      status: string
      createdAt: string
      scheduledAt?: string
    }>
  }
  badges: Array<{
    id: string
    name: string
    description: string
    rarity: string
    earnedAt: string
  }>
  activities: Array<{
    id: string
    type: string
    title: string
    description?: string
    createdAt: string
    metadata?: any
    icon: string
    color: string
  }>
  reviews: Array<{
    id: string
    rating: number
    comment?: string
    reviewer: { displayName: string; avatarUrl?: string }
    createdAt: string
  }>
  analytics: {
    weeklyXP: number[]
    skillProgress: Array<{ skill: string; progress: number }>
    sessionTrends: Array<{ date: string; sessions: number }>
    categoryDistribution: Array<{ category: string; count: number }>
  }
}

interface UpcomingSession {
  id: string
  skill: string
  participant: {
    displayName: string
    avatarUrl?: string
  }
  type: "teaching" | "learning"
  scheduledAt: string
  status: string
  duration: number
  notes?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null)
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")

      if (response.status === 403) {
        const data = await response.json()
        if (data.redirectTo) {
          router.push(data.redirectTo)
          return
        }
      }

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()

      // Add mock analytics data for demonstration
      const enhancedData = {
        ...data,
        analytics: {
          weeklyXP: [120, 150, 180, 200, 170, 220, 250],
          skillProgress: data.skills.teaching.slice(0, 5).map((skill: any) => ({
            skill: skill.skillName,
            progress: Math.min(skill.xp, 100),
          })),
          sessionTrends: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            sessions: Math.floor(Math.random() * 5) + 1,
          })),
          categoryDistribution: Object.entries(
            [...data.skills.teaching, ...data.skills.learning].reduce((acc: any, skill: any) => {
              acc[skill.category] = (acc[skill.category] || 0) + 1
              return acc
            }, {}),
          ).map(([category, count]) => ({ category, count: count as number })),
        },
      }

      setDashboardData(enhancedData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    }
  }

  // Fetch upcoming sessions
  const fetchUpcomingSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      if (!response.ok) {
        throw new Error("Failed to fetch sessions data")
      }

      const data = await response.json()
      setUpcomingSessions(data.upcoming || [])
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  // Fetch activities
  const fetchActivities = async (filterType = "all") => {
    try {
      const response = await fetch(`/api/activity?filter=${filterType}&limit=10`)
      if (!response.ok) {
        throw new Error("Failed to fetch activity data")
      }

      const data = await response.json()
      setFilteredActivities(data.activities || [])
    } catch (error) {
      console.error("Error fetching activities:", error)
    }
  }

  // Refresh all data
  const refreshData = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchDashboardData(), fetchUpcomingSessions()])
    setIsRefreshing(false)
    toast.success("Dashboard updated!")
  }

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/auth")
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchDashboardData(), fetchUpcomingSessions()])
      setIsLoading(false)
    }

    loadData()

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(
      () => {
        fetchDashboardData()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [isSignedIn, isLoaded, router])

  // Add real-time polling for metrics
  useEffect(() => {
    if (!dashboardData) return

    const pollMetrics = async () => {
      try {
        const response = await fetch("/api/dashboard/metrics")
        if (response.ok) {
          const metrics = await response.json()
          setRealtimeMetrics(metrics)
        }
      } catch (error) {
        console.error("Error polling metrics:", error)
      }
    }

    // Poll every 30 seconds for real-time updates
    const metricsInterval = setInterval(pollMetrics, 30000)

    return () => clearInterval(metricsInterval)
  }, [dashboardData])

  // Helper functions
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Tomorrow"
    if (diffDays <= 7) return `${diffDays} days`
    return date.toLocaleDateString()
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case "book-open":
        return <BookOpen className="w-4 h-4" />
      case "award":
        return <Award className="w-4 h-4" />
      case "star":
        return <Star className="w-4 h-4" />
      case "users":
        return <Users className="w-4 h-4" />
      case "plus-circle":
        return <Plus className="w-4 h-4" />
      case "target":
        return <Target className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getChangeIndicator = (current: number, previous: number) => {
    if (current > previous) return { icon: ArrowUp, color: "text-green-600", text: "increase" }
    if (current < previous) return { icon: ArrowDown, color: "text-red-600", text: "decrease" }
    return { icon: Minus, color: "text-gray-600", text: "no change" }
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Unable to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Real-time Updates */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent rounded-xl border-2 border-black shadow-lg p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-black">
                <AvatarImage
                  src={dashboardData.user.avatarUrl || user?.imageUrl}
                  alt={dashboardData.user.displayName}
                />
                <AvatarFallback className="bg-yellow-400 text-black font-bold text-xl">
                  {dashboardData.user.displayName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-black">{dashboardData.user.displayName}</h1>
                  <Badge className="bg-yellow-400 text-black font-bold">
                    <Shield className="w-3 h-3 mr-1" />
                    {dashboardData.user.reputation}
                  </Badge>
                </div>
                {dashboardData.user.username && (
                  <p className="text-gray-600 font-medium">@{dashboardData.user.username}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-black">{dashboardData.user.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dashboardData.user.skillsTeaching} skills taught · {dashboardData.user.skillsLearning} skills
                    learning
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-black bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-black bg-transparent">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Total XP",
              value: dashboardData.user.totalXP,
              icon: Zap,
              color: "text-yellow-600",
              bgColor: "bg-yellow-50",
              change: 12,
            },
            {
              title: "Sessions Completed",
              value: dashboardData.user.sessionsCompleted,
              icon: BookOpen,
              color: "text-blue-600",
              bgColor: "bg-blue-50",
              change: 3,
            },
            {
              title: "Reputation Score",
              value: dashboardData.user.reputation,
              icon: Shield,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
              change: 5,
            },
            {
              title: "Badges Earned",
              value: dashboardData.user.nftCertificates,
              icon: Award,
              color: "text-green-600",
              bgColor: "bg-green-50",
              change: 1,
            },
          ].map((metric, index) => {
            const ChangeIcon = getChangeIndicator(metric.value, metric.value - metric.change).icon
            const changeColor = getChangeIndicator(metric.value, metric.value - metric.change).color

            return (
              <Card key={metric.title} className="border-2 border-black shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-3xl font-black text-black">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ChangeIcon className={`w-3 h-3 ${changeColor}`} />
                        <span className={`text-xs ${changeColor}`}>{metric.change} from last week</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skills Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Your Teaching Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.skills.teaching.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.skills.teaching.slice(0, 3).map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <div>
                                <h3 className="font-bold text-black">{skill.skillName}</h3>
                                <p className="text-sm text-gray-600">{skill.category}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="border-green-600 text-green-600">
                                  {skill.proficiency}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">{skill.xp} XP</p>
                              </div>
                            </div>
                          ))}
                          {dashboardData.skills.teaching.length > 3 && (
                            <Button variant="outline" className="w-full bg-transparent">
                              View All {dashboardData.skills.teaching.length} Skills
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Zap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="mb-4">No teaching skills added yet</p>
                          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Add Your First Skill</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        Upcoming Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingSessions.slice(0, 3).map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={session.participant.avatarUrl || "/placeholder.svg"} />
                                  <AvatarFallback>{session.participant.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold text-black">
                                    {session.type === "teaching" ? "Teaching" : "Learning"} {session.skill}
                                  </h3>
                                  <p className="text-sm text-gray-600">with {session.participant.displayName}</p>
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(session.scheduledAt)}
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                                Join
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="mb-4">No upcoming sessions</p>
                          <Button className="bg-purple-500 hover:bg-purple-600 text-white">Book a Session</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                  <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.activities.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.activities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
                                {getActivityIcon(activity.icon)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-black">{activity.title}</p>
                                {activity.description && (
                                  <p className="text-xs text-gray-600">{activity.description}</p>
                                )}
                                <p className="text-xs text-gray-500">{formatRelativeTime(activity.createdAt)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>No recent activity</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <div className="text-3xl font-black text-black">{dashboardData.user.reputation}</div>
                        <div className="text-sm text-gray-600">Reputation Score</div>
                      </div>

                      {dashboardData.badges.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {dashboardData.badges.slice(0, 4).map((badge) => (
                            <div key={badge.id} className="text-center">
                              <div
                                className={`aspect-square ${
                                  badge.rarity === "GOLD"
                                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                    : badge.rarity === "SILVER"
                                      ? "bg-gradient-to-br from-gray-300 to-gray-500"
                                      : "bg-gradient-to-br from-amber-600 to-amber-800"
                                } rounded-lg border-2 border-black flex items-center justify-center`}
                              >
                                <Award className="w-6 h-6 text-black" />
                              </div>
                              <p className="text-xs font-medium text-center mt-1 truncate">{badge.name}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Complete sessions to earn badges</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-500" />
                      Teaching Skills ({dashboardData.skills.teaching.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.skills.teaching.map((skill) => (
                        <div key={skill.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-black">{skill.skillName}</h3>
                              <p className="text-sm text-gray-600">{skill.category}</p>
                            </div>
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              {skill.proficiency}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Progress value={skill.xp} className="w-24 h-2" />
                              <span className="text-xs text-gray-600">{skill.xp} XP</span>
                            </div>
                            <span className="text-xs text-gray-600">{skill.sessionsCount} sessions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Learning Skills ({dashboardData.skills.learning.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.skills.learning.map((skill) => (
                        <div key={skill.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-black">{skill.skillName}</h3>
                              <p className="text-sm text-gray-600">{skill.category}</p>
                            </div>
                            <Badge variant="outline" className="border-blue-600 text-blue-600">
                              {skill.proficiency}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Progress value={skill.xp} className="w-24 h-2" />
                              <span className="text-xs text-gray-600">{skill.xp}%</span>
                            </div>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                              Continue
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle>Sessions You've Taught</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentSessions.taught.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={session.learner.avatarUrl || "/placeholder.svg"} />
                              <AvatarFallback>{session.learner.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-black">{session.skill}</h4>
                              <p className="text-sm text-gray-600">with {session.learner.displayName}</p>
                            </div>
                          </div>
                          <Badge
                            variant={session.status === "COMPLETED" ? "default" : "outline"}
                            className={session.status === "COMPLETED" ? "bg-green-100 text-green-800" : ""}
                          >
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle>Sessions You've Learned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentSessions.learned.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={session.teacher.avatarUrl || "/placeholder.svg"} />
                              <AvatarFallback>{session.teacher.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-black">{session.skill}</h4>
                              <p className="text-sm text-gray-600">with {session.teacher.displayName}</p>
                            </div>
                          </div>
                          <Badge
                            variant={session.status === "COMPLETED" ? "default" : "outline"}
                            className={session.status === "COMPLETED" ? "bg-blue-100 text-blue-800" : ""}
                          >
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      XP Progress (Last 7 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {dashboardData.analytics.weeklyXP.map((xp, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div
                            className="bg-yellow-400 rounded-t-md min-w-8 transition-all duration-300 hover:bg-yellow-500"
                            style={{ height: `${(xp / Math.max(...dashboardData.analytics.weeklyXP)) * 200}px` }}
                          />
                          <span className="text-xs text-gray-600">{xp}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString("en", {
                              weekday: "short",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Skill Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.analytics.categoryDistribution.map((category, index) => (
                        <div key={category.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                            />
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={
                                (category.count /
                                  Math.max(...dashboardData.analytics.categoryDistribution.map((c) => c.count))) *
                                100
                              }
                              className="w-20 h-2"
                            />
                            <span className="text-sm text-gray-600">{category.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Top Skills Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.analytics.skillProgress.map((skill) => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-sm text-gray-600">{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
