from playwright.sync_api import Page


class HeaderComponent:
    def __init__(self, page: Page):
        self.page = page

        # Locators
        self.account_menu_button = self.page.locator(
            '[data-testid="header-account-menu"]')
        self.log_out_button = self.page.locator(
            'a[data-testid="header-log-out"]')
        self.header_manage_button = self.page.locator(
            '[data-testid="header-manage-link"]')
        self.header_users_button = self.page.locator(
            '[data-testid="header-users-link"]')
        self.header_analyze_button = self.page.locator(
            '[data-testid="header-analyze-link"]')
        self.header_create_button = self.page.locator(
            '[data-testid="header-create-link"]')
        self.header_video_hub_button = self.page.locator(
            '[data-testid="header-explore-link"]')
        self.header_presentations_button = self.page.locator(
            '[data-testid="header-my-videos-link"]'
        )

        self.new_video_button = self.page.locator(
            '[data-testid="create-video-button"]')
        self.create_video_menu = self.page.locator(
            '[data-testid="create-video-button-menu"]')
        self.record_video_button = self.page.locator(
            '[data-testid="record-video"]')
        self.upload_file_button = self.page.locator(
            '[data-testid="upload-file"]')

        self.my_account_link = self.page.locator(
            '[data-testid="header-my-account"]')
        self.help_center_link = self.page.locator(
            '[data-testid="header-academy"]')
        self.contact_link = self.page.locator('[data-testid="header-contact"]')
        self.language_link = self.page.locator(
            '[data-testid="header-language-switcher"]')

    def click_my_account_button(self) -> None:
        """Open account menu dropdown."""
        self.account_menu_button.wait_for(state="visible")
        self.account_menu_button.click()

    def click_log_out_button(self) -> None:
        """Click logout button."""
        self.log_out_button.wait_for(state="visible")
        self.log_out_button.click()

    def logout(self) -> None:
        """Perform logout action."""
        self.click_my_account_button()
        self.click_log_out_button()

    def click_manage_button(self) -> None:
        self.header_manage_button.wait_for(state="visible")
        self.header_manage_button.click()

    def click_users_button(self) -> None:
        self.header_users_button.wait_for(state="visible")
        self.header_users_button.click()

    def click_create_button(self) -> None:
        self.header_create_button.wait_for(state="visible")
        self.header_create_button.click()

    def click_video_hub_button(self) -> None:
        self.header_video_hub_button.wait_for(state="visible")
        self.header_video_hub_button.click()

    def click_new_video_button(self) -> None:
        self.new_video_button.wait_for(state="visible")
        self.new_video_button.click()

    def click_upload_file_button(self) -> None:
        self.upload_file_button.wait_for(state="visible")
        self.upload_file_button.click()
