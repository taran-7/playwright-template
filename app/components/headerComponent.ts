/**
 * ============================================================================
 * HEADER COMPONENT (COMPONENT EXAMPLE)
 * ============================================================================
 *
 * Components are reusable UI elements that appear on multiple pages.
 * Unlike pages, components don't extend PageHolder - they receive the page
 * in their constructor.
 *
 * Use components for:
 * - Navigation bars
 * - Headers/Footers
 * - Modals/Dialogs
 * - Sidebars
 * - Any UI element shared across pages
 *
 * Usage in page objects:
 *   public headerComponent: HeaderComponent = new HeaderComponent(this.page);
 *
 * Usage in tests:
 *   await app.explorePage.headerComponent.clickLogOutButton();
 * ============================================================================
 */

import { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  // ===========================================================================
  // PRIVATE PROPERTIES
  // ===========================================================================

  private page: Page;

  // ===========================================================================
  // LOCATORS
  // ===========================================================================

  /** Account menu button (opens dropdown) */
  readonly accountMenuButton: Locator;

  /** Logout button in account menu */
  readonly logOutButton: Locator;

  /** Main navigation links */
  readonly headerManageButton: Locator;
  readonly headerUsersButton: Locator;
  readonly headerAnalyzeButton: Locator;
  readonly headerCreateButton: Locator;
  readonly headerVideoHubButton: Locator;
  readonly headerPresentationsButton: Locator;

  /** Create/Action buttons */
  readonly newVideoButton: Locator;
  readonly createVideoMenu: Locator;
  readonly recordVideoButton: Locator;
  readonly uploadFileButton: Locator;

  /** Account menu items */
  readonly myAccountLink: Locator;
  readonly helpCenterLink: Locator;
  readonly contactLink: Locator;
  readonly languageLink: Locator;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    // Using data-testid for reliable element selection
    this.accountMenuButton = this.page.locator(
      '[data-testid="header-account-menu"]',
    );
    this.logOutButton = this.page.locator('a[data-testid="header-log-out"]');
    this.headerManageButton = this.page.locator(
      '[data-testid="header-manage-link"]',
    );
    this.headerUsersButton = this.page.locator(
      '[data-testid="header-users-link"]',
    );
    this.headerAnalyzeButton = this.page.locator(
      '[data-testid="header-analyze-link"]',
    );
    this.headerCreateButton = this.page.locator(
      '[data-testid="header-create-link"]',
    );
    this.headerVideoHubButton = this.page.locator(
      '[data-testid="header-explore-link"]',
    );
    this.headerPresentationsButton = this.page.locator(
      '[data-testid="header-my-videos-link"]',
    );
    this.newVideoButton = this.page.locator(
      '[data-testid="create-video-button"]',
    );
    this.createVideoMenu = this.page.locator(
      '[data-testid="create-video-button-menu"]',
    );
    this.recordVideoButton = this.page.locator('[data-testid="record-video"]');
    this.uploadFileButton = this.page.locator('[data-testid="upload-file"]');
    this.myAccountLink = this.page.locator('[data-testid="header-my-account"]');
    this.helpCenterLink = this.page.locator('[data-testid="header-academy"]');
    this.contactLink = this.page.locator('[data-testid="header-contact"]');
    this.languageLink = this.page.locator(
      '[data-testid="header-language-switcher"]',
    );
  }

  // ===========================================================================
  // COMPONENT ACTIONS
  // ===========================================================================

  /**
   * Open account menu dropdown.
   */
  async clickMyAccountButton() {
    await this.accountMenuButton.waitFor({ state: "visible" });
    await this.accountMenuButton.click();
  }

  /**
   * Click logout button (requires account menu to be open).
   */
  async clickLogOutButton() {
    await this.logOutButton.waitFor({ state: "visible" });
    await this.logOutButton.click();
  }

  /**
   * Perform logout action (opens menu and clicks logout).
   */
  async logout() {
    await this.clickMyAccountButton();
    await this.clickLogOutButton();
  }

  /**
   * Navigate to Manage page.
   */
  async clickManageButton() {
    await this.headerManageButton.waitFor({ state: "visible" });
    await this.headerManageButton.click();
  }

  /**
   * Navigate to Users page.
   */
  async clickUsersButton() {
    await this.headerUsersButton.waitFor({ state: "visible" });
    await this.headerUsersButton.click();
  }

  /**
   * Navigate to Create page.
   */
  async clickCreateButton() {
    await this.headerCreateButton.waitFor({ state: "visible" });
    await this.headerCreateButton.click();
  }

  /**
   * Navigate to Video Hub/Explore page.
   */
  async clickVideoHubButton() {
    await this.headerVideoHubButton.waitFor({ state: "visible" });
    await this.headerVideoHubButton.click();
  }

  /**
   * Click New Video button to open creation menu.
   */
  async clickNewVideoButton() {
    await this.newVideoButton.waitFor({ state: "visible" });
    await this.newVideoButton.click();
  }

  /**
   * Click Upload File option from creation menu.
   */
  async clickUploadFileButton() {
    await this.uploadFileButton.waitFor({ state: "visible" });
    await this.uploadFileButton.click();
  }

  // ===========================================================================
  // ADD MORE COMPONENT ACTIONS HERE
  // ===========================================================================
}
