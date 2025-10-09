import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class ExerciseRepository {
  async createExercise(data: Prisma.ExerciseCreateInput) {
    return prisma.exercise.create({ data });
  }

  async findExerciseById(exerciseId: string) {
    return prisma.exercise.findUnique({ where: { id: exerciseId } });
  }

  async findExercises(
    whereCondition: Prisma.ExerciseWhereInput,
    skip: number,
    take: number,
    orderBy: Prisma.ExerciseFindManyArgs["orderBy"]
  ) {
    return prisma.exercise.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy,
    });
  }

  async updateExerciseById(exerciseId: string, data: Prisma.ExerciseUpdateInput) {
    return prisma.exercise.update({ where: { id: exerciseId }, data });
  }

  async softDeleteExerciseById(exerciseId: string) {
    return prisma.exercise.update({
      where: { id: exerciseId },
      data: { isActive: false },
    });
  }
}

export default new ExerciseRepository();
