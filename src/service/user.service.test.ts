import { beforeEach, describe, expect, it, vi } from "vitest";
import userService from "./user.service";
import userRepository from "../repository/user.repository";
import { ForbiddenError, AuthenticationError } from "../utils/errors";
import { $Enums } from "@prisma/client";
describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchUsers", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.restoreAllMocks();
    });
    it("should return a list of users", async () => {
      const token = { id: "admin-123", role: "ADMIN" };
      const filters = { isActive: true };
      vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);
      vi.spyOn(userRepository, "findUsers").mockResolvedValue([
        {
          id: "user-123",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: null,
          role: "VISITOR",
          isActive: true,
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ]);
      const users = await userService.searchUsers(token, filters);
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
    });

    it("should return empty array if limit is zero", async () => {
      const token = { id: "admin-123", role: "ADMIN" };
      const filters = { isActive: true, limit: 0 };
      vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);
      vi.spyOn(userRepository, "findUsers").mockResolvedValue([]);
      const users = await userService.searchUsers(token, filters);
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(0);
    });
    it("should return users filtered by role", async () => {
      const token = { id: "admin-123", role: "ADMIN" };
      const filters = {
        role: $Enums.UserRole.CUSTOMER,
        isActive: true,
        havePhone: true,
        createdBefore: new Date("2022-01-01T00:00:00Z"),
        createdAfter: new Date("2025-01-01T00:00:00Z"),
      };
      vi.spyOn(userService, "checkIsAdmin").mockReturnValue(true);
      vi.spyOn(userRepository, "findUsers").mockResolvedValue([
        {
          id: "user-456",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "123-456-7890",
          role: "CUSTOMER",
          isActive: true,
          createdAt: new Date("2023-02-01T00:00:00Z"),
          updatedAt: new Date("2023-02-01T00:00:00Z"),
        },
      ]);
      const users = await userService.searchUsers(token, filters);
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(1);
      users.forEach((user) => {
        expect(user.role).toBe("CUSTOMER");
        expect(user.isActive).toBe(true);
        expect(user.phone).toBeDefined();
      });
    });
  });
  describe("checkIsAdmin", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should not throw if user is admin", () => {
      const token = { id: "admin-123", role: "ADMIN" };
      expect(() => userService.checkIsAdmin(token)).not.toThrow();
    });

    it("should throw ForbiddenError if user is not admin", () => {
      const token = { id: "user-123", role: "CUSTOMER" };
      expect(() => userService.checkIsAdmin(token)).toThrow(new ForbiddenError());
    });

    it("should throw AuthenticationError if token is missing", () => {
      const nullToken = null as unknown as { id: string; role: string };
      expect(() => userService.checkIsAdmin(nullToken)).toThrow(new AuthenticationError());
    });
  });
  describe("checkIsPersonalTrainerOrAdmin", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should not throw if user is admin", () => {
      const token = { id: "admin-123", role: "ADMIN" };
      expect(() => userService.checkIsPersonalTrainerOrAdmin(token)).not.toThrow();
    });

    it("should not throw if user is personal trainer", () => {
      const token = { id: "personal-123", role: "PERSONAL" };
      expect(() => userService.checkIsPersonalTrainerOrAdmin(token)).not.toThrow();
    });

    it("should throw ForbiddenError if user is neither admin nor personal trainer", () => {
      const token = { id: "user-123", role: "CUSTOMER" };
      expect(() => userService.checkIsPersonalTrainerOrAdmin(token)).toThrow(new ForbiddenError());
    });

    it("should throw AuthenticationError if token is missing", () => {
      const nullToken = null as unknown as { id: string; role: string };
      expect(() => userService.checkIsPersonalTrainerOrAdmin(nullToken)).toThrow(
        new AuthenticationError()
      );
    });
  });
  describe("checkIsAuthenticated", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should not throw if token is provided", () => {
      const token = { id: "user-123", role: "CUSTOMER" };
      expect(() => userService.checkIsAuthenticated(token)).not.toThrow();
    });

    it("should throw AuthenticationError if token is missing", () => {
      const nullToken = null as unknown as { id: string; role: string };
      expect(() => userService.checkIsAuthenticated(nullToken)).toThrow(new AuthenticationError());
    });
  });
});
