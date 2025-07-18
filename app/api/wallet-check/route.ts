import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 },
      );
    }

    // Check if wallet address exists and belongs to a different user
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: address },
      select: { clerkId: true, displayName: true },
    });

    const exists = existingUser && existingUser.clerkId !== userId;

    return NextResponse.json({
      exists,
      isCurrentUser: existingUser?.clerkId === userId,
    });
  } catch (error) {
    console.error("WALLET_CHECK_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to check wallet status" },
      { status: 500 },
    );
  }
}
