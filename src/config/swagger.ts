import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Gym Management API",
    version: "1.0.0",
    description:
      "A comprehensive REST API for gym management system with user authentication, workout plans, and exercise tracking",
    contact: {
      name: "Samuel Baltazar",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3333/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID (UUID)",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          name: {
            type: "string",
            description: "User full name",
            example: "Samuel Baltazar",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "samuel.baltazar@example.com",
          },
          role: {
            type: "string",
            enum: ["VISITOR", "CUSTOMER", "PERSONAL", "ADMIN"],
            description: "User role in the system",
            example: "CUSTOMER",
          },
          age: {
            type: "integer",
            description: "User age",
            example: 23,
            nullable: true,
          },
        },
      },
      UserRegistration: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            description: "User full name",
            example: "Samuel Baltazar",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "samuel.baltazar@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            description: "User password (min 6 characters)",
            example: "securePassword123",
          },
          age: {
            type: "integer",
            minimum: 0,
            description: "User age (optional)",
            example: 23,
            nullable: true,
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "admin@gym.com.br",
          },
          password: {
            type: "string",
            description: "User password",
            example: "12345678",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "JWT authentication token (valid for 7 days)",
            example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "550e8400-e29b-41d4-a716-446655440000",
              },
              name: {
                type: "string",
                example: "Samuel Baltazar",
              },
              email: {
                type: "string",
                example: "samuel.baltazar@example.com",
              },
              role: {
                type: "string",
                example: "CUSTOMER",
              },
            },
          },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            description: "Updated user name",
            example: "Duda",
          },
          age: {
            type: "integer",
            minimum: 0,
            description: "Updated user age",
            example: 35,
          },
        },
      },

      GetUserByIdRequest: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
            description: "User ID (UUID)",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        },
      },

      GetMeResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID (UUID)",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          name: {
            type: "string",
            description: "User full name",
            example: "Samuel Baltazar",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "samuel.baltazar@example.com",
          },
        },
      },
      ListUsersRequest: {
        type: "object",
        properties: {
          role: {
            type: "string",
            enum: ["VISITOR", "CUSTOMER", "PERSONAL", "ADMIN"],
            description: "Filter users by role (optional)",
            example: "CUSTOMER",
            nullable: true,
          },
        },
      },
      SuccessMessage: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "User created successfully",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
            example: "Invalid email or password",
          },
        },
      },
      InactiveAccount: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
            example: "User account is inactive",
          },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Validation error details",
            example: "email: Invalid email, password: String must contain at least 6 character(s)",
          },
        },
      },
      ConflictError: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Conflict error - resource already exists",
            example: "Email already in use",
          },
        },
      },
      // Exercise Schemas
      Exercise: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Exercise ID (UUID)",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          name: {
            type: "string",
            description: "Exercise name",
            example: "Bench Press",
          },
          description: {
            type: "string",
            description: "Exercise description",
            example: "Lie on a flat bench with a barbell and push the weight upward",
          },
          videoURL: {
            type: "string",
            description: "URL to exercise demonstration video",
            example: "https://example.com/bench-press.mp4",
            nullable: true,
          },
          type: {
            type: "string",
            enum: ["STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE", "FUNCTIONAL"],
            description: "Exercise type",
            example: "STRENGTH",
          },
          muscleGroup: {
            type: "array",
            items: {
              type: "string",
              enum: ["CHEST", "BACK", "SHOULDERS", "ARMS", "ABDOMINALS", "LEGS", "FULL_BODY"],
            },
            description: "Muscles targeted by this exercise",
            example: ["CHEST", "ARMS"],
          },
          isActive: {
            type: "boolean",
            description: "Whether the exercise is active or soft-deleted",
            example: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "When the exercise was created",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "When the exercise was last updated",
          },
        },
      },
      CreateExercise: {
        type: "object",
        required: ["name", "description", "type", "muscleWorked"],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            description: "Exercise name",
            example: "Bench Press",
          },
          description: {
            type: "string",
            minLength: 10,
            description: "Exercise description",
            example: "Lie on a flat bench with a barbell and push the weight upward",
          },
          videoUrl: {
            type: "string",
            format: "uri",
            description: "URL to exercise demonstration video (optional)",
            example: "https://example.com/bench-press.mp4",
            nullable: true,
          },
          type: {
            type: "string",
            enum: ["STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE", "FUNCTIONAL"],
            description: "Exercise type",
            example: "STRENGTH",
          },
          muscleGroup: {
            type: "array",
            items: {
              type: "string",
              enum: ["CHEST", "BACK", "SHOULDERS", "ARMS", "ABDOMINALS", "LEGS", "FULL_BODY"],
            },
            description: "Muscles targeted by this exercise",
            example: ["CHEST", "ARMS"],
          },
        },
      },
      UpdateExercise: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            description: "Updated exercise name",
            example: "Incline Bench Press",
          },
          description: {
            type: "string",
            minLength: 10,
            description: "Updated exercise description",
            example: "Lie on an inclined bench with a barbell and push the weight upward",
          },
          videoUrl: {
            type: "string",
            format: "uri",
            description: "Updated URL to exercise demonstration video",
            example: "https://example.com/incline-bench-press.mp4",
            nullable: true,
          },
          type: {
            type: "string",
            enum: ["STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE", "FUNCTIONAL"],
            description: "Updated exercise type",
            example: "STRENGTH",
          },
          muscleGroup: {
            type: "array",
            items: {
              type: "string",
              enum: ["CHEST", "BACK", "SHOULDERS", "ARMS", "ABDOMINALS", "LEGS", "FULL_BODY"],
            },
            description: "Updated muscles targeted by this exercise",
            example: ["CHEST", "SHOULDERS"],
          },
        },
      },
      SearchExercisesRequest: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Filter by exercise ID",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          name: {
            type: "string",
            description: "Filter by exercise name (partial match, case insensitive)",
            example: "bench",
          },
          type: {
            type: "string",
            enum: ["STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE", "FUNCTIONAL"],
            description: "Filter by exercise type",
            example: "STRENGTH",
          },
          muscleGroup: {
            type: "array",
            items: {
              type: "string",
              enum: ["CHEST", "BACK", "SHOULDERS", "ARMS", "ABDOMINALS", "LEGS", "FULL_BODY"],
            },
            description: "Filter by targeted muscle groups",
            example: ["CHEST"],
          },
          isActive: {
            type: "boolean",
            description: "Filter by active status (default: true)",
            example: true,
          },
          page: {
            type: "integer",
            minimum: 1,
            description: "Page number for pagination (default: 1)",
            example: 1,
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            description: "Number of results per page (default: 100)",
            example: 20,
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Exercises",
      description: "Exercise management endpoints",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "../routes/**/*.{ts,js}"),
    path.join(__dirname, "../controllers/**/*.{ts,js}"),
  ],
};

const swaggerSpec = swaggerJSDoc(options) as { paths?: Record<string, unknown> };

// Debug: Log the number of paths found
console.log(`[Swagger] Found ${Object.keys(swaggerSpec.paths || {}).length} API paths`);

export default swaggerSpec;
