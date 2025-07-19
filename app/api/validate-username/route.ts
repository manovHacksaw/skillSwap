import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { available: false, message: "Username must be at least 3 characters long" },
        { status: 400 },
      )
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    })

    if (existingUser) {
      return NextResponse.json({ available: false, message: "Username is already taken" }, { status: 200 })
    }

    return NextResponse.json({ available: true, message: "Username is available" }, { status: 200 })
  } catch (error) {
    console.error("Username validation error:", error)
    return NextResponse.json({ available: false, message: "Error validating username" }, { status: 500 })
  }
}
