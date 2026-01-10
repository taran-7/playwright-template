/**
 * ============================================================================
 * API CLASS (CONTROLLER AGGREGATOR)
 * ============================================================================
 *
 * This class aggregates all API controllers into a single entry point.
 * It extends RequestHolder to inherit common HTTP request utilities.
 *
 * The API class is injected into tests via the `api` fixture.
 *
 * Usage in tests:
 *   test("example", async ({ api }) => {
 *     const { token } = await api.getUserTokens("manager");
 *     const response = await api.presentationController.getAll(headers);
 *   });
 *
 * To add a new controller:
 *   1. Create controller in api/api-controllers/
 *   2. Import it here
 *   3. Add as public readonly property
 *   4. Instantiate in constructor
 * ============================================================================
 */

import { APIRequestContext, APIResponse } from "@playwright/test";
import { RequestHolder } from "@api/requestHolders";
import { USERS } from "@constants/users/testUsers";
import { extraHTTPHeadersWithoutToken } from "@api/api-helpers/extraHTTPHeaders";
import { EndpointsEnum } from "@constants/apiEndpoints";
import { ApiHelpers } from "@api/api-helpers/apiHelpers";

// ===========================================================================
// IMPORT CONTROLLERS
// ===========================================================================
// Add your API controller imports here
import { AuthorizationController } from "@api/api-controllers/authorization.controller";
import { PresentationController } from "@api/api-controllers/presentation.controller";

export class API extends RequestHolder {
  // ===========================================================================
  // CONTROLLERS
  // ===========================================================================
  // Add your controllers as public readonly properties.
  // This allows tests to access them via api.controllerName
  // ===========================================================================

  /** Authentication/Authorization operations */
  public readonly authorizationController: AuthorizationController;

  /** Presentation CRUD operations */
  public readonly presentationController: PresentationController;

  // ===========================================================================
  // ADD MORE CONTROLLERS HERE
  // ===========================================================================
  // Template for adding new controllers:
  //
  // import { NewController } from "@api/api-controllers/new.controller";
  // public readonly newController: NewController;
  //
  // Then in constructor:
  // this.newController = new NewController(requestContext);
  // ===========================================================================

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  /** General API helper methods */
  public readonly apiHelpers: ApiHelpers;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  constructor(requestContext: APIRequestContext) {
    super(requestContext);

    // Initialize controllers
    this.authorizationController = new AuthorizationController(requestContext);
    this.presentationController = new PresentationController(requestContext);

    // Initialize helpers
    this.apiHelpers = new ApiHelpers(requestContext);
  }

  // ===========================================================================
  // AUTHENTICATION METHODS
  // ===========================================================================

  /**
   * Get authentication tokens for a user.
   *
   * @param userKey - Key from USERS constant (e.g., "manager", "user_standard")
   * @returns Object with token and refreshToken
   *
   * @example
   * const { token, refreshToken } = await api.getUserTokens("manager");
   * const headers = extraHTTPHeaders(token);
   */
  async getUserTokens(userKey: keyof typeof USERS) {
    const user = USERS[userKey];
    if (!user.username || !user.password) {
      throw new Error(`No credentials found for userKey="${String(userKey)}"`);
    }

    const response: APIResponse = await this.request.post(
      `${process.env.BASE_URL}${EndpointsEnum.Login}`,
      {
        headers: extraHTTPHeadersWithoutToken,
        data: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      },
    );

    const res = await response.json();
    const token = res.token;
    const refreshToken = res.refreshToken;

    if (!token) {
      throw new Error(
        `Token is undefined or empty for user ${user.username} on environment ${process.env.BASE_URL}`,
      );
    }
    return { token, refreshToken };
  }
}
