import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user to fetch their sessions
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch upcoming sessions (both teaching and learning)
    const upcomingSessions = await prisma.session.findMany({
      where: {
        OR: [{ teacherId: user.id }, { learnerId: user.id }],
        scheduledAt: {
          gte: new Date(),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      include: {
        teacher: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 10,
    });

    // Transform sessions for the frontend
    const transformedSessions = upcomingSessions.map((session) => ({
      id: session.id,
      skill: session.skill,
      participant:
        session.teacherId === user.id ? session.learner : session.teacher,
      type: session.teacherId === user.id ? "teaching" : "learning",
      scheduledAt: session.scheduledAt,
      status: session.status,
      duration: session.duration,
      notes: session.notes,
    }));

    return NextResponse.json({
      upcoming: transformedSessions,
    });
  } catch (error) {
    console.error("SESSIONS_API_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
