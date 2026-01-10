/**
 * USER TYPE DEFINITIONS
 *
 * This file contains TypeScript interfaces for user-related data structures.
 * Use these types to ensure type safety when working with user data.
 *
 * TODO: Add your own user interfaces based on your API responses
 */

/**
 * User authentication tokens
 * Returned after successful login
 */
interface IUserTokens {
  token: string;
  refreshToken: string;
}

/**
 * Current user information from auth token
 * Typically decoded from JWT or returned by /me endpoint
 *
 * TODO: Modify fields to match your auth system
 */
interface ICurrentUserInfoResponse {
  iat: number; // Token issued at
  exp: number; // Token expiration
  email: string;
  operatorUserId: string | null;
  userId: string;
  tenantId: string;
  roles: string[];
  ipAddress: string;
  allowedIps: string[] | null;
  tariffExpired: boolean;
}

/**
 * User statistics and details
 * Used for admin/management views
 *
 * TODO: Modify fields to match your user management API
 */
interface IUserStats {
  userId: string;
  email: string;
  name: string;
  deleted: boolean;
  createDate: string;
  lastLogin: string | null;
  activatedPresentations: number;
  deactivatedPresentations: number;
  countOfViews: number;
  deactivatedDuration: number;
  activatedDuration: number;
  passwordRecoverySent: string;
  status: "ACTIVE" | "DEACTIVATED" | "PENDING";
  role: string;
}
