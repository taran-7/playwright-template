from playwright.sync_api import Page, Locator

class NotificationComponent:
    def __init__(self, page: Page):
        self.page = page
        self.notification_alert = self.page.locator('[role="alert"] > div[class^="MuiAlert-message"]').last

    def is_visible(self) -> bool:
        """Check if notification is visible."""
        return self.notification_alert.is_visible()

    def get_text(self) -> str:
        """Get notification text content."""
        return self.notification_alert.inner_text()

    def wait_for_notification(self, timeout: int = 5000):
        """Wait for notification to appear."""
        self.notification_alert.wait_for(state="visible", timeout=timeout)

    def wait_for_notification_to_disappear(self, timeout: int = 10000):
        """Wait for notification to disappear."""
        self.notification_alert.wait_for(state="hidden", timeout=timeout)
