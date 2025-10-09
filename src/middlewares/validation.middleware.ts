import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

/**
 * Middleware factory that validates request data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param source Where to find the data to validate (body, query, params)
 */
export const validateRequest = (schema: ZodType, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req[source]);

      switch (source) {
        case "query":
          req.validatedQuery = result as Record<string, unknown>;
          break;
        case "body":
          req.validatedBody = result as Record<string, unknown>;
          break;
        case "params":
          req.validatedParams = result as Record<string, unknown>;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        next(new ValidationError(errorMessages));
      } else {
        next(error);
      }
    }
  };
};
