from python_playwright.config import Settings


def test_placeholder_url_flag_for_example_domain():
    settings = Settings(BASE_URL="https://example.com")
    assert settings.using_placeholder_url is True


def test_placeholder_url_flag_for_real_domain():
    settings = Settings(BASE_URL="https://demo.playwright.dev")
    assert settings.using_placeholder_url is False
