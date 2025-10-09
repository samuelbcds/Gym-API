import ExerciseRepository from "../repository/exercises.repository";
import { Prisma, $Enums } from "@prisma/client";
import { NotFoundError } from "../utils/errors";
import userService from "./user.service";

class ExerciseService {
  async createExercise(token: { id: string; role: string }, data: Prisma.ExerciseCreateInput) {
    userService.checkIsAdmin(token);
    return ExerciseRepository.createExercise(data);
  }

  async getExerciseById(token: { id: string; role: string }, exerciseId: string) {
    userService.checkIsPersonalTrainerOrAdmin(token);
    const exercise = await ExerciseRepository.findExerciseById(exerciseId);
    if (!exercise) {
      throw new NotFoundError();
    }
    return exercise;
  }

  async searchExercises(
    token: { id: string; role: string },
    filters: {
      id?: string;
      name?: string;
      type?: $Enums.ExerciseType;
      muscleGroups?: $Enums.MuscleGroup[];
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    userService.checkIsPersonalTrainerOrAdmin(token);

    const { id, name, type, muscleGroups, isActive = true, page = 1, limit = 100 } = filters;

    const whereCondition: Prisma.ExerciseWhereInput = {
      isActive,
    };

    if (id) whereCondition.id = id;
    if (name) whereCondition.name = { contains: name, mode: "insensitive" };
    if (type) whereCondition.type = type;
    if (muscleGroups && muscleGroups.length > 0) {
      whereCondition.muscleGroup = { hasEvery: muscleGroups };
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = { name: "asc" as Prisma.SortOrder };

    return ExerciseRepository.findExercises(whereCondition, skip, take, orderBy);
  }

  async updateExercise(
    token: { id: string; role: string },
    exerciseId: string,
    data: Prisma.ExerciseUpdateInput
  ) {
    userService.checkIsAdmin(token);
    return ExerciseRepository.updateExerciseById(exerciseId, data);
  }

  async softDeleteExercise(token: { id: string; role: string }, exerciseId: string) {
    userService.checkIsAdmin(token);
    return ExerciseRepository.softDeleteExerciseById(exerciseId);
  }
}

export default new ExerciseService();
