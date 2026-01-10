/**
 * ============================================================================
 * PAGE HOLDER (BASE CLASS FOR PAGE OBJECTS)
 * ============================================================================
 *
 * Abstract base class that all page objects should extend.
 * Provides common utilities for page interactions.
 *
 * Usage:
 *   export default class MyPage extends PageHolder {
 *     readonly myElement: Locator = this.page.locator("#my-element");
 *
 *     async clickMyElement() {
 *       await this.myElement.click();
 *     }
 *   }
 * ============================================================================
 */

import { Page, Locator } from "@playwright/test";
import ENV from "../env";

export abstract class PageHolder {
  /**
   * Playwright Page instance.
   * Use this to access page methods and create locators.
   */
  constructor(public page: Page) {}

  /**
   * Navigate to a path relative to BASE_URL.
   *
   * @param url - Path to navigate to (e.g., "/login", "/dashboard")
   *
   * @example
   * await this.navigateToBasePath("/login");
   * // Navigates to: https://your-app.com/login
   */
  async navigateToBasePath(url: string = "") {
    await this.page.goto(`${ENV.BASE_URL}${url}`);
  }

  /**
   * Get the CSS cursor style of an element.
   * Useful for verifying interactive elements.
   *
   * @param locator - Element to check
   * @returns Cursor style (e.g., "pointer", "default", "not-allowed")
   */
  async getCursorStyle(locator: Locator): Promise<string> {
    return await locator.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
  }

  // ===========================================================================
  // ADD MORE COMMON PAGE UTILITIES HERE
  // ===========================================================================
  // Examples:
  //   - waitForPageLoad()
  //   - scrollToElement(locator)
  //   - takeScreenshot(name)
  // ===========================================================================
}
