import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import auth from "../config/auth";
import userRepository from "../repository/user.repository";
import userService from "../service/user.service";
import userSchema from "../schema/user.schema";
import { handleHttpError, handleZodValidation } from "../utils/errors";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = handleZodValidation(userSchema.create, req.body);
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

  async list(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAdmin(token);
      const { role } = handleZodValidation(userSchema.list, req.body);

      const users = await userRepository.findUsersByRole(role);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error trying to list users", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    const token = req.token_user;

    try {
      userService.checkIsAuthenticated(token);
      const validatedData = handleZodValidation(userSchema.update, req.body);
      const updateData: Prisma.UserUpdateInput = validatedData;

      const user = await userRepository.updateUserById(Number(token.id), updateData);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error trying to update user", error);

      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }

  async softDelete(req: Request, res: Response) {
    const token = req.token_user;
    if (!token) {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      await userRepository.softDeleteUser(Number(token.id));
      return res.status(204).send();
    } catch (error) {
      console.error("Error trying to delete user", error);

      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }
}

export default new UserController();
