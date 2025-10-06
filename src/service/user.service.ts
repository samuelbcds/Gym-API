import { UnauthorizedError, AuthenticationError } from "../utils/errors";

class UserService {
  checkIsAdmin(token: { id: string; role: string } | null) {
    if (!token || token.role !== "ADMIN") {
      throw new UnauthorizedError("Unauthorized");
    }
    return true;
  }

  checkIsAuthenticated(token: { id: string; role: string } | null) {
    if (!token) {
      throw new AuthenticationError("Access denied");
    }
    return true;
  }
}

export default new UserService();
