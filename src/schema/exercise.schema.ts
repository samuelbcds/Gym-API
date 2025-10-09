import { $Enums } from "@prisma/client";
import z from "zod";

class ExerciseSchema {
  createExercise = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    videoUrl: z.url().optional(),
    type: z.enum($Enums.ExerciseType),
    muscleGroup: z.array(z.enum($Enums.MuscleGroup)),
  });

  getExerciseById = z.object({
    exerciseId: z.uuid(),
  });

  updateExerciseData = z.object({
    name: z.string().min(3).optional(),
    type: z.enum($Enums.ExerciseType).optional(),
    muscleWorked: z.array(z.enum($Enums.MuscleGroup)).optional(),
  });

  deleteExercise = z.object({
    exerciseId: z.uuid(),
  });

  searchExercisesRaw = z.object({
    id: z.uuid().optional(),
    name: z.string().optional(),
    type: z.enum($Enums.ExerciseType).optional(),
    muscleGroups: z.union([z.string(), z.array(z.string())]).optional(),
    isActive: z.union([z.literal("true"), z.literal("false"), z.boolean()]).optional(),
    page: z.union([z.string().regex(/^\d+$/), z.number().int()]).optional(),
    limit: z.union([z.string().regex(/^\d+$/), z.number().int()]).optional(),
  });

  searchExercises = z.object({
    id: z.uuid().optional(),
    name: z.string().optional(),
    type: z.enum($Enums.ExerciseType).optional(),
    muscleGroups: z
      .union([z.enum($Enums.MuscleGroup), z.array(z.enum($Enums.MuscleGroup))])
      .optional(),
    isActive: z.boolean().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  });
}

export default new ExerciseSchema();
