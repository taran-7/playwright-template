import os

from pydantic_settings import BaseSettings, SettingsConfigDict


def _resolve_env_name() -> str:
    """Resolve environment name from ENV variable."""
    return os.getenv("ENV", "test")


ENV_NAME = _resolve_env_name()


class Settings(BaseSettings):
    # Runtime environment name: test | beta | prod
    ENV: str = ENV_NAME

    # Base config
    BASE_URL: str = "https://example.com"
    URL_PROD: str | None = None

    # User credentials
    MANAGER_USERNAME: str | None = None
    MANAGER_PASSWORD: str | None = None
    USER_STANDARD_USERNAME: str | None = None
    USER_STANDARD_PASSWORD: str | None = None
    USER_LIMITED_USERNAME: str | None = None
    USER_LIMITED_PASSWORD: str | None = None

    # External services
    GMAIL_USER: str | None = None
    GMAIL_APP_PASSWORD: str | None = None
    EXTERNAL_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=(f".env.{ENV_NAME}", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def using_placeholder_url(self) -> bool:
        return "example.com" in self.BASE_URL


settings = Settings()
