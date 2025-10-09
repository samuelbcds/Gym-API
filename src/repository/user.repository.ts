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
  findUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
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
  async findUsers(filters?: {
    whereCondition: Prisma.UserWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.UserFindManyArgs["orderBy"];
  }) {
    const { whereCondition, skip, take, orderBy } = filters || {
      whereCondition: {},
      skip: 0,
      take: 20,
      orderBy: { name: "desc" },
    };

    return prisma.user.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy,
    });
  }

  /**
   * Find user by email with credentials for authentication purposes only.
   * This method explicitly includes hash and salt fields needed for password verification.
   * Use ONLY for authentication
   */
  async findUserByEmailWithCredentials(email: string) {
    return prisma.user.findUnique({
      where: { email },
      omit: { hash: false, salt: false },
    });
  }
}

export default new UserRepository();
