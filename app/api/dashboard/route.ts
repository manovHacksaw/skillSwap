import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user with all related data needed for dashboard
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        skillProfiles: {
          orderBy: { createdAt: "desc" },
        },
        SessionsTaught: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            learner: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        SessionsLearned: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            teacher: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        userBadges: {
          include: {
            badge: true,
          },
          orderBy: { earnedAt: "desc" },
        },
        activities: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
        reviewsReceived: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            reviewer: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has completed onboarding
    if (user.onboardingStatus !== "complete") {
      return NextResponse.json(
        {
          error: "Onboarding not completed",
          redirectTo: "/onboard",
        },
        { status: 403 },
      );
    }

    // Calculate derived stats
    const teachingSkills = user.skillProfiles.filter(
      (s) => s.skillType === "TEACH",
    );
    const learningSkills = user.skillProfiles.filter(
      (s) => s.skillType === "LEARN",
    );
    const completedSessions =
      user.SessionsTaught.filter((s) => s.status === "COMPLETED").length +
      user.SessionsLearned.filter((s) => s.status === "COMPLETED").length;

    // Calculate total XP from skill profiles
    const totalXP = user.skillProfiles.reduce(
      (sum, skill) => sum + skill.xp,
      0,
    );

    // Calculate average rating from reviews
    const averageRating =
      user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0) /
          user.reviewsReceived.length
        : 0;

    // Update user stats if they've changed
    if (user.totalXP !== totalXP || user.rating !== averageRating) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP,
          rating: averageRating,
        },
      });
    }

    // Transform data for frontend
    const dashboardData = {
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        reputation: user.reputation,
        rating: averageRating,
        totalXP,
        skillsTeaching: teachingSkills.length,
        skillsLearning: learningSkills.length,
        sessionsCompleted: completedSessions,
        nftCertificates: user.userBadges.length,
      },
      skills: {
        teaching: teachingSkills.map((skill) => ({
          id: skill.id,
          skillName: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency,
          xp: skill.xp,
          sessionsCount: skill.sessionsCount,
        })),
        learning: learningSkills.map((skill) => ({
          id: skill.id,
          skillName: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency,
          xp: skill.xp,
          sessionsCount: skill.sessionsCount,
        })),
      },
      recentSessions: {
        taught: user.SessionsTaught.slice(0, 5).map((session) => ({
          id: session.id,
          skill: session.skill,
          learner: session.learner,
          status: session.status,
          createdAt: session.createdAt,
          scheduledAt: session.scheduledAt,
        })),
        learned: user.SessionsLearned.slice(0, 5).map((session) => ({
          id: session.id,
          skill: session.skill,
          teacher: session.teacher,
          status: session.status,
          createdAt: session.createdAt,
          scheduledAt: session.scheduledAt,
        })),
      },
      badges: user.userBadges.map((userBadge) => ({
        id: userBadge.badge.id,
        name: userBadge.badge.name,
        description: userBadge.badge.description,
        rarity: userBadge.badge.rarity,
        earnedAt: userBadge.earnedAt,
      })),
      activities: user.activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        createdAt: activity.createdAt,
        metadata: activity.metadata,
      })),
      reviews: user.reviewsReceived.slice(0, 3).map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewer: review.reviewer,
        createdAt: review.createdAt,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("DASHBOARD_API_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
