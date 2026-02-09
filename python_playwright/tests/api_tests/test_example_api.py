import pytest
from playwright.sync_api import expect

from python_playwright.config import settings

pytestmark = [pytest.mark.api, pytest.mark.integration]


@pytest.mark.auth
@pytest.mark.critical
def test_can_get_user_info_with_valid_token(  # type: ignore[no-untyped-def]
    api, auth_headers
) -> None:
    """
    Basic API test example - Check authenticated endpoint.
    """
    response = api.request.get(
        f"{settings.BASE_URL}/api/gateway/auth/info", headers=auth_headers)

    expect(response).to_be_ok()
    data = response.json()
    assert "userId" in data
    assert "email" in data


@pytest.mark.auth
@pytest.mark.regression
# type: ignore[no-untyped-def]
def test_returns_401_without_authentication(api) -> None:
    """
    Test for unauthorized access.
    """
    response = api.request.get(
        f"{settings.BASE_URL}/api/gateway/auth/info",
        headers={"Content-Type": "application/json"},
    )

    assert response.status == 401


@pytest.mark.auth
@pytest.mark.smoke
def test_can_login_via_api(api) -> None:  # type: ignore[no-untyped-def]
    """
    Example with request body (POST request).
    """
    tokens = api.get_user_tokens("manager")
    assert tokens["token"] is not None
    assert len(tokens["token"]) > 0


@pytest.mark.crud
# type: ignore[no-untyped-def]
def test_create_and_delete_resource(api, auth_headers) -> None:
    """
    Example using controller methods.
    """
    presentation_id = api.presentation_controller.make_presentation_id(
        auth_headers)

    assert presentation_id is not None
    delete_response = api.presentation_controller.delete_presentation(
        auth_headers, presentation_id)
    assert delete_response.status in {200, 204}
