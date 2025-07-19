import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { validateCompleteForm, sanitizeFormData } from "@/lib/validation-utils"

export async function POST(request: NextRequest) {
 try {
   const { userId: currentClerkId } = await auth();
   const user = await currentUser();
   console.log(user)

   if (!currentClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {formData} = await request.json();

    const {name, username, bio, avatarUrl, interests, socialLinks, learningGoals,  preferredLanguages,  occupation,location,  timezone,

      ageGroup, skillsOffered,  userIntent, userAvailability, walletAddress} 
    = formData;


    
    // Validate essential fields that are required by your Prisma schema
    if (!name || !username || !timezone || !ageGroup) { // Assuming ageGroup is now mandatory
      return NextResponse.json({ error: "Missing required fields (name, username, timezone, ageGroup)" }, { status: 400 });
    }


    const updatedUser = await prisma.user.upsert({
      where: { clerkId: currentClerkId },
      update:{
        name, 
        username,
        bio, avatarUrl, interests, socialLinks, learningGoals, preferredLanguages,
        occupation, location, timezone, ageGroup, skillsOffered, userIntent, userAvailability,
        walletAddress, hasOnboarded: true
      }, 
      create:{
         clerkId: currentClerkId,
        email: user.emailAddresses[0].emailAddress, // You might need to get this from Clerk user object or handle differently
        name: name,
        username: username,
        timezone: timezone,
        ageGroup: ageGroup,
      }
    });


     return NextResponse.json({ message: "Onboarding successful", updatedUser}, { status: 200 })
  

 } catch (error) {
  console.error("Error during onboarding:", error);
    // More specific error handling could be added based on error type (e.g., PrismaClientKnownRequestError for unique constraint violations)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
 }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ exists: false, onboarded: false, user: null }, { status: 200 })
    }

    return NextResponse.json(
      {
        exists: true,
        onboarded: existingUser.hasOnboarded,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          username: existingUser.username,
          email: existingUser.email,
          hasOnboarded: existingUser.hasOnboarded,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("USER_CHECK_ERROR:", error)
    return NextResponse.json({ error: "Failed to check user status", code: "INTERNAL_ERROR" }, { status: 500 })
  }
}
