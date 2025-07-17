import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user with all related data needed for dashboard
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: {
          orderBy: { createdAt: "desc" },
        },
        SessionsTaught: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            learner: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        SessionsLearned: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            teacher: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        userBadges: {
          include: {
            badge: true,
          },
          orderBy: { earnedAt: "desc" },
        },
        activities: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
        reviewsReceived: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            reviewer: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has completed onboarding
    if (user.onboardingStatus !== "complete") {
      return NextResponse.json(
        {
          error: "Onboarding not completed",
          redirectTo: "/onboard",
        },
        { status: 403 },
      )
    }

    // Calculate derived stats
    const teachingSkills = user.skillProfiles.filter((s) => s.skillType === "TEACH")
    const learningSkills = user.skillProfiles.filter((s) => s.skillType === "LEARN")

    const completedSessionsTaught = user.SessionsTaught.filter((s) => s.status === "COMPLETED").length
    const completedSessionsLearned = user.SessionsLearned.filter((s) => s.status === "COMPLETED").length
    const completedSessions = completedSessionsTaught + completedSessionsLearned

    // Calculate total XP from skill profiles
    const totalXP = user.skillProfiles.reduce((sum, skill) => sum + skill.xp, 0)

    // Calculate average rating from reviews
    const averageRating =
      user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / user.reviewsReceived.length
        : 0

    // Update user stats if they've changed
    if (user.totalXP !== totalXP || Math.abs(user.rating - averageRating) > 0.01) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP,
          rating: averageRating,
        },
      })
    }

    // Generate analytics data
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get weekly XP progress (mock data for now, but structure for real implementation)
    const weeklyXP = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000)
      // In a real implementation, you'd query activities or XP changes for each day
      return Math.floor(Math.random() * 50) + totalXP / 7 // Simulated daily XP
    })

    // Get skill progress for top teaching skills
    const skillProgress = teachingSkills.slice(0, 5).map((skill) => ({
      skill: skill.skillName,
      progress: Math.min(skill.xp, 100),
    }))

    // Get session trends for the last 7 days
    const sessionTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000)
      return {
        date: date.toISOString().split("T")[0],
        sessions: Math.floor(Math.random() * 3) + 1, // Mock data
      }
    })

    // Get category distribution
    const categoryDistribution = Object.entries(
      [...teachingSkills, ...learningSkills].reduce((acc: any, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1
        return acc
      }, {}),
    ).map(([category, count]) => ({ category, count: count as number }))

    // Transform data for frontend
    const dashboardData = {
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        reputation: user.reputation,
        rating: averageRating,
        totalXP,
        skillsTeaching: teachingSkills.length,
        skillsLearning: learningSkills.length,
        sessionsCompleted: completedSessions,
        nftCertificates: user.userBadges.length,
      },
      skills: {
        teaching: teachingSkills.map((skill) => ({
          id: skill.id,
          skillName: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency || "Intermediate",
          xp: skill.xp,
          sessionsCount: skill.sessionsCount,
        })),
        learning: learningSkills.map((skill) => ({
          id: skill.id,
          skillName: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency || "Beginner",
          xp: skill.xp,
          sessionsCount: skill.sessionsCount,
        })),
      },
      recentSessions: {
        taught: user.SessionsTaught.slice(0, 5).map((session) => ({
          id: session.id,
          skill: session.skill,
          learner: session.learner,
          status: session.status,
          createdAt: session.createdAt.toISOString(),
          scheduledAt: session.scheduledAt?.toISOString(),
        })),
        learned: user.SessionsLearned.slice(0, 5).map((session) => ({
          id: session.id,
          skill: session.skill,
          teacher: session.teacher,
          status: session.status,
          createdAt: session.createdAt.toISOString(),
          scheduledAt: session.scheduledAt?.toISOString(),
        })),
      },
      badges:
        user.userBadges?.map((userBadge) => ({
          id: userBadge.badge.id,
          name: userBadge.badge.name,
          description: userBadge.badge.description,
          rarity: userBadge.badge.rarity,
          earnedAt: userBadge.earnedAt.toISOString(),
        })) || [],
      activities:
        user.activities?.map((activity) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          createdAt: activity.createdAt.toISOString(),
          metadata: activity.metadata,
          icon: activity.icon,
          color: activity.color,
        })) || [],
      reviews: user.reviewsReceived.slice(0, 3).map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewer: review.reviewer,
        createdAt: review.createdAt.toISOString(),
      })),
      analytics: {
        weeklyXP,
        skillProgress,
        sessionTrends,
        categoryDistribution,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("DASHBOARD_API_ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
