import { $Enums, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import auth from "../config/auth";
import userRepository from "../repository/user.repository";
import userService from "../service/user.service";
import { handleHttpError } from "../utils/errors";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.validatedBody as {
        name: string;
        email: string;
        password: string;
      };

      const { hash, salt } = auth.generatePassword(password);

      await userRepository.createUser({
        name,
        email,
        hash,
        salt,
      });
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error trying to create user", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async searchUsers(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAdmin(token);
      const filters = req.validatedQuery as {
        role?: $Enums.UserRole;
        name?: string;
        email?: string;
        isActive?: boolean;
        havePhone?: boolean;
        createdAfter?: Date;
        createdBefore?: Date;
        page?: number;
        limit?: number;
      };

      const users = await userService.searchUsers(token, filters);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error trying to search users", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async getById(req: Request, res: Response) {
    const token = req.token_user;

    try {
      const { userId } = req.validatedParams as { userId: string };
      userService.checkIsAdmin(token);

      const user = await userRepository.findUserById(userId as string);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error trying to get user by ID", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async getMe(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAuthenticated(token);

      const user = await userRepository.findUserById(token.id);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error trying to get current user", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAuthenticated(token);
      const validatedData = req.validatedBody as {
        name?: string;
      };
      const updateData: Prisma.UserUpdateInput = validatedData;

      const user = await userRepository.updateUserById(token.id, updateData);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error trying to update user", error);

      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async softDelete(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAuthenticated(token);

      await userRepository.softDeleteUser(token.id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error trying to delete user", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }
}

export default new UserController();
