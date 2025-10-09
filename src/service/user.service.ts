import userRepository from "../repository/user.repository";
import { ForbiddenError, AuthenticationError } from "../utils/errors";
import { Prisma, $Enums } from "@prisma/client";

class UserService {
  searchUsers(
    token: { id: string; role: string },
    filters: {
      role?: $Enums.UserRole;
      name?: string;
      email?: string;
      isActive?: boolean;
      havePhone?: boolean;
      createdAfter?: Date;
      createdBefore?: Date;
      page?: number;
      limit?: number;
    }
  ) {
    this.checkIsAdmin(token);

    const {
      role,
      name,
      email,
      isActive = true,
      havePhone,
      createdAfter,
      createdBefore,
      page = 1,
      limit = 20,
    } = filters;

    const whereCondition: Prisma.UserWhereInput = {};

    if (role) whereCondition.role = role;
    if (name) whereCondition.name = { contains: name, mode: "insensitive" };
    if (email) whereCondition.email = { contains: email, mode: "insensitive" };
    if (isActive !== undefined) whereCondition.isActive = isActive;
    if (havePhone) whereCondition.phone = { not: { equals: null } };

    if (createdAfter || createdBefore) {
      whereCondition.createdAt = {};

      if (createdAfter) {
        whereCondition.createdAt.gte = createdAfter;
      }
      if (createdBefore) {
        whereCondition.createdAt.lte = createdBefore;
      }
    }

    const skip = Math.abs(page - 1) * Math.abs(limit);
    const take = Math.abs(limit);

    const orderBy = { name: "asc" as Prisma.SortOrder };

    return userRepository.findUsers({
      whereCondition,
      skip,
      take,
      orderBy,
    });
  }

  checkIsAdmin(token: { id: string; role: string }) {
    this.checkIsAuthenticated(token);
    if (token.role !== "ADMIN") {
      throw new ForbiddenError();
    }
    return true;
  }

  checkIsPersonalTrainerOrAdmin(token: { id: string; role: string }) {
    this.checkIsAuthenticated(token);
    if (token.role !== "ADMIN" && token.role !== "PERSONAL") {
      throw new ForbiddenError();
    }
    return true;
  }

  checkIsAuthenticated(token: { id: string; role: string }) {
    if (!token) {
      throw new AuthenticationError();
    }
    return true;
  }
}

export default new UserService();
