import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      skillId,
      instructorId,
      date,
      time,
      sessionType,
      location,
      notes,
      paymentMethod,
      price
    } = body

    // Validate required fields
    if (!skillId || !instructorId || !date || !time || !sessionType || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the learner (current user)
    const learner = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!learner) {
      return NextResponse.json(
        { error: "Learner not found" },
        { status: 404 }
      )
    }

    // Get the teacher
    const teacher = await prisma.user.findUnique({
      where: { id: instructorId }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      )
    }

    // Check if user is trying to book their own session
    if (learner.id === teacher.id) {
      return NextResponse.json(
        { error: "You cannot book a session with yourself" },
        { status: 400 }
      )
    }

    // Parse and validate date/time
    const scheduledAt = new Date(`${date}T${time}`)
    
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { error: "Session must be scheduled for a future date and time" },
        { status: 400 }
      )
    }

    // Check for conflicting sessions
    const conflictingSession = await prisma.session.findFirst({
      where: {
        OR: [
          { teacherId: teacher.id },
          { learnerId: learner.id }
        ],
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - 60 * 60 * 1000), // 1 hour before
          lte: new Date(scheduledAt.getTime() + 60 * 60 * 1000)  // 1 hour after
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (conflictingSession) {
      return NextResponse.json(
        { error: "There's a conflicting session at this time" },
        { status: 409 }
      )
    }

    // Create the session
    const session = await prisma.session.create({
      data: {
        skill: skillId,
        teacherId: teacher.id,
        learnerId: learner.id,
        scheduledAt,
        duration: 60, // Default 60 minutes
        notes: notes || null,
        status: "PENDING"
      },
      include: {
        teacher: {
          select: {
            displayName: true,
            avatarUrl: true
          }
        },
        learner: {
          select: {
            displayName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Create activity record for the learner
    await prisma.activity.create({
      data: {
        userId: learner.id,
        type: "session_booked",
        title: "Session Booked",
        description: `Booked a session with ${teacher.displayName}`,
        icon: "calendar",
        color: "bg-blue-500",
        metadata: {
          sessionId: session.id,
          skillId,
          instructorName: teacher.displayName,
          scheduledAt: scheduledAt.toISOString()
        }
      }
    })

    // Create activity record for the teacher
    await prisma.activity.create({
      data: {
        userId: teacher.id,
        type: "session_requested",
        title: "Session Requested",
        description: `${learner.displayName} requested a session`,
        icon: "users",
        color: "bg-green-500",
        metadata: {
          sessionId: session.id,
          skillId,
          learnerName: learner.displayName,
          scheduledAt: scheduledAt.toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        skill: session.skill,
        scheduledAt: session.scheduledAt,
        status: session.status,
        teacher: session.teacher,
        learner: session.learner
      }
    })

  } catch (error) {
    console.error("BOOK_SESSION_API_ERROR:", error)
    return NextResponse.json(
      { error: "Failed to book session" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get("skillId")
    const instructorId = searchParams.get("instructorId")

    if (!skillId || !instructorId) {
      return NextResponse.json(
        { error: "Skill ID and instructor ID are required" },
        { status: 400 }
      )
    }

    // Get instructor details
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        rating: true,
        SessionsTaught: {
          where: {
            status: "COMPLETED"
          }
        }
      }
    })

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      )
    }

    // Get instructor's availability (mock data for now)
    const availability = {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      timeSlots: [
        "09:00", "10:00", "11:00", "12:00", "13:00", 
        "14:00", "15:00", "16:00", "17:00", "18:00"
      ]
    }

    return NextResponse.json({
      instructor: {
        ...instructor,
        totalSessions: instructor.SessionsTaught.length
      },
      availability
    })

  } catch (error) {
    console.error("GET_BOOKING_INFO_ERROR:", error)
    return NextResponse.json(
      { error: "Failed to get booking information" },
      { status: 500 }
    )
  }
} 