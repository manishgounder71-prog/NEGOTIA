import sys
import pytest
import pytest_asyncio
from pathlib import Path
from app.infrastructure.database import init_db, AsyncSessionLocal, async_engine

# Add backend directory to sys.path so 'app' is recognized
sys.path.insert(0, str(Path(__file__).parent))

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database():
    await init_db()
    yield
    await async_engine.dispose()

@pytest_asyncio.fixture
async def db_session():
    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()

