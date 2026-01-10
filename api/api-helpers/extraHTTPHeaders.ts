/**
 * HTTP HEADERS UTILITIES
 *
 * This file contains helper functions and constants for HTTP headers.
 * Use these when making API requests that require specific headers.
 *
 * TODO: Add your own header configurations as needed
 */

/**
 * HTTPHeaders type - Common headers used in API requests
 * Extend this type if you need additional headers
 */
export type HTTPHeaders = {
  cookie?: string;
  Authorization?: string;
  "Content-Type"?: string;
  Referer?: string;
  // TODO: Add custom headers as needed, e.g.:
  // "X-Custom-Header"?: string;
};

/**
 * Headers for requests without authentication
 */
export const extraHTTPHeadersWithoutToken: HTTPHeaders = {
  "Content-Type": "application/json",
};

/**
 * Headers with cookie-based authentication
 * Use this when API requires cookie auth
 *
 * @param userToken - The authentication token for the user
 * @returns HTTPHeaders object with cookie and content-type
 *
 * Example:
 * ```typescript
 * const headers = extraHTTPHeaders(user.token);
 * await request.post('/api/endpoint', { headers, data: payload });
 * ```
 */
export const extraHTTPHeaders = (userToken: string): HTTPHeaders => {
  return {
    cookie: `at=${userToken}`,
    "Content-Type": "application/json",
  };
};

/**
 * Headers for form data submissions
 */
export const extraHTTPFormHeaders: HTTPHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
};

/**
 * Headers with Bearer token authentication
 * Use this when API requires Authorization header
 *
 * @param bearerToken - The bearer token for authentication
 * @returns HTTPHeaders object with Authorization header
 */
export const extraHTTPBearerHeaders = (bearerToken: string): HTTPHeaders => {
  return {
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  };
};
