/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      token_user: {
        id: string;
        role: string;
      };
    }
  }
}
