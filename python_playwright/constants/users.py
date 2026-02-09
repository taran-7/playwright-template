from dataclasses import dataclass

from python_playwright.config import settings


@dataclass
class User:
    role: str
    username: str | None
    password: str | None


class Users:
    MANAGER = User(
        role="manager", username=settings.MANAGER_USERNAME, password=settings.MANAGER_PASSWORD
    )

    USER_STANDARD = User(
        role="user_standard",
        username=settings.USER_STANDARD_USERNAME,
        password=settings.USER_STANDARD_PASSWORD,
    )

    USER_LIMITED = User(
        role="user_limited",
        username=settings.USER_LIMITED_USERNAME,
        password=settings.USER_LIMITED_PASSWORD,
    )

    @classmethod
    def get_user(cls, role_key: str) -> User:
        """Get user by role key (e.g., 'manager', 'user_standard')"""
        role_map = {
            "manager": cls.MANAGER,
            "user_standard": cls.USER_STANDARD,
            "user_limited": cls.USER_LIMITED,
        }
        user = role_map.get(role_key)
        if not user:
            raise ValueError(f"User with role key '{role_key}' not found")
        return user
