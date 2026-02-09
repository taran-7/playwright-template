import pytest
from playwright.sync_api import expect

from python_playwright.config import settings

pytestmark = [pytest.mark.ui, pytest.mark.integration]


@pytest.mark.login
@pytest.mark.smoke
# type: ignore[no-untyped-def]
def test_user_can_see_login_form_elements(app) -> None:
    """
    Basic UI test example - checking visible elements.
    """
    app.navigate_to_base_path(app.login_page.login_url)

    expect(app.login_page.email_field).to_be_visible()
    expect(app.login_page.password_field).to_be_visible()
    expect(app.login_page.login_button).to_be_visible()


@pytest.mark.login
# type: ignore[no-untyped-def]
def test_user_can_login_with_valid_credentials_via_ui(app) -> None:
    """
    Test with UI login action.
    """
    app.navigate_to_base_path(app.login_page.login_url)

    app.login_page.login(settings.MANAGER_USERNAME, settings.MANAGER_PASSWORD)

    # Assert successful login (Explore page visible)
    expect(app.explore_page.search_field).to_be_visible(timeout=10000)


@pytest.mark.explore
@pytest.mark.smoke
# type: ignore[no-untyped-def]
def test_authenticated_user_can_see_explore_page(app) -> None:
    """
    Test with Token Authentication (bypass UI login).
    """
    app.auth_as_user("manager")
    app.navigate_to_base_path(app.explore_page.explore_url)

    expect(app.explore_page.search_field).to_be_visible()
    expect(app.explore_page.header_component.account_menu_button).to_be_visible()


@pytest.mark.explore
# type: ignore[no-untyped-def]
def test_user_can_open_account_menu(app) -> None:
    """
    Test interaction with header component.
    """
    app.auth_as_user("manager")
    app.navigate_to_base_path(app.explore_page.explore_url)

    app.explore_page.header_component.click_my_account_button()
    expect(app.explore_page.header_component.log_out_button).to_be_visible()
