from playwright.sync_api import APIRequestContext

from python_playwright.api.base_api_client import BaseApiClient
from python_playwright.api.controllers.auth_controller import AuthorizationController
from python_playwright.api.controllers.presentation_controller import PresentationController
from python_playwright.constants.api_endpoints import Endpoints
from python_playwright.constants.headers import Headers
from python_playwright.constants.users import Users
from python_playwright.config import settings


class ApiManager(BaseApiClient):
    def __init__(self, request_context: APIRequestContext):
        super().__init__(request_context)

        # Initialize Controllers
        self.auth_controller = AuthorizationController(request_context)
        self.presentation_controller = PresentationController(request_context)

    def get_user_tokens(self, user_role: str) -> dict:
        """
        Get authentication tokens for a user.
        Returns dict with 'token' and 'refreshToken'.
        """
        user = Users.get_user(user_role)
        if not user.username or not user.password:
            raise ValueError(f"No credentials found for user role='{user_role}'")

        response = self.send(
            method="post",
            path=Endpoints.LOGIN,
            headers=Headers.extra_headers_without_token(),
            data={"username": user.username, "password": user.password},
        )

        res = response.json()
        token = res.get("token")
        refresh_token = res.get("refreshToken")

        if not token:
            raise RuntimeError(
                f"Token is undefined for user {user.username} on {settings.BASE_URL}"
            )

        return {"token": token, "refreshToken": refresh_token}
