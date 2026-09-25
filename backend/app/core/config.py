import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ovarian Diseases Analyzer"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ovarian_disease_analyzer_secret_jwt_key_2026_academic_project")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./database/ovarian_analyzer.db")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models/resnet18.pkl")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    REPORT_DIR: str = os.getenv("REPORT_DIR", "./reports")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
