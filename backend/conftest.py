import sys
import pytest
import pytest_asyncio
from pathlib import Path
from app.infrastructure.database import init_db, AsyncSessionLocal

# Add backend directory to sys.path so 'app' is recognized
sys.path.insert(0, str(Path(__file__).parent))

@pytest_asyncio.fixture(autouse=True)
async def setup_test_database():
    await init_db()
    yield

@pytest_asyncio.fixture
async def db_session():
    async with AsyncSessionLocal() as session:
        yield session
