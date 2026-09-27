from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, model_validator
from typing import List, Optional
import os
import logging

logger = logging.getLogger("negotia.config")

INSECURE_SECRET_DEFAULTS = {
    "negotia-super-secret-enterprise-key-2026",
    "negotia-super-secret-enterprise-production-key-2026",
    "secret",
    "changeme",
    "default-jwt-secret"
}

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "NEGOTIA"
    TAGLINE: str = "Let AI negotiate. Never let AI negotiate outside the rules."
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # Database & Multi-Region Clustering
    DATABASE_URL: str = "sqlite+aiosqlite:///./negotia.db"
    DATABASE_SYNC_URL: str = "sqlite:///./negotia.db"
    DATABASE_REPLICA_URL: Optional[str] = None # Optional read-replica for geo-distributed queries
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800
    DB_SSL_MODE: Optional[str] = None # "require", "prefer", "disable" or None
    
    # Redis & Event Bus
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security & Auth
    JWT_SECRET: str = "negotia-super-secret-enterprise-key-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # Lyzr Agent & Safe AI API
    LYZR_API_KEY: Optional[str] = None
    LYZR_BASE_URL: str = "https://agent-prod.lyzr.app/v2"
    SIMULATION_MODE: bool = True # Graceful autonomous mock simulation if no live API key provided
    
    # Audit & Hashing
    AUDIT_HASH_ALGORITHM: str = "SHA-256"
    GENESIS_HASH: str = "0000000000000000000000000000000000000000000000000000000000000000"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        env = (self.ENVIRONMENT or "development").lower()
        if env in {"production", "prod", "staging"}:
            if not self.JWT_SECRET or self.JWT_SECRET in INSECURE_SECRET_DEFAULTS:
                raise ValueError(
                    f"CRITICAL SECURITY CONFIGURATION ERROR: Insecure or default JWT_SECRET detected in '{self.ENVIRONMENT}' environment. "
                    "You must provide a unique, cryptographically strong JWT_SECRET environment variable."
                )
        return self

settings = Settings()
