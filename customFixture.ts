/**
 * ============================================================================
 * CUSTOM FIXTURES
 * ============================================================================
 *
 * This file extends Playwright's base test with custom fixtures that provide:
 * - `app`: Application class with all page objects and UI helpers
 * - `api`: API class with all API controllers for backend operations
 *
 * Fixtures are automatically created before each test and cleaned up after.
 *
 * Usage in tests:
 *   import { test, expect } from "@customFixture";
 *
 *   test("example", async ({ app, api }) => {
 *     // app - for UI operations
 *     // api - for API operations
 *   });
 *
 * Learn more: https://playwright.dev/docs/test-fixtures
 * ============================================================================
 */

import {
  test as base,
  TestInfo,
  APIRequestContext,
  BrowserContext,
  Page,
} from "@playwright/test";
import { Application } from "@app/app";
import { API } from "@api/api";

// ============================================================================
// FIXTURE TYPE DEFINITIONS
// ============================================================================

/**
 * Define the shape of your custom fixtures.
 * Add new fixtures here as your project grows.
 */
type Fixtures = {
  /** Application instance with page objects for UI testing */
  app: Application;
  /** API instance with controllers for backend testing */
  api: API;
};

// ============================================================================
// EXTEND BASE TEST WITH CUSTOM FIXTURES
// ============================================================================

export const test = base.extend<Fixtures>({
  /**
   * API Fixture
   *
   * Creates an API request context and provides the API class instance.
   * Use for direct API calls without browser overhead.
   *
   * Lifecycle:
   * 1. Create request context with base URL
   * 2. Instantiate API class with all controllers
   * 3. Provide to test via `api` parameter
   * 4. Dispose request context after test
   */
  api: async ({ playwright }, use) => {
    const requestContext: APIRequestContext =
      await playwright.request.newContext({
        baseURL: process.env.BASE_URL,
      });

    const api = new API(requestContext);
    await use(api);
    await requestContext.dispose();
  },

  /**
   * Application Fixture
   *
   * Creates a browser context/page and provides the Application class.
   * The Application class contains all page objects.
   *
   * Note: The `api` fixture is injected into Application, allowing
   * page objects to make API calls (e.g., for authentication).
   *
   * Lifecycle:
   * 1. Create browser context and page
   * 2. Instantiate Application with page and api
   * 3. Provide to test via `app` parameter
   * 4. Close page and context after test
   * 5. Warn if any contexts remain open (memory leak detection)
   */
  app: async ({ browser, api }, use, testInfo: TestInfo) => {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();
    const app = new Application(page, api);

    await use(app);

    // Cleanup: Close page and context
    if (!page.isClosed()) {
      await page.close();
    }
    if (!(context as any)._closed) {
      await context.close();
    }

    // Memory leak detection: Warn if contexts weren't properly closed
    const openContexts = browser
      .contexts()
      .filter((ctx) => !(ctx as any)._closed);
    if (openContexts.length > 0) {
      console.warn(
        `🟡 [${testInfo.title}] — after the test, ${openContexts.length} open contexts remain.`,
      );
      for (const [i, ctx] of openContexts.entries()) {
        const urls = await Promise.all(ctx.pages().map((p) => p.url()));
        console.warn(`→ Context ${i + 1}: pages [${urls.join(", ")}]`);
      }
    }
  },
});

// ============================================================================
// TEST HOOKS
// ============================================================================

/**
 * Adds GitHub Actions run URL to test annotations.
 * Useful for tracing failed tests back to CI runs.
 */
function applyGitHubAnnotation(testInfo: TestInfo) {
  const hasAuthTag = testInfo.annotations.some((a) =>
    a.description?.toLowerCase().includes("@auth"),
  );

  if (!hasAuthTag) {
    testInfo.annotations.push({
      type: "GitHub Actions run:",
      description: process.env.GITHUB_RUN_URL ?? "Not available",
    });
  }
}

// Re-export expect for convenience
export { expect } from "@playwright/test";

// Apply GitHub annotation to all tests
test.beforeEach(async ({}, testInfo) => {
  applyGitHubAnnotation(testInfo);
});
