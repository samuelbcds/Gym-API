import { PrismaClient, Prisma, $Enums } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      id: true,
      isActive: true,
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

  async updateUserById(userId: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id: userId }, data });
  }

  async softDeleteUser(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });
  }
}

export default new UserRepository();
