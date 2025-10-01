import { $Enums, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import auth from "../config/auth";
import userRepository from "../repository/user.repository";

class UserController {

    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const { hash, salt } = auth.generatePassword(password);

            await userRepository.createUser({
                name,
                email,
                hash,
                salt,
            });
            return res.status(201).json({ message: "User created successfully" });
        } catch (error: any) {
            console.error("Error trying to create user", error);
            const statusCode = error.statusCode || 500;
            const message = statusCode === 500 ? "Internal server error" : error.message;
            res.status(statusCode).json({ error: message });
        }
    }

    async list(req: Request, res: Response) {
        const token = req.token_user;
        const { role }: { role?: $Enums.UserRole } = req.body;
        if (!token || token.role !== "ADMIN") {
            return res.status(403).json({ error: "Access denied" });
        }
        try {
            const users = await userRepository.findUsersByRole(role);
            return res.status(200).json(users);
        } catch (error: any) {
            console.error("Error trying to list users", error);
            const statusCode = error.statusCode || 500;
            const message = statusCode === 500 ? "Internal server error" : error.message;
            res.status(statusCode).json({ error: message });
        }
    }

    async update(req: Request, res: Response) {
        const token = req.token_user;
        if (!token) {
            return res.status(403).json({ error: "Access denied" });
        }

        try {
            const updateData: Prisma.UserUpdateInput = req.body;

            const user = await userRepository.updateUserById(Number(token.id), updateData);
            return res.status(200).json(user);
        } catch (error: any) {
            console.error("Error trying to update user", error);
            const statusCode = error.statusCode || 500;
            const message = statusCode === 500 ? "Internal server error" : error.message;
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
        } catch (error: any) {
            console.error("Error trying to delete user", error);
            const statusCode = error.statusCode || 500;
            const message = statusCode === 500 ? "Internal server error" : error.message;
            res.status(statusCode).json({ error: message });
        }
    }

}

export default new UserController();