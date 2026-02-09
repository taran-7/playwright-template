import pytest
from playwright.sync_api import Page, expect
from faker import Faker

pytestmark = [pytest.mark.ui, pytest.mark.integration]


def test_google_search(page: Page):
    fake = Faker()
    random_text = fake.sentence()

    page.goto("https://google.com.ua")

    search_input = page.locator("textarea[name='q']").or_(page.locator("input[name='q']"))

    expect(search_input).to_be_visible()

    search_input.fill(random_text)

    expect(search_input).to_have_value(random_text)

    search_input.clear()
    expect(search_input).to_have_value("")
