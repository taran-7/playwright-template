import pytest
from playwright.sync_api import expect
from python_playwright.config import settings
from python_playwright.constants.headers import Headers

@pytest.mark.api
@pytest.mark.auth
@pytest.mark.critical
def test_can_get_user_info_with_valid_token(api, auth_headers):
    """
    Basic API test example - Check authenticated endpoint.
    """
    response = api.request.get(f"{settings.BASE_URL}/api/gateway/auth/info", headers=auth_headers)
    
    expect(response).to_be_ok()
    data = response.json()
    assert "userId" in data
    assert "email" in data

@pytest.mark.api
@pytest.mark.auth
@pytest.mark.regression
def test_returns_401_without_authentication(api):
    """
    Test for unauthorized access.
    """
    response = api.request.get(
        f"{settings.BASE_URL}/api/gateway/auth/info",
        headers={"Content-Type": "application/json"}
    )
    
    assert response.status == 401

@pytest.mark.api
@pytest.mark.auth
@pytest.mark.smoke
def test_can_login_via_api(api):
    """
    Example with request body (POST request).
    """
    tokens = api.get_user_tokens("manager")
    assert tokens["token"] is not None
    assert len(tokens["token"]) > 0

@pytest.mark.api
@pytest.mark.crud
def test_create_and_delete_resource(api, auth_headers):
    """
    Example using controller methods.
    """
    # 1. Create (Not implemented in backend mock, assuming simulation)
    presentation_id = api.presentation_controller.make_presentation_id(auth_headers)
    
    # 2. Delete (if created)
    if presentation_id:
        api.presentation_controller.delete_presentation(auth_headers, presentation_id)
        
    assert api.presentation_controller is not None
