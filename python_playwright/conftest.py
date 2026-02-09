import pytest

from playwright.sync_api import sync_playwright
from python_playwright.api.api_manager import ApiManager
from python_playwright.app.application import Application
from python_playwright.config import settings


def pytest_addoption(parser):
    parser.addoption(
        "--run-integration",
        action="store_true",
        default=False,
        help="Run tests marked as integration (require configured environment).",
    )


def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "integration: marks tests that require external environment and credentials",
    )


def pytest_collection_modifyitems(config, items):
    if config.getoption("--run-integration"):
        return

    skip_integration = pytest.mark.skip(
        reason="integration test (use --run-integration to execute)"
    )
    for item in items:
        if "integration" in item.keywords:
            item.add_marker(skip_integration)


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
    page.set_default_timeout(15_000)
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


@pytest.fixture(autouse=True)
def _validate_integration_requirements(request):
    if "integration" not in request.keywords:
        return

    if settings.using_placeholder_url:
        pytest.skip("BASE_URL is still placeholder. Configure .env.<env> for integration tests.")

    credentials_missing = not settings.MANAGER_USERNAME or not settings.MANAGER_PASSWORD
    if credentials_missing:
        pytest.skip("Manager credentials are not configured for integration tests.")
