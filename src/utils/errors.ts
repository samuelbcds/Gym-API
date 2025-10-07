import { ZodError } from "zod";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 403);
    this.name = "UnauthorizedError";
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string = "Access denied") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Bad request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
    this.name = "InternalServerError";
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = "Validation error") {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Type guard to check if error is a Prisma error with code property
 */
function isPrismaError(error: unknown): error is { code: string; meta?: { target?: string[] } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export function handleHttpError(error: unknown) {
  // Handle custom HTTP errors
  if (error instanceof HttpError) {
    return { statusCode: error.statusCode, message: error.message };
  }

  // Handle Prisma unique constraint violation (P2002)
  if (isPrismaError(error) && error.code === "P2002") {
    const target = error.meta?.target;
    const field = Array.isArray(target) ? target[0] : "field";

    const fieldMessages: Record<string, string> = {
      email: "Email already in use",
      phone: "Phone number already in use",
    };

    const message = fieldMessages[field] || `${field} already exists`;
    return { statusCode: 409, message };
  }

  // Default internal server error
  return { statusCode: 500, message: "Internal server error" };
}

export function handleZodValidation<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new ValidationError(errorMessages);
    }
    throw error;
  }
}
