import pytest
from playwright.sync_api import expect

from python_playwright.constants.headers import Headers

pytestmark = [pytest.mark.e2e, pytest.mark.integration]


@pytest.mark.critical
# type: ignore[no-untyped-def]
def test_complete_workflow_create_view_verify(app, api) -> None:
    """
    E2E Test: Full workflow combining API and UI.
    1. Create resource via API
    2. Interact via UI
    3. Verify
    """
    # 1. API Setup
    tokens = api.get_user_tokens("manager")
    headers = Headers.extra_headers(tokens["token"])

    created_id = api.presentation_controller.make_presentation_id(headers)
    assert created_id is not None
    try:
        # 2. UI Interaction
        app.auth_as_user("manager")
        app.navigate_to_base_path(app.explore_page.explore_url)

        expect(app.explore_page.search_field).to_be_visible()

        # Example search interaction
        app.explore_page.search_field.fill(created_id)
        app.page.keyboard.press("Enter")

        # 3. Verification
        expect(app.explore_page.presentation_card_by_index(0)).to_be_visible()

    finally:
        # 4. Cleanup
        if created_id:
            api.presentation_controller.delete_presentation(
                headers, created_id)
