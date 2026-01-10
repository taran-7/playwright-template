/**
 * ============================================================================
 * EXPLORE PAGE (PAGE OBJECT EXAMPLE)
 * ============================================================================
 *
 * Another example page object demonstrating more advanced patterns:
 * - Dynamic locators (functions that return locators)
 * - Multiple components
 * - Route mocking for testing
 *
 * Usage in tests:
 *   await app.explorePage.clickOnPresentationCard(0);
 *   await app.explorePage.headerComponent.clickNewVideoButton();
 * ============================================================================
 */

import { PageHolder } from "@app/pageHolder";
import { Locator, Page, expect } from "@playwright/test";
import { NotificationComponent } from "@app/components/notificationComponent";
import { HeaderComponent } from "@app/components/headerComponent";

export default class ExplorePage extends PageHolder {
  // ===========================================================================
  // PAGE URL
  // ===========================================================================

  readonly exploreUrl: string = "/explore";

  // ===========================================================================
  // STATIC LOCATORS
  // ===========================================================================

  /** Search input field */
  readonly searchField: Locator = this.page.locator('[data-testid="search"]');

  /** Filter button */
  readonly filterButton: Locator = this.page.getByTestId(
    "portal-presentation-filter",
  );

  /** Sort dropdown */
  readonly sortOption: Locator = this.page.getByTestId(
    "portal-presentation-sorting",
  );

  /** Navigation option for saved items */
  readonly savedOptionLink: Locator = this.page.locator(
    '[data-testid="explore-page-bookmarks-navigation-option"]',
  );

  /** Navigation option for explore */
  readonly exploreLink: Locator = this.page.locator(
    '[data-testid="explore-page-navigation-option"]',
  );

  /** Container for presentations list */
  readonly presentationsList: Locator = this.page.getByTestId(
    "presentations-grid-container",
  );

  /** Error message when something goes wrong */
  readonly messageSomethingwentwrong: Locator = this.page.getByRole("heading", {
    name: "Something went wrong",
  });

  // ===========================================================================
  // DYNAMIC LOCATORS (FUNCTIONS)
  // ===========================================================================
  // Use functions when you need to pass parameters to create locators.
  // This is useful for lists, tables, or any repeating elements.
  // ===========================================================================

  /**
   * Get presentation card by index.
   *
   * @param index - Zero-based index of the card
   * @returns Locator for the card
   */
  readonly presentationCardByIndex = (index: number): Locator =>
    this.page
      .locator('[data-testid="explore-page-presentation-card"]')
      .nth(index);

  /**
   * Get presentation card by title.
   *
   * @param title - Title text to match
   * @returns Locator for the card
   */
  readonly presentationCardByTitle = (title: string): Locator =>
    this.page
      .locator('[data-testid="explore-page-presentation-card"]')
      .filter({ hasText: title })
      .first();

  /**
   * Get views counter for a specific card.
   *
   * @param index - Index of the card
   * @returns Locator for the views counter
   */
  readonly viewsCounterInPresentationCard = (index: number): Locator =>
    this.page
      .locator('[data-testid="explore-page-view-counter-presentation-card"]')
      .nth(index);

  // ===========================================================================
  // COMPONENTS
  // ===========================================================================

  /** Notification/Toast component */
  public notificationComponent: NotificationComponent;

  /** Header/Navigation component */
  public headerComponent: HeaderComponent;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================

  constructor(page: Page) {
    super(page);
    this.notificationComponent = new NotificationComponent(page);
    this.headerComponent = new HeaderComponent(page);
  }

  // ===========================================================================
  // PAGE ACTIONS
  // ===========================================================================

  /**
   * Click on filter button.
   */
  async clickOnFilterButton() {
    await this.filterButton.click();
  }

  /**
   * Click on sorting dropdown.
   */
  async clickOnSortingOptionDate() {
    await this.sortOption.click();
  }

  /**
   * Click on a presentation card by index.
   *
   * @param index - Index of the card to click
   */
  async clickOnPresentationCard(index: number) {
    const card = this.presentationCardByIndex(index);
    await card.click();
  }

  /**
   * Open presentation by title text.
   *
   * @param title - Title of the presentation
   */
  async openPresentationByTitle(title: string) {
    const presentation = this.page.getByText(title);
    await expect(presentation).toBeVisible();
    await presentation.click();
  }

  /**
   * Click on presentation card by title.
   *
   * @param title - Title to search for
   */
  async clickOnPresentationByTitle(title: string) {
    const presentation = this.presentationCardByTitle(title);
    await presentation.click();
  }

  // ===========================================================================
  // MOCKING / INTERCEPTING
  // ===========================================================================
  // Use route interception to mock API responses for testing edge cases.
  // ===========================================================================

  /**
   * Mock explore page data for testing specific scenarios.
   *
   * @param url - URL pattern to intercept
   * @param mockResponse - Response data to return
   *
   * @example
   * await explorePage.mockExploreData("/api/explore*", { presentations: [] });
   */
  async mockExploreData(url: string, mockResponse: object) {
    await this.page.route(url, (route) => {
      route.fulfill({
        body: JSON.stringify(mockResponse),
      });
    });
  }

  // ===========================================================================
  // ADD MORE PAGE-SPECIFIC METHODS HERE
  // ===========================================================================
}
