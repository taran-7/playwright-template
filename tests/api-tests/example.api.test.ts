/**
 * ============================================================================
 * API TEST EXAMPLE
 * ============================================================================
 *
 * This is a template for API tests that interact directly with backend
 * endpoints without browser UI.
 *
 * Key concepts:
 * - Uses `api` fixture to access API controllers with business logic
 * - Uses `request` fixture from Playwright for direct HTTP calls
 * - Makes HTTP requests and validates responses
 * - Uses tags: @api, @smoke, @regression, @critical
 * - Faster than UI tests (no browser overhead)
 *
 * Run examples:
 *   npm run api:test           # Run all API tests on test env
 *   npm run api:beta           # Run all API tests on beta env
 *   npm run critical:api:test  # Run critical API tests
 * ============================================================================
 */

import { test, expect } from "@customFixture";
import { extraHTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";
import type { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

/**
 * API test suite for Authorization endpoints.
 */
test.describe("Authorization API", () => {
  /**
   * Store auth headers for use across tests in this suite.
   * Retrieved in beforeEach hook.
   */
  let headers: HTTPHeaders;

  /**
   * beforeEach: Get authentication token before each test.
   * This pattern is common for API tests that need authentication.
   */
  test.beforeEach(async ({ api }) => {
    // Get tokens for a test user
    // TODO: Replace 'manager' with your test user key from USERS constant
    const { token } = await api.getUserTokens("manager");
    headers = extraHTTPHeaders(token);
  });

  /**
   * Basic API test example - Check authenticated endpoint.
   *
   * Uses the `request` fixture from Playwright for direct HTTP calls.
   * For complex operations, create methods in your controllers.
   *
   * Tags:
   * - @api: Marks this as an API test
   * - @auth: Feature/module tag
   * - @critical: Business-critical tests
   */
  test("Can get user info with valid token @2001 @api @auth @critical", async ({
    request,
  }) => {
    // Make direct API request using Playwright's request fixture
    const response = await request.get(
      `${process.env.BASE_URL}/api/gateway/auth/info`,
      { headers },
    );

    // Assert response status
    expect(response.status()).toBe(200);

    // Parse and validate response body
    const data = await response.json();
    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("email");
  });

  /**
   * Test for unauthorized access (negative test case).
   */
  test("Returns 401 without authentication @2002 @api @auth @regression", async ({
    request,
  }) => {
    // Make request without auth headers
    const response = await request.get(
      `${process.env.BASE_URL}/api/gateway/auth/info`,
      { headers: { "Content-Type": "application/json" } },
    );

    // Should return 401 Unauthorized
    expect(response.status()).toBe(401);
  });

  /**
   * Example with request body (POST request).
   */
  test("Can login via API @2003 @api @auth @smoke", async ({ request }) => {
    // Prepare request payload
    const loginPayload = {
      username: process.env.MANAGER_USERNAME,
      password: process.env.MANAGER_PASSWORD,
    };

    // Make POST request
    const response = await request.post(
      `${process.env.BASE_URL}/api/gateway/auth/login`,
      {
        headers: { "Content-Type": "application/json" },
        data: loginPayload,
      },
    );

    // Assert successful login
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("token");
    expect(data.token).toBeTruthy();
  });
});

/**
 * Example of using API controllers for complex operations.
 * Controllers encapsulate business logic and make tests more readable.
 */
test.describe("Using API Controllers", () => {
  /**
   * Example using controller method instead of direct request.
   * Controllers are better when:
   * - Multiple tests need the same API call
   * - Request has complex setup/validation
   * - You want to abstract API details from tests
   */
  test("Create and delete resource using controller @api @crud", async ({
    api,
  }) => {
    // Get auth headers
    const { token } = await api.getUserTokens("manager");
    const headers = extraHTTPHeaders(token);

    // Use controller method for create operation
    // TODO: Implement these methods in your controllers
    // const resourceId = await api.presentationController.create(headers);

    // Use controller method for delete operation
    // await api.presentationController.delete(headers, resourceId);

    // For now, just verify API is accessible
    expect(api.presentationController).toBeDefined();
  });
});

/**
 * Example of data-driven API test.
 * Tests the same endpoint with different inputs.
 */
test.describe("API Data-Driven Tests", () => {
  /**
   * Array of test cases for parameterized testing.
   * Each object represents a different test scenario.
   */
  const invalidCredentials = [
    {
      email: "invalid@test.com",
      password: "wrong",
      description: "invalid credentials",
    },
    { email: "", password: "password", description: "empty email" },
    { email: "valid@test.com", password: "", description: "empty password" },
  ];

  /**
   * Loop through test cases to generate tests dynamically.
   */
  for (const testCase of invalidCredentials) {
    test(`Login fails with ${testCase.description} @api @auth`, async ({
      request,
    }) => {
      const response = await request.post(
        `${process.env.BASE_URL}/api/gateway/auth/login`,
        {
          headers: { "Content-Type": "application/json" },
          data: {
            username: testCase.email,
            password: testCase.password,
          },
        },
      );

      // Note: Actual status codes may vary - adjust based on your API
      expect([400, 401, 422]).toContain(response.status());
    });
  }
});
