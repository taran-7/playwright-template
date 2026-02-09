from playwright.sync_api import Page

from python_playwright.app.base_page import BasePage
from python_playwright.app.components.notification import NotificationComponent


class LoginPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.notification_component = NotificationComponent(page)

        self.login_url = "/login"

        # Locators
        self.email_field = self.page.locator("input[name='email']")
        self.password_field = self.page.locator("input[name='password']")
        self.login_button = self.page.locator("button[type='submit']")
        self.forgot_password_link = self.page.locator(
            "button", has_text="Forgot your password?")
        self.sign_up_link = self.page.locator("button", has_text="Sign up")
        self.login_with_microsoft_button = self.page.locator("button").filter(
            has_text="Login with Microsoft"
        )

    def clear_cookies(self) -> None:
        """Clear all cookies."""
        self.page.context.clear_cookies()

    def login(self, email: str, password: str) -> None:
        """Perform login with email and password."""
        self.fill_email(email)
        self.fill_password(password)
        self.login_button.click()

    def fill_email(self, email: str) -> None:
        self.email_field.wait_for(state="visible")
        self.email_field.fill(email)

    def fill_password(self, password: str) -> None:
        self.password_field.wait_for(state="visible")
        self.password_field.fill(password)

    def click_sign_up_link(self) -> None:
        self.sign_up_link.wait_for(state="visible")
        self.sign_up_link.click()

    def login_with_microsoft(self) -> None:
        self.login_with_microsoft_button.wait_for(state="visible")
        self.login_with_microsoft_button.click()
