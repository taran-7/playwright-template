/**
 * ============================================================================
 * UI TEST EXAMPLE
 * ============================================================================
 *
 * This is a template for UI tests that interact with the application through
 * the browser using Page Object Model pattern.
 *
 * Key concepts:
 * - Uses `app` fixture to access page objects
 * - Interacts with UI elements (click, fill, assert visibility)
 * - Uses tags for test filtering: @ui, @smoke, @regression, @critical
 * - Test ID format: @XXXX (e.g., @1234) for tracking in test management systems
 *
 * Authentication approaches:
 * 1. UI Login: Use app.loginPage.login() - slower but tests login flow
 * 2. Token Auth: Use app.authAsUser() - faster, bypasses login UI
 *
 * Run examples:
 *   npm run run:by-id         # Run single test by ID
 *   npm run critical:test     # Run all @critical tests
 *   npm run regression:test   # Run all @regression tests
 * ============================================================================
 */

import { test, expect } from "@customFixture";
import {
  extraHTTPHeaders,
  HTTPHeaders,
} from "@api/api-helpers/extraHTTPHeaders";
import ENV from "env";

// ===========================================================================
// EXAMPLE 1: Tests WITHOUT authentication (public pages)
// ===========================================================================

/**
 * Test suite for Login Page functionality (no auth needed).
 */
test.describe("Login Page - Public", () => {
  test.beforeEach(async ({ app }) => {
    await app.navigateToBasePath(app.loginPage.loginUrl);
  });

  /**
   * Basic UI test example - checking visible elements.
   */
  test("User can see login form elements @1234 @ui @login @smoke @regression @critical", async ({
    app,
  }) => {
    await expect(app.loginPage.emailField).toBeVisible();
    await expect(app.loginPage.passwordField).toBeVisible();
    await expect(app.loginPage.loginButton).toBeVisible();
    await expect(app.loginPage.forgotPasswordLink).toBeVisible();
  });

  /**
   * Test with UI login action.
   * Use this approach when you need to TEST the login flow itself.
   */
  test("User can login with valid credentials via UI @1235 @ui @login @smoke", async ({
    app,
  }) => {
    const email = ENV.MANAGER_USERNAME;
    const password = ENV.MANAGER_PASSWORD;

    // Perform login through UI
    await app.loginPage.login(email, password);

    // Assert successful login
    await expect(app.explorePage.searchField).toBeVisible({ timeout: 10000 });
  });
});

// ===========================================================================
// EXAMPLE 2: Tests WITH token authentication (faster, recommended)
// ===========================================================================

/**
 * Test suite for authenticated pages.
 *
 * Uses app.authAsUser() to authenticate via cookie injection.
 * This is FASTER than UI login because it:
 * - Skips the login page entirely
 * - Sets authentication tokens directly via cookies
 * - Reduces test execution time by ~3-5 seconds per test
 *
 * Pattern:
 * 1. In beforeEach: call app.authAsUser("userKey")
 * 2. Navigate to any authenticated page
 * 3. Perform test actions
 */
test.describe("Explore Page - Authenticated", () => {
  /**
   * beforeEach: Authenticate user via token before each test.
   * This bypasses the login UI and sets cookies directly.
   */
  test.beforeEach(async ({ app }) => {
    // Authenticate as manager user (sets auth cookies)
    await app.authAsUser("manager");
  });

  /**
   * Test on authenticated page.
   * After authAsUser(), any page navigation will be authenticated.
   */
  test("Authenticated user can see explore page @2001 @ui @explore @smoke @regression", async ({
    app,
  }) => {
    // Navigate directly to authenticated page (no login needed!)
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // Assert page elements are visible
    await expect(app.explorePage.searchField).toBeVisible();
    await expect(
      app.explorePage.headerComponent.accountMenuButton,
    ).toBeVisible();
  });

  /**
   * Test user menu actions.
   */
  test("User can open account menu @2002 @ui @explore @regression", async ({
    app,
  }) => {
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // Interact with authenticated UI
    await app.explorePage.headerComponent.accountMenuButton.click();

    // Assert dropdown is visible
    await expect(app.explorePage.headerComponent.logOutButton).toBeVisible();
  });
});

// ===========================================================================
// EXAMPLE 3: Tests with API setup + token auth (full flow)
// ===========================================================================

/**
 * Advanced test pattern:
 * 1. Use API to create test data in beforeEach
 * 2. Authenticate via token
 * 3. Verify UI displays the data correctly
 * 4. Clean up via API in afterEach
 *
 * This pattern is useful when testing CRUD operations:
 * - Create data via API (fast)
 * - Verify display in UI (what we're actually testing)
 * - Delete via API (clean up)
 */
test.describe("Content Management - Full Flow", () => {
  // Store data for test and cleanup
  let headers: HTTPHeaders;
  let contentId: string;
  const userKey = "manager" as const;

  /**
   * Setup: Create test data via API + authenticate.
   */
  test.beforeEach(async ({ api, app }) => {
    // 1. Get auth token for API calls
    const { token } = await api.getUserTokens(userKey);
    headers = extraHTTPHeaders(token);

    // 2. Create test data via API
    // TODO: Replace with your data creation logic
    // contentId = await api.yourController.createItem(headers, { name: "Test" });

    // 3. Authenticate for UI access
    await app.authAsUser(userKey);
  });

  /**
   * Cleanup: Delete test data via API.
   */
  test.afterEach(async ({ api }) => {
    // Delete test data if it was created
    if (contentId) {
      // TODO: Replace with your cleanup logic
      // await api.yourController.deleteItem(headers, contentId);
    }
  });

  /**
   * Test that verifies API-created data is displayed in UI.
   */
  test("Created content is visible in UI @3001 @ui @content @regression", async ({
    app,
  }) => {
    // Navigate to content list page
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // TODO: Add your verification logic
    // Example: await expect(app.page.getByText("Test Content")).toBeVisible();

    // Placeholder assertion
    await expect(app.explorePage.searchField).toBeVisible();
  });
});

// ===========================================================================
// EXAMPLE 4: Standalone test with inline authentication
// ===========================================================================

/**
 * For simple standalone tests, you can authenticate inline.
 */
test("Quick authenticated test @4001 @ui @smoke", async ({ app }) => {
  // Auth + navigate in one flow
  await app.authAsUser("manager");
  await app.navigateToBasePath(app.explorePage.exploreUrl);

  // Quick verification
  await expect(app.explorePage.headerComponent.accountMenuButton).toBeVisible();
});
