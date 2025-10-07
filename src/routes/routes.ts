import { Router } from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// Authentication Routes (Public)
// ============================================

/**
 * POST /auth/login
 * Public route - User login
 * @body { email: string, password: string }
 * @returns { token: string, user: { id, email, name, role } }
 */
router.post("/auth/login", authController.login);

// ============================================
// User Routes
// ============================================

/**
 * POST /users
 * Public route - Create new user (Registration)
 * @body { name: string, email: string, password: string, age?: number }
 * @returns { message: string }
 */
router.post("/users", userController.create);

/**
 * POST /users/list
 * Protected route - List users (Admin only)
 * Requires: JWT Authentication + Admin role
 * @body { role?: "VISITOR" | "CUSTOMER" | "PERSONAL" | "ADMIN" }
 * @returns User[]
 */
router.post("/users/list", authenticateJWT, userController.list);

/**
 * PUT /users/me
 * Protected route - Update current user profile
 * Requires: JWT Authentication
 * @body { name?: string, age?: number }
 * @returns Updated user object
 */
router.put("/users/me", authenticateJWT, userController.update);

/**
 * DELETE /users/me
 * Protected route - Soft delete current user account
 * Requires: JWT Authentication
 * @returns 204 No Content
 */
router.delete("/users/me", authenticateJWT, userController.softDelete);

export default router;
