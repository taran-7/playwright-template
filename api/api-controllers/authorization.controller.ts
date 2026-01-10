/**
 * ============================================================================
 * AUTHORIZATION CONTROLLER (API CONTROLLER EXAMPLE)
 * ============================================================================
 *
 * API controller for authentication and authorization operations.
 * Extends RequestHolder to inherit HTTP request utilities.
 *
 * Key concepts:
 * - Each controller handles one domain/feature
 * - Methods return APIResponse for flexible assertions
 * - Use HTTPHeaders type for consistent header handling
 *
 * Usage:
 *   const response = await api.authorizationController.logout(headers);
 *   expect(response.status()).toBe(200);
 * ============================================================================
 */

import { faker } from "@faker-js/faker";
import { RequestHolder } from "@api/requestHolders";
import { APIResponse, BrowserContext } from "@playwright/test";
import { EndpointsEnum } from "@constants/apiEndpoints";
import {
  extraHTTPHeadersWithoutToken,
  HTTPHeaders,
} from "@api/api-helpers/extraHTTPHeaders";
import { USERS } from "@constants/users/testUsers";
import ENV from "env";

export class AuthorizationController extends RequestHolder {
  // ===========================================================================
  // LOGOUT
  // ===========================================================================

  /**
   * Logout user via API.
   *
   * @param userRole - User role key from USERS constant
   * @param token - Authentication token
   * @returns API response
   *
   * @example
   * await api.authorizationController.logoutAsUser("manager", token);
   */
  async logoutAsUser(userRole: string, token: string): Promise<APIResponse> {
    const user = USERS[userRole as keyof typeof USERS];
    if (!user) {
      throw new Error(`Role ${userRole} not found in USERS`);
    }

    const logoutResponse: APIResponse = await this.request.post(
      `${process.env.BASE_URL}${EndpointsEnum.Logout}`,
      {
        data: {},
        headers: {
          ...extraHTTPHeadersWithoutToken,
          cookie: token,
        },
      },
    );

    if (logoutResponse.status() !== 200) {
      throw new Error(
        `Failed to log out user ${user.username}. Status code: ${logoutResponse.status()}`,
      );
    }

    return logoutResponse;
  }

  // ===========================================================================
  // SIGNUP
  // ===========================================================================

  /**
   * Sign up new user via API.
   *
   * @param email - User email (defaults to random email)
   * @returns Object with userId and email
   *
   * @example
   * const { userId, email } = await api.authorizationController.signUpWithEmail();
   */
  async signUpWithEmail(
    email: string = `autotest+${faker.string.uuid()}@example.com`,
  ) {
    const userId = faker.string.uuid();
    const payload = {
      userId,
      email,
    };

    const headersWithReferer = {
      ...extraHTTPHeadersWithoutToken,
      referer: `${ENV.BASE_URL}/sign-up`,
    };

    const response: APIResponse = await this.send(
      "post",
      EndpointsEnum.SignUp,
      headersWithReferer,
      JSON.stringify(payload),
    );

    if (response.status() !== 200) {
      throw new Error(`Failed sign up: ${await response.text()}`);
    }

    return payload;
  }

  // ===========================================================================
  // PASSWORD MANAGEMENT
  // ===========================================================================

  /**
   * Request password reset.
   *
   * @param email - User email
   * @returns API response
   */
  async requestPasswordReset(email: string): Promise<APIResponse> {
    return await this.send(
      "post",
      EndpointsEnum.PasswordReset,
      extraHTTPHeadersWithoutToken,
      JSON.stringify({ email }),
    );
  }

  /**
   * Change user password.
   *
   * @param headers - Auth headers
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @returns API response
   */
  async changePassword(
    headers: HTTPHeaders,
    oldPassword: string,
    newPassword: string,
  ): Promise<APIResponse> {
    return await this.send(
      "post",
      EndpointsEnum.AuthPassword,
      headers,
      JSON.stringify({ oldPassword, newPassword }),
    );
  }

  // ===========================================================================
  // USER INFO
  // ===========================================================================

  /**
   * Get current user info.
   *
   * @param headers - Auth headers
   * @returns API response with user info
   */
  async getCurrentUserInfo(headers: HTTPHeaders): Promise<APIResponse> {
    return await this.send("get", EndpointsEnum.AuthInfo, headers);
  }

  // ===========================================================================
  // ADD MORE AUTH METHODS HERE
  // ===========================================================================
  // Examples:
  //   - loginWithSSO()
  //   - refreshToken()
  //   - validateToken()
  //   - revokeAllSessions()
  // ===========================================================================
}
