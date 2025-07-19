import { type NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    const { userId } = await auth();
    const user = await currentUser();
    console.log("User from Clerk:", user);
    console.log(userId);

    return NextResponse.json(
      { message: "User from clerk", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("ONBOARDING_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to onboard user" },
      { status: 500 },
    );
  }
}

// Check if user exists endpoint
export async function GET(request: NextRequest) {
 try {
  const {userId} = await auth();
  console.log(userId)

  if(!userId){
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    return NextResponse.json(
      { exists: false, onboarded: false,  user: null },
      { status: 200 },
    );
  }

  // If user exists, return user data
  console.log("Existing user found:", existingUser);

  if(existingUser && existingUser.hasOnboarded ){
    return NextResponse.json(
      { exists: true, onboarded: true, user: existingUser },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { exists: true, onboarded: false, user: existingUser },
    { status: 200 },
  );

  

  
 
 } catch (error) {
   console.error("USER_CHECK_ERROR:", error);
   return NextResponse.json(
     { error: "Failed to check user status" },
     { status: 500 },
   );
 }
}
