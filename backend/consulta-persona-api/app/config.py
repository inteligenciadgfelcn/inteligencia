from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # PostgreSQL
    app_user_db: str = "postgres"
    app_host_db: str = "72.60.156.246"
    app_name_database: str = "bolivia_hub"
    app_password_db: str
    app_port_db: int = 5432

    # Pool asyncpg
    db_min_size: int = 5
    db_max_size: int = 20
    db_command_timeout: float = 10.0

    # Redis
    redis_host: str = "redis"
    redis_port: int = 6379
    redis_password: str = ""
    redis_ttl_seconds: int = 86400  # 24h caché de persona

    # API Keys
    api_key_limited: str       # 10 consultas/día por IP
    api_key_unlimited: str     # sin límite

    # Rate limiting
    rate_limit_daily: int = 10

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000


settings = Settings()
