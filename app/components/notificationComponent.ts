/**
 * ============================================================================
 * NOTIFICATION COMPONENT (SIMPLE COMPONENT EXAMPLE)
 * ============================================================================
 *
 * A simple component example for toast/alert notifications.
 * Shows minimal component structure.
 *
 * Usage in page objects:
 *   public notificationComponent: NotificationComponent = new NotificationComponent(page);
 *
 * Usage in tests:
 *   await expect(app.loginPage.notificationComponent.notificationAlert).toBeVisible();
 *   const text = await app.loginPage.notificationComponent.getText();
 * ============================================================================
 */

import { Page, Locator } from "@playwright/test";

export class NotificationComponent {
  // ===========================================================================
  // PRIVATE PROPERTIES
  // ===========================================================================

  private page: Page;

  // ===========================================================================
  // LOCATORS
  // ===========================================================================

  /**
   * Main notification alert element.
   * Uses .last() to get the most recent notification if multiple exist.
   */
  readonly notificationAlert: Locator;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  constructor(page: Page) {
    this.page = page;
    // Example selector for MUI Alert component
    // TODO: Update selector based on your notification implementation
    this.notificationAlert = this.page
      .locator('[role="alert"] > div[class^="MuiAlert-message"]')
      .last();
  }

  // ===========================================================================
  // COMPONENT METHODS
  // ===========================================================================

  /**
   * Check if notification is visible.
   *
   * @returns true if notification is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.notificationAlert.isVisible();
  }

  /**
   * Get notification text content.
   *
   * @returns Text content of the notification
   */
  async getText(): Promise<string> {
    return await this.notificationAlert.innerText();
  }

  /**
   * Wait for notification to appear.
   *
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForNotification(timeout: number = 5000): Promise<void> {
    await this.notificationAlert.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for notification to disappear.
   *
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForNotificationToDisappear(timeout: number = 10000): Promise<void> {
    await this.notificationAlert.waitFor({ state: "hidden", timeout });
  }

  // ===========================================================================
  // ADD MORE NOTIFICATION METHODS HERE
  // ===========================================================================
  // Examples:
  //   - getNotificationType() - success, error, warning, info
  //   - closeNotification() - click close button
  //   - getAllNotifications() - get all visible notifications
  // ===========================================================================
}
