import { type NextRequest, NextResponse } from "next/server"
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
   const user = await currentUser()



    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("DATA RECIEVED", body)
    const { 
      displayName, 
      bio, 
      skillsToTeach, 
      skillsToLearn,
      experienceLevel,
      learningGoals,
      teachingPreferences,
      availabilityHours
    } = body

    if (!displayName) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: true
      }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: "User has already completed onboarding.",
        user: existingUser 
      }, { status: 409 })
    }

    // Create user and skill profiles in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main user record
      const newUser = await tx.user.create({
        data: {
          clerkId: userId,
          email: user.primaryEmailAddress?.emailAddress || "",
          displayName,
          bio: bio || null,
          avatarUrl: user.imageUrl || null,
        },
      })

      // Prepare skill profiles to create
      const skillsToCreate = []
      
      if (skillsToTeach && Array.isArray(skillsToTeach)) {
        for (const skill of skillsToTeach) {
          skillsToCreate.push({
            userId: newUser.id,
            skillName: skill.name,
            skillType: "TEACH" as const,
            category: skill.category,
            xp: skill.experienceLevel || 0,
          })
        }
      }

      if (skillsToLearn && Array.isArray(skillsToLearn)) {
        for (const skill of skillsToLearn) {
          skillsToCreate.push({
            userId: newUser.id,
            skillName: skill.name,
            skillType: "LEARN" as const,
            category: skill.category,
            xp: 0, // Learning skills start with 0 XP
          })
        }
      }
      
      // Create all skill profiles
      if (skillsToCreate.length > 0) {
        await tx.skillProfile.createMany({
          data: skillsToCreate,
        })
      }

      // Fetch the complete user with skill profiles
      const completeUser = await tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          skillProfiles: true
        }
      })

      return completeUser
    })

    return NextResponse.json({
      message: "Onboarding completed successfully",
      user: result,
    })
  } catch (error) {
    console.error("ONBOARDING_API_ERROR:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: "A user with this information already exists." 
        }, { status: 409 })
      }
      return NextResponse.json({ 
        error: "Database error during onboarding.", 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}

// Check if user exists endpoint
export async function GET(request: NextRequest) {
  try {
   const { userId } = await auth()
   const user = await currentUser()


    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: {
          orderBy: { createdAt: 'desc' }
        },
        SessionsTaught: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        SessionsLearned: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ 
      exists: !!existingUser,
      user: existingUser 
    })
  } catch (error) {
    console.error("USER_CHECK_ERROR:", error)
    return NextResponse.json(
      { error: "Failed to check user status" },
      { status: 500 }
    )
  }
}
