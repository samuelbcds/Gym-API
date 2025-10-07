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

export function handleHttpError(error: unknown) {
  const { statusCode, message } =
    error instanceof HttpError
      ? { statusCode: error.statusCode, message: error.message }
      : { statusCode: 500, message: "Internal server error" };

  return { statusCode, message };
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
