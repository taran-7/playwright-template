/**
 * ============================================================================
 * E2E (END-TO-END) TEST EXAMPLE
 * ============================================================================
 *
 * This is a template for End-to-End tests that combine both UI and API
 * operations in a single test flow. E2E tests simulate real user journeys
 * and verify full system integration.
 *
 * Key concepts:
 * - Uses BOTH `app` and `api` fixtures together
 * - API for setup/teardown (faster than UI)
 * - UI for user interactions
 * - API for verification and data extraction
 * - Uses tags: @e2e, @smoke, @regression, @critical
 *
 * When to use E2E tests:
 * - Testing complete user workflows
 * - When backend state affects UI behavior
 * - For critical business flows
 * - Integration between multiple features
 *
 * Run examples:
 *   npm run e2e:test            # Run all E2E tests
 *   npx playwright test --project=chrome tests/e2e-tests/
 * ============================================================================
 */

import { test, expect } from "@customFixture";
import { extraHTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";
import type { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

/**
 * E2E test suite for a complete user workflow.
 * Example: Create resource via API → Interact via UI → Verify via API
 */
test.describe("E2E: Complete Workflow Example", () => {
  /**
   * Shared state across tests in this suite.
   */
  let headers: HTTPHeaders;
  let createdResourceId: string | null = null;

  /**
   * beforeEach: Setup authentication and any required test data.
   *
   * Pattern: Use API to authenticate (faster than UI login).
   * Then use app.authAsUser() to set cookies for browser.
   */
  test.beforeEach(async ({ api, app }) => {
    // 1. Get API tokens
    const { token } = await api.getUserTokens("manager");
    headers = extraHTTPHeaders(token);

    // 2. Authenticate browser session via cookies (bypasses login UI)
    // This is faster than logging in through the UI each time
    await app.authAsUser("manager");
  });

  /**
   * afterEach: Clean up any resources created during the test.
   *
   * Important: Always clean up test data to keep environment stable.
   * Use API for cleanup (faster and more reliable than UI).
   */
  test.afterEach(async ({ api, browser, app }) => {
    // Close all browser contexts
    await app.generalHelpers.closeAllContexts(browser);

    // Clean up created resources via API
    if (createdResourceId) {
      try {
        await api.presentationController.deletePresentation(
          headers,
          createdResourceId,
        );
        console.log(`✓ Cleaned up resource: ${createdResourceId}`);
      } catch (error) {
        console.warn(`⚠ Failed to cleanup resource: ${createdResourceId}`);
      }
      createdResourceId = null;
    }
  });

  /**
   * E2E Test: Full workflow combining API and UI.
   *
   * This test demonstrates:
   * 1. API setup (create test data)
   * 2. UI interaction (user actions)
   * 3. Mixed verification (API + UI assertions)
   * 4. Data extraction from UI for API operations
   */
  test("Complete workflow: Create → View → Verify @3001 @e2e @critical", async ({
    app,
    api,
  }) => {
    // =========================================================================
    // STEP 1: SETUP VIA API (faster than UI)
    // =========================================================================

    // Create a resource via API
    // TODO: Replace with your resource creation logic
    createdResourceId =
      await api.presentationController.makePresentationId(headers);
    expect(createdResourceId).toBeTruthy();

    console.log(`Created resource via API: ${createdResourceId}`);

    // =========================================================================
    // STEP 2: INTERACT VIA UI (user journey)
    // =========================================================================

    // Navigate to the page where the resource should appear
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // Wait for page to load
    await expect(app.explorePage.searchField).toBeVisible({ timeout: 10000 });

    // Perform UI interactions
    // TODO: Add your UI interactions here
    // Example: Search for the created resource
    await app.explorePage.searchField.fill(createdResourceId);
    await app.page.keyboard.press("Enter");

    // Wait for search results
    await app.page.waitForTimeout(2000); // Replace with proper wait condition

    // =========================================================================
    // STEP 3: VERIFY VIA UI + API
    // =========================================================================

    // UI Assertion: Check that something is visible
    // TODO: Add your UI assertions
    // await expect(app.explorePage.presentationCardByIndex(0)).toBeVisible();

    // API Verification: Validate backend state
    // TODO: Add your API verification
    // const resourceData = await api.presentationController.getPresentation(headers, createdResourceId);
    // expect(resourceData.title).toBe(expectedTitle);

    // =========================================================================
    // STEP 4: EXTRACT DATA FROM UI (if needed)
    // =========================================================================

    // Sometimes you need to extract data from UI for further API operations
    const currentUrl = app.page.url();
    const urlResourceId = currentUrl.split("/").pop();

    console.log(`Resource ID from URL: ${urlResourceId}`);
  });

  /**
   * E2E Test: Verify data created in UI is accessible via API.
   */
  test("UI created data is accessible via API @3002 @e2e @regression", async ({
    app,
    api,
  }) => {
    // Navigate to creation page
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // Perform UI actions to create something
    // TODO: Add your creation flow

    // Extract ID from URL or page
    // const newResourceId = await app.page.locator('[data-testid="resource-id"]').textContent();

    // Verify via API that the resource exists
    // const response = await api.presentationController.getPresentation(headers, newResourceId);
    // expect(response.status()).toBe(200);
  });
});

/**
 * Example: Using API for test data setup with UI verification only.
 * This pattern is useful when you want to test UI display of data.
 */
test.describe("E2E: API Setup, UI Verification", () => {
  test("Data created via API displays correctly in UI @3003 @e2e", async ({
    app,
    api,
  }) => {
    // Setup: Create data via API
    const { token } = await api.getUserTokens("manager");
    const headers = extraHTTPHeaders(token);

    // TODO: Create your test data via API
    // const resourceId = await api.someController.createResource(headers, { ... });

    // Authenticate UI session
    await app.authAsUser("manager");

    // Navigate and verify
    await app.navigateToBasePath(app.explorePage.exploreUrl);

    // Assert UI displays the data correctly
    // await expect(app.explorePage.resourceCard(resourceId)).toBeVisible();
    // await expect(app.explorePage.resourceTitle).toHaveText(expectedTitle);

    // Cleanup via API
    // await api.someController.deleteResource(headers, resourceId);
  });
});
