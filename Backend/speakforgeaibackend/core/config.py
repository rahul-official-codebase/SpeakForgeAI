from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    # GEMINI_API_KEY: str

    # CLERK_SECRET_KEY: str

    # CLERK_PUBLISHABLE_KEY: str

    ENVIRONMENT: str = "development"

    PROJECT_NAME: str = "SpeakForge AI"

    API_VERSION: str = "v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()