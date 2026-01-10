/**
 * ============================================================================
 * APPLICATION CLASS (PAGE OBJECT AGGREGATOR)
 * ============================================================================
 *
 * This class aggregates all page objects into a single entry point.
 * It extends PageHolder to inherit common page utilities.
 *
 * The Application class is injected into tests via the `app` fixture.
 *
 * Usage in tests:
 *   test("example", async ({ app }) => {
 *     await app.navigateToBasePath(app.loginPage.loginUrl);
 *     await app.loginPage.login(email, password);
 *     await expect(app.explorePage.searchField).toBeVisible();
 *   });
 *
 * To add a new page:
 *   1. Create page object in app/pages/
 *   2. Import it here
 *   3. Add as public readonly property
 * ============================================================================
 */

import { Page } from "@playwright/test";
import { PageHolder } from "@app/pageHolder";
import { API } from "@api/api";
import { USERS } from "@constants/users/testUsers";
import { AUTH_COOKIE_DOMAIN, AUTH_COOKIE_PATH } from "@constants/authCookies";

// ===========================================================================
// IMPORT PAGE OBJECTS
// ===========================================================================
// Add your page object imports here
import LoginPage from "@app/pages/loginPage";
import ExplorePage from "@app/pages/explorePage";
import GeneralHelpers from "@app/generalHelpers";

export class Application extends PageHolder {
  // ===========================================================================
  // PRIVATE PROPERTIES
  // ===========================================================================

  /** API instance for backend operations (injected from fixture) */
  private api: API;

  // ===========================================================================
  // GENERAL HELPERS
  // ===========================================================================

  /** Helper methods for common operations */
  public readonly generalHelpers: GeneralHelpers = new GeneralHelpers(
    this.page,
  );

  // ===========================================================================
  // PAGE OBJECTS
  // ===========================================================================
  // Add your page objects as public readonly properties.
  // This allows tests to access them via app.pageName
  // ===========================================================================

  /** Login/Authentication page */
  public readonly loginPage: LoginPage = new LoginPage(this.page);

  /** Explore/Dashboard page */
  public readonly explorePage: ExplorePage = new ExplorePage(this.page);

  // ===========================================================================
  // ADD MORE PAGES HERE
  // ===========================================================================
  // Template for adding new pages:
  //
  // import NewPage from "@app/pages/newPage";
  // public readonly newPage: NewPage = new NewPage(this.page);
  // ===========================================================================

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  /**
   * Creates Application instance with page and API access.
   *
   * @param page - Playwright Page instance
   * @param api - API instance for backend operations
   */
  constructor(page: Page, api: API) {
    super(page);
    this.api = api;
  }

  // ===========================================================================
  // AUTHENTICATION METHODS
  // ===========================================================================

  /**
   * Authenticate as a user by setting cookies directly.
   * This bypasses the login UI and is faster for test setup.
   *
   * @param userKey - Key from USERS constant (e.g., "manager", "user_standard")
   *
   * @example
   * await app.authAsUser("manager");
   * await app.navigateToBasePath("/dashboard"); // Already logged in
   */
  async authAsUser(userKey: keyof typeof USERS): Promise<void> {
    // Get tokens via API
    const { token, refreshToken } = await this.api.getUserTokens(userKey);

    // Set authentication cookies
    await this.page.context().addCookies([
      {
        name: "at", // Access token cookie
        value: token,
        domain: AUTH_COOKIE_DOMAIN,
        path: AUTH_COOKIE_PATH,
      },
      {
        name: "rt", // Refresh token cookie
        value: refreshToken,
        domain: AUTH_COOKIE_DOMAIN,
        path: AUTH_COOKIE_PATH,
      },
    ]);
  }

  /**
   * Clear all cookies (logout without UI).
   */
  async clearAuth(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
