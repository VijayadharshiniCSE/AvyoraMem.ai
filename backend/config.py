import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env if present
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    APP_NAME: str = "AvyoraMem.ai Personal Styling & Beauty Ecosystem"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    STATIC_DIR: Path = BASE_DIR / "static"
    PRESETS_DIR: Path = BASE_DIR / "static" / "presets"
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "webp"}
    MAX_IMAGE_SIZE_MB: int = 15

settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.STATIC_DIR.mkdir(parents=True, exist_ok=True)
settings.PRESETS_DIR.mkdir(parents=True, exist_ok=True)
