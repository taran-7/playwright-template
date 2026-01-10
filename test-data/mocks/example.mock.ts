/**
 * MOCK DATA EXAMPLE
 *
 * This file contains example mock data for route mocking in UI tests.
 *
 * Mock data is used to:
 * - Test UI with controlled data
 * - Test edge cases (empty lists, errors, etc.)
 * - Speed up tests by avoiding real API calls
 *
 * Usage in tests:
 *   import { mockProducts } from "@test-data/mocks/example.mock";
 *
 *   await page.route("**\/api/products", async (route) => {
 *     await route.fulfill({ json: mockProducts });
 *   });
 *
 * TODO: Add your own mock data files here
 */

/**
 * Example: Mock product list response
 */
export const mockProducts = {
  items: [
    {
      id: "1",
      name: "Product 1",
      price: 99.99,
      inStock: true,
    },
    {
      id: "2",
      name: "Product 2",
      price: 149.99,
      inStock: false,
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

/**
 * Example: Empty list response (for testing empty states)
 */
export const mockEmptyProducts = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
};

/**
 * Example: Error response (for testing error handling)
 */
export const mockErrorResponse = {
  error: "Something went wrong",
  code: "INTERNAL_ERROR",
  status: 500,
};

/**
 * Example: User profile mock
 */
export const mockUserProfile = {
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  role: "admin",
  createdAt: "2024-01-01T00:00:00Z",
};
