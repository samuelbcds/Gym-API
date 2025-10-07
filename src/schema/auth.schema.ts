import { z } from "zod";

class AuthSchema {
  login = z.object({
    email: z.email(),
    password: z.string().min(6),
  });
}

export default new AuthSchema();
