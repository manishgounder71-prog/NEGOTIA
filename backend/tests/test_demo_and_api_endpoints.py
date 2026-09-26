import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "HEALTHY"

@pytest.mark.asyncio
async def test_demo_security_attack_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/demo/security-test")
        assert res.status_code == 200
        data = res.json()
        assert data["tests_run"] == 4
        assert data["tests_blocked"] == 4
        assert data["private_data_leaks"] == 0
        assert data["status"] == "ALL_ATTACKS_SUCCESSFULLY_NEUTRALIZED"

@pytest.mark.asyncio
async def test_deterministic_demo_negotiation_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/demo/start")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "DEMO_COMPLETED_SUCCESSFULLY"
        assert data["rounds_executed"] == 4
        assert data["final_status"] == "AGREED"
        assert data["contract_generated"] is True
