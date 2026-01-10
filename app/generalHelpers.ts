/**
 * ============================================================================
 * GENERAL HELPERS
 * ============================================================================
 *
 * Helper methods for common test operations.
 * Used through app.generalHelpers in tests.
 *
 * Usage:
 *   test("example", async ({ app }) => {
 *     const text = await app.generalHelpers.getClipboardText();
 *     await app.generalHelpers.closeAllContexts(browser);
 *   });
 * ============================================================================
 */

import { Browser, expect, Locator, Page } from "@playwright/test";

export default class GeneralHelpers {
  constructor(public page: Page) {
    this.page = page;
  }

  /**
   * Check if element has specific color.
   *
   * @param locator - Element to check
   * @param rgbColorElement - Expected RGB color (e.g., "rgb(255, 0, 0)")
   */
  async checkColorOfElement(
    locator: Locator,
    rgbColorElement: string,
  ): Promise<boolean> {
    const col = await locator?.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("color"),
    );
    expect(col).toEqual(rgbColorElement);
    return true;
  }

  /**
   * Get text from clipboard.
   * Handles differences between browsers.
   */
  async getClipboardText(): Promise<string> {
    const browserName = this.page.context().browser()?.browserType().name();

    if (browserName === "firefox") {
      // Firefox doesn't support navigator.clipboard.readText()
      const handle = await this.page.evaluateHandle(() => {
        const textarea = document.createElement("textarea");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        return textarea;
      });

      const isMac = process.platform === "darwin";
      await this.page.keyboard.press(isMac ? "Meta+V" : "Control+V");

      const text = await handle.evaluate((el) => el.value);
      await handle.evaluate((el) => el.remove());
      return text;
    }

    // Chrome and other browsers
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  /**
   * Close all browser contexts.
   * Useful for cleanup in afterEach hooks.
   *
   * @param browser - Browser instance
   */
  async closeAllContexts(browser: Browser): Promise<void> {
    const contexts = browser.contexts();
    for (const context of contexts) {
      await context.close();
    }
  }

  /**
   * Wait for network to be idle.
   * Useful after actions that trigger multiple API calls.
   */
  async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  /**
   * Scroll element into view.
   *
   * @param locator - Element to scroll to
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get element's background color.
   *
   * @param locator - Element to check
   * @returns Background color in RGB format
   */
  async getBackgroundColor(locator: Locator): Promise<string> {
    return await locator.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("background-color"),
    );
  }

  // ===========================================================================
  // ADD MORE HELPERS HERE
  // ===========================================================================
  // Examples:
  //   - downloadFile(url)
  //   - uploadFile(locator, filePath)
  //   - waitForToast(message)
  //   - compareScreenshots(baseline, current)
  // ===========================================================================
}
