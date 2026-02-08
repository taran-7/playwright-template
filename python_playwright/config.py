import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Base Config
    BASE_URL: str = "https://example.com" # Default fallback
    URL_PROD: str | None = None
    
    # User Credentials
    MANAGER_USERNAME: str | None = None
    MANAGER_PASSWORD: str | None = None
    
    USER_STANDARD_USERNAME: str | None = None
    USER_STANDARD_PASSWORD: str | None = None
    
    USER_LIMITED_USERNAME: str | None = None
    USER_LIMITED_PASSWORD: str | None = None
    
    # External Services
    GMAIL_USER: str | None = None
    GMAIL_APP_PASSWORD: str | None = None
    EXTERNAL_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=f".env.{os.getenv('ENV', 'test')}",
        env_file_encoding='utf-8',
        extra='ignore'
    )

# Global settings instance
settings = Settings()
