import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user's clerkId
    const { userId: currentClerkId } = await auth();

    if (!currentClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check if the username already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      // If a user with this username exists, check if it belongs to the current authenticated user
      if (existingUser.clerkId === currentClerkId) {
        // The username belongs to the current user, so it's unique for them (they are not changing it to someone else's)
        return NextResponse.json({ isUnique: true }, { status: 200 });
      } else {
        // The username exists and belongs to a different user, so it's not unique
        return NextResponse.json({ isUnique: false }, { status: 200 });
      }
    } else {
      // If no user with this username exists, it's unique
      return NextResponse.json({ isUnique: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the operation
  }
}
