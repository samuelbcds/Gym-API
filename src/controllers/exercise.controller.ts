import exerciseService from "../service/exercise.service";
import { Request, Response } from "express";
import { $Enums, Prisma } from "@prisma/client";
import { handleHttpError } from "../utils/errors";

class ExerciseController {
  async createExercise(req: Request, res: Response) {
    const token = req.token_user;
    try {
      const parsedBody = req.validatedBody;
      const newExercise = await exerciseService.createExercise(
        token,
        parsedBody as Prisma.ExerciseCreateInput
      );
      res.status(201).json(newExercise);
    } catch (error) {
      console.error("Error trying to create exercise", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async getExerciseById(req: Request, res: Response) {
    const token = req.token_user;
    try {
      const { exerciseId } = req.validatedParams as { exerciseId: string };
      const exercise = await exerciseService.getExerciseById(token, exerciseId);
      res.status(200).json(exercise);
    } catch (error) {
      console.error("Error trying to get exercise by ID", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async searchExercises(req: Request, res: Response) {
    const token = req.token_user;
    try {
      const filters = req.validatedQuery as {
        id?: string;
        name?: string;
        type?: $Enums.ExerciseType;
        muscleGroups?: $Enums.MuscleGroup[];
        isActive?: boolean;
        page?: number;
        limit?: number;
      };

      const exercises = await exerciseService.searchExercises(token, filters);

      res.status(200).json(exercises);
    } catch (error) {
      console.error("Error searching exercises:", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async updateExercise(req: Request, res: Response) {
    const token = req.token_user;
    try {
      const { exerciseId } = req.validatedParams as { exerciseId: string };
      const updateData = req.validatedBody as Prisma.ExerciseUpdateInput;

      const updatedExercise = await exerciseService.updateExercise(token, exerciseId, updateData);
      res.status(200).json(updatedExercise);
    } catch (error) {
      console.error("Error trying to update exercise", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async softDeleteExercise(req: Request, res: Response) {
    const token = req.token_user;
    try {
      const { exerciseId } = req.validatedParams as { exerciseId: string };
      await exerciseService.softDeleteExercise(token, exerciseId);
      res.status(204).send();
    } catch (error) {
      console.error("Error trying to delete exercise", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }
}
export default new ExerciseController();
