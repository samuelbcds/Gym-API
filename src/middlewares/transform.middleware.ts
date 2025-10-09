import { Request, Response, NextFunction } from "express";
import {
  parseBoolean,
  parseNumber,
  parseNumberWithRange,
  parseMuscleGroups,
  parseExerciseType,
  parseUserRole,
} from "../utils/parsers";

export const transformExerciseQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const querySource = req.query;
    const { isActive, page, limit, type, muscleGroups } = querySource;

    const transformed: Record<string, unknown> = {};

    Object.assign(transformed, querySource);

    if (isActive !== undefined) {
      transformed.isActive = parseBoolean(isActive as string);
    }

    if (page !== undefined) {
      transformed.page = parseNumber(page as string);
    }

    if (limit !== undefined) {
      transformed.limit = parseNumberWithRange(limit as string, 1, 100);
    }

    if (muscleGroups !== undefined) {
      transformed.muscleGroups = parseMuscleGroups(muscleGroups as string | string[]);
    }
    if (type !== undefined) {
      transformed.type = parseExerciseType(type as string);
    }

    req.validatedQuery = transformed;

    next();
  } catch (error) {
    next(error);
  }
};

export const transformUserQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const querySource = req.query;
    const { name, role, havePhone, email, createdAfter, createdBefore, isActive, page, limit } =
      querySource;

    const transformed: Record<string, unknown> = {};

    Object.assign(transformed, querySource);

    if (isActive !== undefined) {
      transformed.isActive = parseBoolean(isActive as string);
    }
    if (role !== undefined) {
      transformed.role = parseUserRole(role as string);
    }

    if (page !== undefined) {
      transformed.page = parseNumber(page as string);
    }

    if (name !== undefined) {
      transformed.name = name as string;
    }

    if (havePhone !== undefined) {
      transformed.havePhone = parseBoolean(havePhone as string);
    }

    if (email !== undefined) {
      transformed.email = email as string;
    }

    if (createdAfter !== undefined) {
      transformed.createdAfter = new Date(createdAfter as string);
    }

    if (createdBefore !== undefined) {
      transformed.createdBefore = new Date(createdBefore as string);
    }

    if (limit !== undefined) {
      transformed.limit = parseNumberWithRange(limit as string, 1, 100);
    }

    req.validatedQuery = transformed;

    next();
  } catch (error) {
    next(error);
  }
};
