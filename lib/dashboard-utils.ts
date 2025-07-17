import { prisma } from "@/lib/prisma"

export async function createActivity(
  userId: string,
  type: string,
  title: string,
  description?: string,
  metadata?: any,
) {
  try {
    // Determine icon and color based on activity type
    let icon = "activity"
    let color = "bg-gray-500"

    switch (type) {
      case "session_completed":
      case "session_taught":
      case "session_learned":
        icon = "book-open"
        color = "bg-green-500"
        break
      case "badge_earned":
      case "level_up":
      case "milestone_reached":
        icon = "award"
        color = "bg-yellow-500"
        break
      case "skill_added":
      case "skill_taught_added":
      case "skill_learned_added":
        icon = "plus-circle"
        color = "bg-blue-500"
        break
      case "review_received":
        icon = "star"
        color = "bg-purple-500"
        break
      case "community_joined":
        icon = "users"
        color = "bg-green-500"
        break
      default:
        icon = "activity"
        color = "bg-gray-500"
    }

    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        title,
        description,
        icon,
        color,
        metadata,
      },
    })

    return activity
  } catch (error) {
    console.error("Error creating activity:", error)
    throw error
  }
}

export async function updateUserStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillProfiles: true,
        SessionsTaught: {
          where: { status: "COMPLETED" },
        },
        SessionsLearned: {
          where: { status: "COMPLETED" },
        },
        reviewsReceived: true,
      },
    })

    if (!user) return

    // Calculate total XP
    const totalXP = user.skillProfiles.reduce((sum, skill) => sum + skill.xp, 0)

    // Calculate average rating
    const averageRating =
      user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / user.reviewsReceived.length
        : 0

    // Calculate reputation based on various factors
    const completedSessions = user.SessionsTaught.length + user.SessionsLearned.length
    const reputation = Math.min(
      100,
      Math.floor(totalXP * 0.1 + averageRating * 10 + completedSessions * 2 + user.skillProfiles.length * 5),
    )

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP,
        rating: averageRating,
        reputation,
      },
    })

    return { totalXP, rating: averageRating, reputation }
  } catch (error) {
    console.error("Error updating user stats:", error)
    throw error
  }
}

export async function getRealtimeMetrics(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillProfiles: true,
        SessionsTaught: true,
        SessionsLearned: true,
        userBadges: true,
        activities: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) return null

    const teachingSkills = user.skillProfiles.filter((s) => s.skillType === "TEACH")
    const learningSkills = user.skillProfiles.filter((s) => s.skillType === "LEARN")
    const completedSessions =
      user.SessionsTaught.filter((s) => s.status === "COMPLETED").length +
      user.SessionsLearned.filter((s) => s.status === "COMPLETED").length

    return {
      totalXP: user.totalXP,
      reputation: user.reputation,
      rating: user.rating,
      skillsTeaching: teachingSkills.length,
      skillsLearning: learningSkills.length,
      sessionsCompleted: completedSessions,
      badges: user.userBadges.length,
      lastActivity: user.activities[0]?.createdAt || user.updatedAt,
    }
  } catch (error) {
    console.error("Error getting realtime metrics:", error)
    return null
  }
}
