import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default badges
  const badges = await prisma.badge.createMany({
    data: [
      {
        name: "First Teacher",
        description: "Taught your first skill to someone",
        criteria: "Complete first teaching session",
        rarity: "BRONZE",
      },
      {
        name: "First Learner",
        description: "Learned your first skill from someone",
        criteria: "Complete first learning session",
        rarity: "BRONZE",
      },
      {
        name: "Skill Master",
        description: "Completed 10 teaching sessions",
        criteria: "Complete 10 teaching sessions",
        rarity: "SILVER",
      },
      {
        name: "Knowledge Seeker",
        description: "Completed 10 learning sessions",
        criteria: "Complete 10 learning sessions",
        rarity: "SILVER",
      },
      {
        name: "Community Builder",
        description: "Helped 25+ people learn new skills",
        criteria: "Complete 25 teaching sessions",
        rarity: "GOLD",
      },
      {
        name: "Polymath",
        description: "Proficient in 5+ different skill categories",
        criteria: "Add skills in 5+ categories",
        rarity: "GOLD",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${badges.count} badges`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
