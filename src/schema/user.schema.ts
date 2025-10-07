import { z } from "zod";
class UserSchema {
  create = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2).max(100),
  });

  list = z.object({
    role: z.enum(["VISITOR", "CUSTOMER", "PERSONAL", "ADMIN"]).optional(),
  });

  update = z.object({
    name: z.string().min(2).max(100).optional(),
  });
}

export default new UserSchema();
