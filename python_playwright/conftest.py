import pytest

from playwright.sync_api import sync_playwright
from python_playwright.api.api_manager import ApiManager
from python_playwright.app.application import Application
from python_playwright.config import settings


@pytest.fixture(scope="session")
def api_context():
    """
    Session-scoped API Request Context.
    Reused across tests for performance.
    """
    with sync_playwright() as p:
        request_context = p.request.new_context(base_url=settings.BASE_URL)
        yield request_context
        request_context.dispose()


@pytest.fixture(scope="session")
def api(api_context):
    """
    API Manager fixture. Used for API-only tests or setup/teardown.
    """
    return ApiManager(api_context)


@pytest.fixture(scope="function")
def app(page, api):
    """
    Application fixture.
    Provides Page Objects and access to API manager.
    """
    app_instance = Application(page, api)
    yield app_instance
    # Cleanup if needed (page handles closed by pytest-playwright)


@pytest.fixture(scope="function")
def auth_headers(api):
    """
    Helper fixture to get headers for default manager user.
    """
    from python_playwright.constants.headers import Headers
    tokens = api.get_user_tokens("manager")
    return Headers.extra_headers(tokens["token"])
