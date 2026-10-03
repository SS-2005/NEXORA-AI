import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env.local from the Next.js frontend root if it exists
# This lets the backend reuse the GEMINI_API_KEY from the Next.js .env.local file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env.local"))
load_dotenv()  # Fallback to local .env in backend directory

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NEXORA API"
    
    # SQLite default, override with DATABASE_URL for PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nexora.db")
    
    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    # Gemini Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS Origins (allowing Next.js frontend)
    BACKEND_CORS_ORIGINS: list[str] = [
        origin.strip() for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,https://nexora-kenya-frontend.vercel.app"
        ).split(",") if origin.strip()
    ]

    class Config:
        case_sensitive = True

settings = Settings()
