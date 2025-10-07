import { Request, Response } from "express";
import auth from "../config/auth";
import authSchema from "../schema/auth.schema";
import userRepository from "../repository/user.repository";
import { AuthenticationError, handleHttpError, handleZodValidation } from "../utils/errors";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = handleZodValidation(authSchema.login, req.body);

      const user = await userRepository.findUserByEmailWithCredentials(email);

      if (!user) {
        throw new AuthenticationError("Invalid email or password");
      }

      if (!user.isActive) {
        throw new AuthenticationError("User account is inactive");
      }

      const isPasswordValid = auth.checkPassword(password, user.hash, user.salt);

      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid email or password");
      }

      const token = auth.generateJWT(user.id, user.role);

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error trying to login", error);
      const { statusCode, message } = handleHttpError(error);
      res.status(statusCode).json({ error: message });
    }
  }
}

export default new AuthController();
