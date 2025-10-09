import { $Enums } from "@prisma/client";
import { z } from "zod";
class UserSchema {
  create = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2).max(100),
  });

  getUserById = z.object({
    userId: z.uuid(),
  });

  list = z.object({
    role: z.enum($Enums.UserRole).optional(),
  });

  update = z.object({
    name: z.string().min(2).max(100).optional(),
  });

  searchUsers = z.object({
    role: z.enum($Enums.UserRole).optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    havePhone: z.string().optional(),
    createdAfter: z.string().optional(),
    createdBefore: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  });
}

export default new UserSchema();
