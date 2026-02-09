from urllib.parse import urljoin

from playwright.sync_api import Locator, Page

from python_playwright.config import settings


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def navigate_to_base_path(self, path: str = "") -> None:
        """Navigate to relative path from base URL."""
        self.page.goto(urljoin(f"{settings.BASE_URL}/", path.lstrip("/")))

    def get_cursor_style(self, locator: Locator) -> str:
        """Get cursor style of an element."""
        return locator.evaluate("el => window.getComputedStyle(el).cursor")
