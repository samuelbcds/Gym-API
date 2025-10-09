import { describe, expect, it, vi, beforeEach } from "vitest";
import exerciseService from "./exercise.service";
import exerciseRepository from "../repository/exercises.repository";
import userService from "./user.service";
import { $Enums } from "@prisma/client";
import { AuthenticationError, ForbiddenError, NotFoundError } from "../utils/errors";
describe("ExerciseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createExercise", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should call checkIsAdmin before creating an exercise", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseData = {
        name: "Push-ups",
        description: "Classic upper body exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST, $Enums.MuscleGroup.ARMS],
      };
      vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);
      vi.spyOn(exerciseRepository, "createExercise").mockResolvedValue({
        id: "exercise1",
        name: "Push-ups",
        description: "Classic upper body exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST, $Enums.MuscleGroup.ARMS],
        videoUrl: "https://example.com/push-ups.mp4",
        isActive: true,
        createdAt: new Date("2022-01-01T00:00:00Z"),
        updatedAt: new Date("2022-01-01T00:00:00Z"),
      });

      const result = await exerciseService.createExercise(token, exerciseData);

      expect(userService.checkIsAdmin).toHaveBeenCalledWith(token);
      expect(result).toEqual({
        id: "exercise1",
        name: "Push-ups",
        description: "Classic upper body exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST, $Enums.MuscleGroup.ARMS],
        videoUrl: "https://example.com/push-ups.mp4",
        isActive: true,
        createdAt: new Date("2022-01-01T00:00:00Z"),
        updatedAt: new Date("2022-01-01T00:00:00Z"),
      });
    });

    it("should throw ForbiddenError if user is not admin", async () => {
      const token = { id: "user1", role: "CUSTOMER" };
      const exerciseData = {
        name: "Push-ups",
        description: "Classic upper body exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST],
      };

      vi.spyOn(userService, "checkIsAdmin").mockImplementation(() => {
        throw new Error("ForbiddenError");
      });

      await expect(exerciseService.createExercise(token, exerciseData)).rejects.toThrow(
        "ForbiddenError"
      );
    });

    it("should return the created exercise", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseData = {
        name: "Squats",
        description: "Leg strengthening exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.LEGS],
        videoUrl: "https://example.com/squats.mp4",
      };

      const mockExercise = {
        id: "exercise1",
        name: "Squats",
        description: "Leg strengthening exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.LEGS],
        videoUrl: "https://example.com/squats.mp4",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(exerciseRepository, "createExercise").mockResolvedValue(mockExercise);

      const result = await exerciseService.createExercise(token, exerciseData);

      expect(result).toEqual(mockExercise);
    });
  });

  describe("getExerciseById", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should call checkIsPersonalTrainerOrAdmin before fetching exercise", async () => {
      const token = { id: "personal1", role: "PERSONAL" };
      const exerciseId = "exercise1";

      const mockExercise = {
        id: exerciseId,
        name: "Push-ups",
        description: "Classic upper body exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST],
        videoUrl: null,
        isActive: true,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
      };

      vi.spyOn(exerciseRepository, "findExerciseById").mockResolvedValue(mockExercise);
      const checkSpy = vi.spyOn(userService, "checkIsPersonalTrainerOrAdmin");
      await exerciseService.getExerciseById(token, exerciseId);

      expect(checkSpy).toHaveBeenCalledWith(token);
    });

    it("should throw ForbiddenError if user is not admin or personal trainer", async () => {
      const token = { id: "user1", role: "CUSTOMER" };
      const exerciseId = "exercise1";

      vi.spyOn(userService, "checkIsPersonalTrainerOrAdmin").mockImplementation(() => {
        throw new ForbiddenError();
      });

      await expect(exerciseService.getExerciseById(token, exerciseId)).rejects.toThrow(
        new ForbiddenError()
      );
    });

    it("should throw NotFoundError if exercise does not exist", async () => {
      const token = { id: "personal1", role: "PERSONAL" };
      const exerciseId = "nonexistent";

      vi.spyOn(exerciseRepository, "findExerciseById").mockResolvedValue(null);

      await expect(exerciseService.getExerciseById(token, exerciseId)).rejects.toThrow(
        new NotFoundError()
      );
    });

    it("should return the exercise if it exists", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";

      const mockExercise = {
        id: exerciseId,
        name: "Deadlift",
        description: "Full body compound exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.BACK, $Enums.MuscleGroup.LEGS],
        videoUrl: "https://example.com/deadlift.mp4",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(exerciseRepository, "findExerciseById").mockResolvedValue(mockExercise);

      const result = await exerciseService.getExerciseById(token, exerciseId);

      expect(result).toEqual(mockExercise);
    });
  });

  describe("searchExercises", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should call checkIsPersonalTrainerOrAdmin before searching", async () => {
      const token = { id: "personal1", role: "PERSONAL" };
      const filters = {};

      const checkSpy = vi
        .spyOn(userService, "checkIsPersonalTrainerOrAdmin")
        .mockResolvedValue(true);
      vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(checkSpy).toHaveBeenCalledWith(token);
    });

    it("should throw ForbiddenError if user is not admin or personal trainer", async () => {
      const token = { id: "user1", role: "CUSTOMER" };
      const filters = {};

      vi.spyOn(userService, "checkIsPersonalTrainerOrAdmin").mockImplementation(() => {
        throw new ForbiddenError();
      });

      await expect(exerciseService.searchExercises(token, filters)).rejects.toThrow(
        new ForbiddenError()
      );
    });

    it("should apply default values for isActive, page, and limit", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const filters = {};

      const findSpy = vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(findSpy).toHaveBeenCalledWith({ isActive: true }, 0, 100, { name: "asc" });
    });

    it("should build correct whereCondition with all filters", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const filters = {
        id: "exercise1",
        name: "Push",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroups: [$Enums.MuscleGroup.CHEST, $Enums.MuscleGroup.ARMS],
        isActive: false,
        page: 2,
        limit: 50,
      };

      const findSpy = vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(findSpy).toHaveBeenCalledWith(
        {
          isActive: false,
          id: "exercise1",
          name: { contains: "Push", mode: "insensitive" },
          type: $Enums.ExerciseType.STRENGTH,
          muscleGroup: { hasEvery: [$Enums.MuscleGroup.CHEST, $Enums.MuscleGroup.ARMS] },
        },
        50,
        50,
        { name: "asc" }
      );
    });

    it("should handle name filter with case-insensitive search", async () => {
      const token = { id: "personal1", role: "PERSONAL" };
      const filters = {
        name: "squat",
      };

      const findSpy = vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(findSpy).toHaveBeenCalledWith(
        {
          isActive: true,
          name: { contains: "squat", mode: "insensitive" },
        },
        0,
        100,
        { name: "asc" }
      );
    });

    it("should only add muscleGroup filter when array is not empty", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const filters = {
        muscleGroups: [],
      };

      const findSpy = vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(findSpy).toHaveBeenCalledWith({ isActive: true }, 0, 100, { name: "asc" });
    });

    it("should calculate correct skip value for pagination", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const filters = {
        page: 3,
        limit: 25,
      };

      const findSpy = vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue([]);

      await exerciseService.searchExercises(token, filters);

      expect(findSpy).toHaveBeenCalledWith({ isActive: true }, 50, 25, { name: "asc" });
    });

    it("should return exercises from repository", async () => {
      const token = { id: "personal1", role: "PERSONAL" };
      const filters = {};

      const mockExercises = [
        {
          id: "exercise1",
          name: "Push-ups",
          description: "Upper body",
          type: $Enums.ExerciseType.STRENGTH,
          muscleGroup: [$Enums.MuscleGroup.CHEST],
          videoUrl: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "exercise2",
          name: "Squats",
          description: "Lower body",
          type: $Enums.ExerciseType.STRENGTH,
          muscleGroup: [$Enums.MuscleGroup.LEGS],
          videoUrl: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.spyOn(exerciseRepository, "findExercises").mockResolvedValue(mockExercises);

      const result = await exerciseService.searchExercises(token, filters);

      expect(result).toEqual(mockExercises);
    });
  });

  describe("updateExercise", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should call checkIsAdmin before updating exercise", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";
      const updateData = {
        name: "Modified Push-ups",
        description: "Updated description",
      };

      const mockUpdatedExercise = {
        id: exerciseId,
        name: "Modified Push-ups",
        description: "Updated description",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST],
        videoUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const checkSpy = vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);
      vi.spyOn(exerciseRepository, "updateExerciseById").mockResolvedValue(mockUpdatedExercise);

      await exerciseService.updateExercise(token, exerciseId, updateData);

      expect(checkSpy).toHaveBeenCalledWith(token);
    });

    it("should throw AuthenticationError if token is missing", async () => {
      const token = null as unknown as { id: string; role: string };
      const exerciseId = "exercise1";
      const updateData = { name: "New name" };

      vi.spyOn(userService, "checkIsAdmin").mockImplementation(() => {
        throw new AuthenticationError();
      });

      await expect(exerciseService.updateExercise(token, exerciseId, updateData)).rejects.toThrow(
        new AuthenticationError()
      );
    });

    it("should throw ForbiddenError if user is not admin", async () => {
      const token = { id: "user1", role: "CUSTOMER" };
      const exerciseId = "exercise1";
      const updateData = { name: "New name" };

      vi.spyOn(userService, "checkIsAdmin").mockImplementation(() => {
        throw new ForbiddenError();
      });

      await expect(exerciseService.updateExercise(token, exerciseId, updateData)).rejects.toThrow(
        new ForbiddenError()
      );
    });

    it("should call repository with correct parameters", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";
      const updateData = {
        name: "Burpees",
        description: "Full body cardio",
        type: $Enums.ExerciseType.CARDIO,
      };

      const updateSpy = vi.spyOn(exerciseRepository, "updateExerciseById").mockResolvedValue({
        id: exerciseId,
        name: "Burpees",
        description: "Full body cardio",
        type: $Enums.ExerciseType.CARDIO,
        muscleGroup: [$Enums.MuscleGroup.FULL_BODY],
        videoUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await exerciseService.updateExercise(token, exerciseId, updateData);

      expect(updateSpy).toHaveBeenCalledWith(exerciseId, updateData);
    });

    it("should return the updated exercise", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";
      const updateData = { name: "Updated Exercise" };

      const mockUpdatedExercise = {
        id: exerciseId,
        name: "Updated Exercise",
        description: "Some description",
        type: $Enums.ExerciseType.FLEXIBILITY,
        muscleGroup: [$Enums.MuscleGroup.CORE],
        videoUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(exerciseRepository, "updateExerciseById").mockResolvedValue(mockUpdatedExercise);

      const result = await exerciseService.updateExercise(token, exerciseId, updateData);

      expect(result).toEqual(mockUpdatedExercise);
    });
  });

  describe("softDeleteExercise", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should call checkIsAdmin before soft deleting exercise", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";

      const mockDeletedExercise = {
        id: exerciseId,
        name: "To be deleted",
        description: "Exercise",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.CHEST],
        videoUrl: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const checkSpy = vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);

      vi.spyOn(exerciseRepository, "softDeleteExerciseById").mockResolvedValue(mockDeletedExercise);

      await exerciseService.softDeleteExercise(token, exerciseId);

      expect(checkSpy).toHaveBeenCalledWith(token);
    });

    it("should throw ForbiddenError if user is not admin", async () => {
      const token = { id: "user1", role: "CUSTOMER" };
      const exerciseId = "exercise1";

      vi.spyOn(userService, "checkIsAdmin").mockImplementation(() => {
        throw new ForbiddenError();
      });

      await expect(exerciseService.softDeleteExercise(token, exerciseId)).rejects.toThrow(
        new ForbiddenError()
      );
    });

    it("should throw AuthenticationError if token is missing", async () => {
      const token = null as unknown as { id: string; role: string };
      const exerciseId = "exercise1";
      vi.spyOn(userService, "checkIsAdmin").mockImplementation(() => {
        throw new AuthenticationError();
      });
      await expect(exerciseService.softDeleteExercise(token, exerciseId)).rejects.toThrow(
        new AuthenticationError()
      );
    });
    it("should call repository softDeleteExerciseById with correct exerciseId", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";

      const deleteSpy = vi.spyOn(exerciseRepository, "softDeleteExerciseById").mockResolvedValue({
        id: exerciseId,
        name: "Deleted Exercise",
        description: "Exercise to delete",
        type: $Enums.ExerciseType.STRENGTH,
        muscleGroup: [$Enums.MuscleGroup.ARMS],
        videoUrl: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await exerciseService.softDeleteExercise(token, exerciseId);

      expect(deleteSpy).toHaveBeenCalledWith(exerciseId);
    });

    it("should return the soft deleted exercise with isActive false", async () => {
      const token = { id: "admin1", role: "ADMIN" };
      const exerciseId = "exercise1";

      const mockDeletedExercise = {
        id: exerciseId,
        name: "Deleted Exercise",
        description: "This exercise is now inactive",
        type: $Enums.ExerciseType.CARDIO,
        muscleGroup: [$Enums.MuscleGroup.LEGS],
        videoUrl: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(exerciseRepository, "softDeleteExerciseById").mockResolvedValue(mockDeletedExercise);

      const result = await exerciseService.softDeleteExercise(token, exerciseId);

      expect(result).toEqual(mockDeletedExercise);
      expect(result.isActive).toBe(false);
    });
  });
});
