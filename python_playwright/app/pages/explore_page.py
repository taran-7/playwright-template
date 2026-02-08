from playwright.sync_api import Page, Locator, expect
from python_playwright.app.base_page import BasePage
from python_playwright.app.components.notification import NotificationComponent
from python_playwright.app.components.header import HeaderComponent

class ExplorePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.notification_component = NotificationComponent(page)
        self.header_component = HeaderComponent(page)
        
        self.explore_url = "/explore"
        
        # Locators
        self.search_field = self.page.locator('[data-testid="search"]')
        self.filter_button = self.page.locator('[data-testid="portal-presentation-filter"]')
        self.sort_option = self.page.locator('[data-testid="portal-presentation-sorting"]')
        self.saved_option_link = self.page.locator('[data-testid="explore-page-bookmarks-navigation-option"]')
        self.explore_link = self.page.locator('[data-testid="explore-page-navigation-option"]')
        self.presentations_list = self.page.locator('[data-testid="presentations-grid-container"]')
        self.message_something_went_wrong = self.page.get_by_role("heading", name="Something went wrong")

    def presentation_card_by_index(self, index: int) -> Locator:
        return self.page.locator('[data-testid="explore-page-presentation-card"]').nth(index)

    def presentation_card_by_title(self, title: str) -> Locator:
        return self.page.locator('[data-testid="explore-page-presentation-card"]').filter(has_text=title).first

    def views_counter_in_presentation_card(self, index: int) -> Locator:
        return self.page.locator('[data-testid="explore-page-view-counter-presentation-card"]').nth(index)

    def click_on_filter_button(self):
        self.filter_button.click()

    def click_on_sorting_option_date(self):
        self.sort_option.click()

    def click_on_presentation_card(self, index: int):
        card = self.presentation_card_by_index(index)
        card.click()

    def open_presentation_by_title(self, title: str):
        presentation = self.page.get_by_text(title)
        expect(presentation).to_be_visible()
        presentation.click()

    def click_on_presentation_by_title(self, title: str):
        presentation = self.presentation_card_by_title(title)
        presentation.click()

    def mock_explore_data(self, url: str, mock_response: dict):
        """Mock explore page data."""
        self.page.route(url, lambda route: route.fulfill(body=str(mock_response))) # Note: passing simplified string body
