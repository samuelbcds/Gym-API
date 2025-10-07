import { PrismaClient, Prisma, $Enums } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  omit: {
    user: {
      hash: true,
      salt: true,
    },
  },
});

class UserRepository {
  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async findUsersByRole(role?: $Enums.UserRole) {
    return prisma.user.findMany({
      select: {
        name: true,
        email: true,
      },
      where: role ? { role } : undefined,
    });
  }

  async updateUserById(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id: userId }, data });
  }

  async softDeleteUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  /**
   * Find user by email with credentials for authentication purposes only.
   * This method explicitly includes hash and salt fields needed for password verification.
   * @security Use ONLY for authentication - never expose these fields to API responses
   */
  async findUserByEmailWithCredentials(email: string) {
    return prisma.user.findUnique({
      where: { email },
      omit: { hash: false, salt: false },
    });
  }
}

export default new UserRepository();
