import { PrismaClient, ExerciseType, MuscleGroup } from "@prisma/client";
import auth from "../../config/auth";

const prisma = new PrismaClient();

async function seedFirstAdmin() {
  const existingAdmin = await prisma.admin.findFirst();

  if (existingAdmin) {
    console.log("Admin user already exists, skipping seed...");
    return;
  }

  const adminEmail = "admin@gym.com.br";
  const adminPassword = "12345678";
  const adminName = "System Administrator";

  console.log("Creating first admin user...");

  try {
    const { hash, salt } = auth.generatePassword(adminPassword);

    const admin = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          hash,
          salt,
          role: "ADMIN",
          admin: {
            create: {},
          },
        },
        include: {
          admin: true,
        },
        omit: {
          hash: true,
          salt: true,
        },
      });

      console.log(`Admin user created successfully`);
      return user;
    });

    return admin;
  } catch (error) {
    console.error("Failed to create admin user:", error);
    throw error;
  }
}

async function seedExercises() {
  const existingExercises = await prisma.exercise.count();

  if (existingExercises > 0) {
    console.log(`${existingExercises} exercises already exist, skipping seed...`);
    return;
  }

  console.log("Creating exercise samples...");

  const exercises = [
    {
      name: "Barbell Bench Press",
      description: "A compound exercise that targets the chest, shoulders, and triceps",
      videoUrl: "https://example.com/videos/bench-press",
      type: ExerciseType.STRENGTH,
      muscleGroup: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.ARMS],
      isActive: true,
    },
    {
      name: "Deadlift",
      description: "A powerful compound movement that works the entire posterior chain.",
      videoUrl: "https://example.com/videos/deadlift",
      type: ExerciseType.STRENGTH,
      muscleGroup: [MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.ARMS],
      isActive: true,
    },
    {
      name: "Treadmill Interval Running",
      description:
        "Alternate between periods of high-intensity running and recovery periods of walking or jogging.",
      videoUrl: "https://example.com/videos/interval-running",
      type: ExerciseType.CARDIO,
      muscleGroup: [MuscleGroup.LEGS, MuscleGroup.FULL_BODY],
      isActive: true,
    },
  ];

  try {
    const createdExercises = await prisma.$transaction(
      exercises.map((exercise) =>
        prisma.exercise.create({
          data: exercise,
        })
      )
    );

    console.log(`Created ${createdExercises.length} exercise samples successfully`);
    return createdExercises;
  } catch (error) {
    console.error("Failed to create exercise samples:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting database seed...");

  await seedFirstAdmin();
  await seedExercises();

  console.log("✅ Seed completed successfully");
}

main()
  .catch((error: Error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
