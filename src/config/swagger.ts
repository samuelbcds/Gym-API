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
            example: "samuel.baltazar@example.com",
          },
          password: {
            type: "string",
            description: "User password",
            example: "securePassword123",
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
