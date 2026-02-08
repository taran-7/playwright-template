from playwright.sync_api import Page
from python_playwright.app.base_page import BasePage
from python_playwright.api.api_manager import ApiManager
from python_playwright.app.pages.login_page import LoginPage
from python_playwright.app.pages.explore_page import ExplorePage


class Application(BasePage):
    def __init__(self, page: Page, api: ApiManager):
        super().__init__(page)
        self.api = api

        # Initialize Pages
        self.login_page = LoginPage(page)
        self.explore_page = ExplorePage(page)

        # General helpers can be methods here or separate class

    def auth_as_user(self, user_key: str):
        """Authenticate as a user by setting cookies directly."""
        tokens = self.api.get_user_tokens(user_key)

        from urllib.parse import urlparse
        from python_playwright.config import settings

        domain = urlparse(settings.BASE_URL).hostname

        # In Python Playwright context.add_cookies takes a list of dicts
        self.page.context.add_cookies([
            {
                "name": "at",
                "value": tokens["token"],
                "domain": domain,
                "path": "/"
            },
            {
                "name": "rt",
                "value": tokens["refreshToken"],
                "domain": domain,
                "path": "/"
            }
        ])

    def clear_auth(self):
        """Clear all cookies."""
        self.page.context.clear_cookies()
