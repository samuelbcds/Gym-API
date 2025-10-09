import { $Enums } from "@prisma/client";
import { ValidationError } from "./errors";

export const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ValidationError("Boolean value must be 'true' or 'false'");
};

export const parseNumber = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) throw new ValidationError("Value must be a number");
  return parsed;
};

export const parseNumberWithRange = (
  value: string | undefined,
  min: number,
  max: number
): number | undefined => {
  if (value === undefined) return undefined;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) throw new ValidationError("Value must be a number");

  if (parsed < min || parsed > max) {
    throw new ValidationError(`Value must be between ${min} and ${max}`);
  }

  return parsed;
};

export const parseMuscleGroups = (
  value: string | string[] | undefined
): $Enums.MuscleGroup[] | undefined => {
  if (value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.map((group) => validateMuscleGroup(group));
  }

  if (value.includes("AND")) {
    return value.split("AND").map((group) => validateMuscleGroup(group));
  }

  return [validateMuscleGroup(value)];
};

export const parseUserRole = (value: string | undefined): $Enums.UserRole | undefined => {
  if (value === undefined) return undefined;

  const upperValue = value.toUpperCase();

  if (Object.values($Enums.UserRole).includes(upperValue as $Enums.UserRole)) {
    return upperValue as $Enums.UserRole;
  }

  throw new ValidationError(`Invalid user role: ${value}`);
};

const validateMuscleGroup = (value: string): $Enums.MuscleGroup => {
  const upperValue = value.toUpperCase();

  if (Object.values($Enums.MuscleGroup).includes(upperValue as $Enums.MuscleGroup)) {
    return upperValue as $Enums.MuscleGroup;
  }

  throw new ValidationError(`Invalid muscle group: ${value}`);
};

export const parseExerciseType = (value: string): $Enums.ExerciseType => {
  const upperValue = value.toUpperCase();

  if (Object.values($Enums.ExerciseType).includes(upperValue as $Enums.ExerciseType)) {
    return upperValue as $Enums.ExerciseType;
  }

  throw new ValidationError(`Invalid exercise type: ${value}`);
};
