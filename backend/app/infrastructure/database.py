from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
import os
from app.config.settings import settings

def normalize_async_database_url(url: str) -> str:
    """Ensure URL is compatible with asyncpg / aiosqlite."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url

# Base for models
Base = declarative_base()

# Build engine parameters based on database type
primary_url = normalize_async_database_url(settings.DATABASE_URL)
is_sqlite = "sqlite" in primary_url

engine_kwargs = {
    "echo": False,
    "future": True,
}

if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # High-performance enterprise pooling for hosted PostgreSQL / multi-region clusters
    engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
    engine_kwargs["pool_timeout"] = settings.DB_POOL_TIMEOUT
    engine_kwargs["pool_recycle"] = settings.DB_POOL_RECYCLE
    engine_kwargs["pool_pre_ping"] = True # Resilience against dropped/recycled connections in cloud networks
    
    connect_args = {}
    if settings.DB_SSL_MODE:
        connect_args["ssl"] = settings.DB_SSL_MODE
    if connect_args:
        engine_kwargs["connect_args"] = connect_args

# Primary Async Engine (Read/Write)
async_engine = create_async_engine(primary_url, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

# Optional Read-Replica Async Engine (Read-Only queries for multi-region clustering)
replica_engine = None
AsyncReplicaSessionLocal = None

if settings.DATABASE_REPLICA_URL:
    replica_url = normalize_async_database_url(settings.DATABASE_REPLICA_URL)
    replica_engine = create_async_engine(replica_url, **engine_kwargs)
    AsyncReplicaSessionLocal = async_sessionmaker(
        bind=replica_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False
    )

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for primary read/write database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_readonly_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for read-only database queries (routes to replica if configured)."""
    session_factory = AsyncReplicaSessionLocal if AsyncReplicaSessionLocal else AsyncSessionLocal
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initializes schema and tables."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

