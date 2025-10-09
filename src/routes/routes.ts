import { Router } from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";
import exerciseController from "../controllers/exercise.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { transformExerciseQuery, transformUserQuery } from "../middlewares/transform.middleware";
import exerciseSchema from "../schema/exercise.schema";
import userSchema from "../schema/user.schema";
import authSchema from "../schema/auth.schema";

const router = Router();

// ============================================
// Authentication Routes (Public)
// ============================================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password, returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/auth/login", validateRequest(authSchema.login, "body"), authController.login);

// ============================================
// User Routes
// ============================================

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account (public registration)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Conflict - Resource already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 */
router.post("/user", validateRequest(userSchema.create, "body"), userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve users based on the filters
 *     description:
 *      Supports various optional filters to search users:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name (partial match)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by user email (exact match)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: createdAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter users created at this date or after (format YYYY-MM-DDTHH:MM:SSZ)
 *       - in: query
 *         name: createdBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter users created at this date of before (format YYYY-MM-DDTHH:MM:SSZ)
 *       - in: query
 *         name: havePhone
 *         schema:
 *           type: boolean
 *         description: Filter users that have a phone number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort results by a specific field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List containing users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/users",
  authenticateJWT,
  validateRequest(userSchema.searchUsers, "query"),
  transformUserQuery,
  userController.searchUsers
);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user information by user ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/user/:userId",
  authenticateJWT,
  validateRequest(userSchema.getUserById, "params"),
  userController.getById
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user information
 *     description: Retrieve information about the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/GetMeResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/user", authenticateJWT, userController.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     description: Update authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/users/me",
  authenticateJWT,
  validateRequest(userSchema.update, "body"),
  userController.update
);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user account
 *     description: Soft delete authenticated user's account (sets isActive to false)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully (no content)
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/users/me", authenticateJWT, userController.softDelete);

// ============================================
// Exercise Routes
// ============================================

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Create a new exercise
 *     description: Create a new exercise (Admin or Personal Trainer only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExercise'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin or Personal Trainer role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/exercises",
  authenticateJWT,
  validateRequest(exerciseSchema.createExercise, "body"),
  exerciseController.createExercise
);

/**
 * @swagger
 * /exercises/{exerciseId}:
 *   get:
 *     summary: Get exercise by ID
 *     description: Get an exercise by its ID
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the exercise
 *     responses:
 *       200:
 *         description: Exercise details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/exercises/:exerciseId",
  authenticateJWT,
  validateRequest(exerciseSchema.getExerciseById, "params"),
  exerciseController.getExerciseById
);

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Search exercises with filters
 *     description: |
 *       Unified endpoint to search exercises with various optional filters.
 *       This single endpoint replaces multiple specific endpoints, supporting all filtering operations:
 *       - Get all exercises (no parameters)
 *       - Get by name (name parameter)
 *       - Get by type (type parameter)
 *       - Get by muscle groups (muscleGroups parameter)
 *       - Get by any combination of filters
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter by exercise ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by exercise name (partial match)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [STRENGTH, CARDIO, FLEXIBILITY, BALANCE, FUNCTIONAL]
 *         description: Filter by exercise type
 *       - in: query
 *         name: muscleGroups
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [CHEST, BACK, SHOULDERS, ARMS, ABDOMINALS, LEGS, FULL_BODY]
 *         description: Filter by muscle groups (can provide multiple)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of exercises matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/exercises",
  authenticateJWT,
  validateRequest(exerciseSchema.searchExercisesRaw, "query"),
  transformExerciseQuery,
  exerciseController.searchExercises
);
/**
 * @swagger
 * /exercises/{exerciseId}:
 *   put:
 *     summary: Update exercise
 *     description: Update exercise details (Admin or Personal Trainer only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the exercise to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExercise'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin or Personal Trainer role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/exercises/:exerciseId",
  authenticateJWT,
  validateRequest(exerciseSchema.getExerciseById, "params"),
  validateRequest(exerciseSchema.updateExerciseData, "body"),
  exerciseController.updateExercise
);

/**
 * @swagger
 * /exercises/{exerciseId}:
 *   delete:
 *     summary: Delete exercise
 *     description: Soft delete an exercise (Admin only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the exercise to delete
 *     responses:
 *       204:
 *         description: Exercise deleted successfully (no content)
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/exercises/:exerciseId",
  authenticateJWT,
  validateRequest(exerciseSchema.getExerciseById, "params"),
  exerciseController.softDeleteExercise
);

export default router;
