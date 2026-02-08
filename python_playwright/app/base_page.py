from playwright.sync_api import Page, Locator
from python_playwright.config import settings

class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def navigate_to_base_path(self, path: str = ""):
        """Navigate to relative path from base URL."""
        self.page.goto(f"{settings.BASE_URL}{path}")

    def get_cursor_style(self, locator: Locator) -> str:
        """Get cursor style of an element."""
        return locator.evaluate("el => window.getComputedStyle(el).cursor")
