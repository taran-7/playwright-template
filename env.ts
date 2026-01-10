/**
 * ============================================================================
 * ENVIRONMENT CONFIGURATION
 * ============================================================================
 *
 * This file maps environment variables to typed static properties.
 * Add new environment variables here as your project grows.
 *
 * Usage:
 *   import ENV from "env";
 *   const baseUrl = ENV.BASE_URL;
 *   const managerUser = ENV.MANAGER_USERNAME;
 *
 * Environment variables are loaded from .env files:
 *   - .env.test  (test environment)
 *   - .env.beta  (beta/staging environment)
 *   - .env.prod  (production environment)
 *
 * See global-setup.ts for how .env files are loaded.
 * ============================================================================
 */

export default class Config {
  // ===========================================================================
  // BASE CONFIGURATION
  // ===========================================================================

  /** Base URL of the application under test */
  public static BASE_URL: string = process.env.BASE_URL;

  /** Production URL (if different from test environment) */
  public static URL_PROD: string = process.env.URL_PROD;

  // ===========================================================================
  // USER CREDENTIALS
  // ===========================================================================
  // Define your test users here. Each user should have USERNAME and PASSWORD.
  // Map these to corresponding environment variables in your .env files.
  //
  // Naming convention:
  //   - ROLE_USERNAME / ROLE_PASSWORD (e.g., ADMIN_USERNAME, VIEWER_PASSWORD)
  //   - USER_XXXX / USER_XXXX_PASSWORD (for numbered test accounts)
  // ===========================================================================

  /**
   * Manager/Admin user with full permissions.
   * Use for tests that require elevated privileges.
   */
  public static MANAGER_USERNAME: string = process.env.MANAGER_USERNAME;
  public static MANAGER_PASSWORD: string = process.env.MANAGER_PASSWORD;

  /**
   * Regular user with standard permissions.
   * Use for typical user flow tests.
   */
  public static USER_STANDARD_USERNAME: string =
    process.env.USER_STANDARD_USERNAME;
  public static USER_STANDARD_PASSWORD: string =
    process.env.USER_STANDARD_PASSWORD;

  /**
   * User with limited permissions.
   * Use for permission/authorization tests.
   */
  public static USER_LIMITED_USERNAME: string =
    process.env.USER_LIMITED_USERNAME;
  public static USER_LIMITED_PASSWORD: string =
    process.env.USER_LIMITED_PASSWORD;

  // ===========================================================================
  // ADD MORE USERS AS NEEDED
  // ===========================================================================
  // Template for adding new users:
  //
  // public static USER_FEATURE_X_USERNAME: string = process.env.USER_FEATURE_X_USERNAME;
  // public static USER_FEATURE_X_PASSWORD: string = process.env.USER_FEATURE_X_PASSWORD;
  // ===========================================================================

  // ===========================================================================
  // EXTERNAL SERVICES (optional)
  // ===========================================================================

  /** Gmail credentials for email verification tests */
  public static GMAIL_USER: string = process.env.GMAIL_USER;
  public static GMAIL_APP_PASSWORD: string = process.env.GMAIL_APP_PASSWORD;

  /** Third-party API keys */
  public static EXTERNAL_API_KEY: string = process.env.EXTERNAL_API_KEY;
}
