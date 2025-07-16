import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
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
    const {
      displayName,
      username,
      bio,
      interests,
      linkedinUrl,
      githubUrl,
      twitterUrl,
      occupation,
      ageGroup,
      hobbies,
      skillsToTeach,
      skillsToLearn,
      motivations,
      availableTimings,
      walletAddress,
      walletSignature,
    } = body

    if (!displayName) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 })
    }

    if (!walletAddress || !walletSignature) {
      return NextResponse.json({ error: "Wallet connection is required" }, { status: 400 })
    }

    if (!skillsToTeach || skillsToTeach.length === 0) {
      return NextResponse.json({ error: "At least one teaching skill is required" }, { status: 400 })
    }

    if (!skillsToLearn || skillsToLearn.length === 0) {
      return NextResponse.json({ error: "At least one learning skill is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: true,
      },
    })

    if (existingUser && existingUser.hasOnboarded) {
      return NextResponse.json(
        {
          error: "User has already completed onboarding.",
          user: existingUser,
        },
        { status: 409 },
      )
    }

    // Create user and skill profiles in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or update the main user record
      const userData = {
        clerkId: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        displayName,
        username: username || null,
        bio: bio || null,
        avatarUrl: user.imageUrl || null,
        occupation: occupation || null,
        ageGroup: ageGroup || null,
        interests: interests || [],
        hobbies: hobbies || [],
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        twitterUrl: twitterUrl || null,
        motivations: motivations || [],
        availableTimings: availableTimings || [],
        walletAddress,
        walletSignature,
        signatureHash: walletSignature, // Store signature as hash for now
        onboardingStatus: "complete",
      }

      const newUser = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: userData,
          })
        : await tx.user.create({
            data: userData,
          })

      // Clear existing skill profiles if updating
      if (existingUser) {
        await tx.skillProfile.deleteMany({
          where: { userId: existingUser.id },
        })
      }

      // Prepare skill profiles to create
      const skillsToCreate = []

      if (skillsToTeach && Array.isArray(skillsToTeach)) {
        for (const skill of skillsToTeach) {
          skillsToCreate.push({
            userId: newUser.id,
            skillName: skill.name,
            skillType: "TEACH" as const,
            category: skill.category,
            proficiency: skill.proficiency || "Intermediate",
            xp: skill.proficiency === "Expert" ? 100 : skill.proficiency === "Intermediate" ? 50 : 25,
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
            proficiency: "Beginner",
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
          skillProfiles: true,
        },
      })

      return completeUser
    })

    return NextResponse.json({
      message: "Onboarding completed successfully! Welcome to SkillSwap!",
      user: result,
    })
  } catch (error) {
    console.error("ONBOARDING_API_ERROR:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[]
        if (target?.includes("username")) {
          return NextResponse.json({ error: "Username is already taken. Please choose another." }, { status: 409 })
        }
        if (target?.includes("walletAddress")) {
          return NextResponse.json({ error: "This wallet is already connected to another account." }, { status: 409 })
        }
        return NextResponse.json({ error: "A user with this information already exists." }, { status: 409 })
      }
      return NextResponse.json(
        {
          error: "Database error during onboarding.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}

// Check if user exists endpoint
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: {
          orderBy: { createdAt: "desc" },
        },
        SessionsTaught: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        SessionsLearned: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return NextResponse.json({
      exists: !!existingUser,
      user: existingUser,
    })
  } catch (error) {
    console.error("USER_CHECK_ERROR:", error)
    return NextResponse.json({ error: "Failed to check user status" }, { status: 500 })
  }
}
