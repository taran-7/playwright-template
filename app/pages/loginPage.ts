/**
 * ============================================================================
 * LOGIN PAGE (PAGE OBJECT EXAMPLE)
 * ============================================================================
 *
 * This is an example page object that demonstrates the Page Object Model pattern.
 *
 * Key concepts:
 * - Extends PageHolder for common utilities
 * - URL as class property for easy navigation
 * - Locators as readonly properties (initialized once)
 * - Methods for user actions (login, fill fields, click buttons)
 * - Can include component instances
 *
 * Usage in tests:
 *   await app.loginPage.navigateToBasePath(app.loginPage.loginUrl);
 *   await app.loginPage.login("user@example.com", "password123");
 * ============================================================================
 */

import { PageHolder } from "@app/pageHolder";
import { NotificationComponent } from "@app/components/notificationComponent";
import { Locator, Page } from "@playwright/test";

export default class LoginPage extends PageHolder {
  // ===========================================================================
  // PAGE URL
  // ===========================================================================

  /** URL path for this page (relative to BASE_URL) */
  readonly loginUrl: string = "/login";

  // ===========================================================================
  // LOCATORS
  // ===========================================================================
  // Define all element locators as readonly class properties.
  // Use data-testid when available, fall back to semantic locators.
  //
  // Best practices:
  //   - Use data-testid for custom test attributes
  //   - Use getByRole, getByText for accessibility
  //   - Avoid brittle selectors like CSS classes
  // ===========================================================================

  /** Email input field */
  readonly emailField: Locator = this.page.locator("input[name='email']");

  /** Password input field */
  readonly passwordField: Locator = this.page.locator("input[name='password']");

  /** Login/Submit button */
  readonly loginButton: Locator = this.page.locator("button[type='submit']");

  /** Forgot password link */
  readonly forgotPasswordLink: Locator = this.page.locator("button", {
    hasText: "Forgot your password?",
  });

  /** Sign up link */
  readonly signUpLink: Locator = this.page.locator("button", {
    hasText: "Sign up",
  });

  /** Login with Microsoft button (example of third-party auth) */
  readonly loginWithMicrosoftButton: Locator = this.page
    .locator("button")
    .filter({ hasText: "Login with Microsoft" });

  // ===========================================================================
  // COMPONENTS
  // ===========================================================================
  // Include reusable components that appear on this page.
  // Components are separate classes for shared UI elements.
  // ===========================================================================

  /** Notification/Alert component for error messages */
  public notificationComponent: NotificationComponent;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  constructor(page: Page) {
    super(page);
    // Initialize components
    this.notificationComponent = new NotificationComponent(page);
  }

  // ===========================================================================
  // PAGE ACTIONS
  // ===========================================================================
  // Define methods for user actions on this page.
  // Keep methods focused on single actions or small workflows.
  // ===========================================================================

  /**
   * Clear all cookies (useful for testing logout scenarios).
   */
  async clearCookies() {
    await this.page.context().clearCookies();
  }

  /**
   * Perform login with email and password.
   *
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
  }

  /**
   * Fill email field.
   *
   * @param email - Email to enter
   */
  async fillEmail(email: string) {
    await this.emailField.waitFor({ state: "visible" });
    await this.emailField.fill(email);
  }

  /**
   * Fill password field.
   *
   * @param password - Password to enter
   */
  async fillPassword(password: string) {
    await this.passwordField.waitFor({ state: "visible" });
    await this.passwordField.fill(password);
  }

  /**
   * Click the sign up link.
   */
  async clickSignUpLink() {
    await this.signUpLink.waitFor({ state: "visible" });
    await this.signUpLink.click();
  }

  /**
   * Click login with Microsoft button.
   */
  async loginWithMicrosoft() {
    await this.loginWithMicrosoftButton.waitFor({ state: "visible" });
    await this.loginWithMicrosoftButton.click();
  }

  // ===========================================================================
  // ADD MORE PAGE-SPECIFIC METHODS HERE
  // ===========================================================================
}
