from faker import Faker
from playwright.sync_api import APIResponse

from python_playwright.api.base_api_client import BaseApiClient
from python_playwright.config import settings
from python_playwright.constants.api_endpoints import Endpoints
from python_playwright.constants.headers import Headers
from python_playwright.constants.users import Users

faker = Faker()


class AuthorizationController(BaseApiClient):
    def logout_as_user(self, user_role: str, token: str) -> APIResponse:
        """Logout user via API."""
        user = Users.get_user(user_role)

        headers = Headers.extra_headers_without_token()
        headers["cookie"] = token

        response = self.send(
            method="post",
            path=Endpoints.LOGOUT,
            headers=headers,
            data={},
        )

        if response.status != 200:
            raise RuntimeError(
                f"Failed to log out user {user.username}. Status code: {response.status}"
            )

        return response

    def sign_up_with_email(self, email: str | None = None) -> dict:
        """Sign up new user via API."""
        if not email:
            email = f"autotest+{faker.uuid4()}@example.com"

        user_id = faker.uuid4()
        payload = {"userId": user_id, "email": email}

        headers = Headers.extra_headers_without_token()
        headers["referer"] = f"{settings.BASE_URL}/sign-up"

        response = self.send(
            method="post",
            path=Endpoints.SIGN_UP,
            headers=headers,
            data=payload,
        )

        if response.status != 200:
            raise RuntimeError(f"Failed sign up: {response.text()}")

        return payload

    def request_password_reset(self, email: str) -> APIResponse:
        """Request password reset."""
        return self.send(
            method="post",
            path=Endpoints.PASSWORD_RESET,
            headers=Headers.extra_headers_without_token(),
            data={"email": email},
        )

    def change_password(self, headers: dict, old_password: str, new_password: str) -> APIResponse:
        """Change user password."""
        return self.send(
            method="post",
            path=Endpoints.AUTH_PASSWORD,
            headers=headers,
            data={"oldPassword": old_password, "newPassword": new_password},
        )

    def get_current_user_info(self, headers: dict) -> APIResponse:
        """Get current user info."""
        return self.send(method="get", path=Endpoints.AUTH_INFO, headers=headers)
