/**
 * ============================================================================
 * TEST USERS CONFIGURATION
 * ============================================================================
 *
 * This file defines all test users with their roles and credentials.
 * Credentials are mapped from environment variables defined in env.ts.
 *
 * Usage:
 *   import { USERS } from "@constants/users/testUsers";
 *
 *   // Get user credentials
 *   const manager = USERS.manager;
 *   console.log(manager.username, manager.password);
 *
 *   // Use in API authentication
 *   const { token } = await api.getUserTokens("manager");
 *
 * To add a new user:
 *   1. Add environment variables in env.ts
 *   2. Add corresponding values in .env files
 *   3. Add user entry here
 * ============================================================================
 */

import ENV from "env";

/**
 * User interface definition.
 */
interface User {
  /** User role/type identifier */
  role: string | null;
  /** User email/username */
  username: string | null;
  /** User password */
  password: string | null;
}

/**
 * All test users.
 * Keys are used as identifiers in test code.
 */
export const USERS = {
  // ===========================================================================
  // ADMIN/MANAGER USERS
  // ===========================================================================

  /**
   * Manager user with full permissions.
   * Use for admin-level operations and setup.
   */
  manager: {
    role: "manager",
    username: ENV.MANAGER_USERNAME,
    password: ENV.MANAGER_PASSWORD,
  } as User,

  // ===========================================================================
  // STANDARD USERS
  // ===========================================================================

  /**
   * Regular user with standard permissions.
   * Use for typical user flow testing.
   */
  user_standard: {
    role: "user_standard",
    username: ENV.USER_STANDARD_USERNAME,
    password: ENV.USER_STANDARD_PASSWORD,
  } as User,

  /**
   * User with limited/restricted permissions.
   * Use for authorization/permission testing.
   */
  user_limited: {
    role: "user_limited",
    username: ENV.USER_LIMITED_USERNAME,
    password: ENV.USER_LIMITED_PASSWORD,
  } as User,

  // ===========================================================================
  // ADD MORE USERS HERE
  // ===========================================================================
  // Template for adding new users:
  //
  // user_feature_x: {
  //   role: "user_feature_x",
  //   username: ENV.USER_FEATURE_X_USERNAME,
  //   password: ENV.USER_FEATURE_X_PASSWORD,
  // } as User,
  // ===========================================================================
};

/**
 * Type for user keys (for type-safe user selection).
 */
export type UserKey = keyof typeof USERS;
