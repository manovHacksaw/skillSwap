import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: {
          orderBy: { createdAt: "desc" },
        },
        SessionsTaught: {
          include: {
            learner: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        SessionsLearned: {
          include: {
            teacher: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate user statistics
    const teachingSkills = user.skillProfiles.filter((skill) => skill.skillType === "TEACH")
    const learningSkills = user.skillProfiles.filter((skill) => skill.skillType === "LEARN")
    const completedSessions = [
      ...user.SessionsTaught.filter((session) => session.status === "COMPLETED"),
      ...user.SessionsLearned.filter((session) => session.status === "COMPLETED"),
    ]

    const stats = {
      skillsTeaching: teachingSkills.length,
      skillsLearning: learningSkills.length,
      totalSessions: user.SessionsTaught.length + user.SessionsLearned.length,
      completedSessions: completedSessions.length,
      totalXP: user.skillProfiles.reduce((total, skill) => total + skill.xp, 0),
      badges: 0, // Will be calculated based on achievements
    }

    // Calculate skill score based on XP and completed sessions
    const skillScore = Math.min(1000, 100 + stats.totalXP + completedSessions.length * 50)

    // Get recent activity
    const recentSessions = [...user.SessionsTaught, ...user.SessionsLearned]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Calculate progress metrics
    const profileCompleteness = calculateProfileCompleteness(user)
    const firstSessionProgress = stats.completedSessions > 0 ? 100 : 0
    const communityProgress = Math.min(100, (stats.totalSessions / 5) * 100)

    return NextResponse.json({
      user,
      stats,
      skillScore,
      recentSessions,
      progress: {
        profile: profileCompleteness,
        firstSession: firstSessionProgress,
        community: communityProgress,
      },
      teachingSkills,
      learningSkills,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateProfileCompleteness(user: any): number {
  let completeness = 0
  const fields = [user.displayName, user.bio, user.avatarUrl, user.occupation, user.ageGroup, user.walletAddress]

  fields.forEach((field) => {
    if (field) completeness += 16.67 // 100/6 fields
  })

  return Math.round(completeness)
}
