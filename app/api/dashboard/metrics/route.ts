import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getRealtimeMetrics } from "@/lib/dashboard-utils"
import { prisma } from "@/lib/prisma" // Declare the prisma variable

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the current user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const metrics = await getRealtimeMetrics(user.id)

    if (!metrics) {
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("METRICS_API_ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch real-time metrics" }, { status: 500 })
  }
}
