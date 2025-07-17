import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Build filter conditions based on the filter parameter
    const whereCondition: any = {
      userId: currentUser.id,
    }

    if (filter !== "all") {
      switch (filter) {
        case "teaching":
          whereCondition.type = {
            in: ["session_taught", "skill_taught_added"],
          }
          break
        case "learning":
          whereCondition.type = {
            in: ["session_learned", "skill_learned_added"],
          }
          break
        case "community":
          whereCondition.type = {
            in: ["community_joined", "review_received"],
          }
          break
        case "achievements":
          whereCondition.type = {
            in: ["badge_earned", "level_up", "milestone_reached"],
          }
          break
      }
    }

    // Fetch activities from database
    const activities = await prisma.activity.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Transform activities for frontend
    const transformedActivities = activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      createdAt: activity.createdAt.toISOString(),
      metadata: activity.metadata,
      icon: activity.icon,
      color: activity.color,
    }))

    return NextResponse.json({
      activities: transformedActivities,
      total: transformedActivities.length,
    })
  } catch (error) {
    console.error("ACTIVITY_API_ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch activity data" }, { status: 500 })
  }
}
