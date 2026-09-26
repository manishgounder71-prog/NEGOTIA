import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.domain.state_machine import NegotiationStateMachine
from app.domain.models import Negotiation
from app.domain.engine import NegotiationOrchestrationEngine
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope
from app.schemas.proposal import ProposalCreate

@pytest.mark.asyncio
async def test_state_machine_illegal_transition_blocked():
    """Verify that illegal state machine transitions raise descriptive errors."""
    with pytest.raises(ValueError) as exc:
        NegotiationStateMachine.validate_transition("INITIALIZING", "CONTRACT_COMPLETED")
    assert "ILLEGAL_STATE_TRANSITION" in str(exc.value)

    with pytest.raises(ValueError) as exc:
        NegotiationStateMachine.validate_transition("AGREED", "RUNNING")
    assert "ILLEGAL_STATE_TRANSITION" in str(exc.value)

@pytest.mark.asyncio
async def test_security_headers_present_on_all_responses():
    """Verify enterprise security headers (X-Content-Type-Options, X-Frame-Options, HSTS) are returned."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/health")
        assert resp.status_code == 200
        assert resp.headers.get("X-Content-Type-Options") == "nosniff"
        assert resp.headers.get("X-Frame-Options") == "DENY"
        assert "Strict-Transport-Security" in resp.headers
        assert "X-Request-ID" in resp.headers

@pytest.mark.asyncio
async def test_terminal_negotiation_cannot_be_stepped(db_session):
    """Verify that once a negotiation reaches AGREED or terminal state, subsequent step attempts are rejected."""
    buyer_env = BuyerPrivateEnvelope(
        max_total_price=100000.0,
        target_price=95000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        allowed_payment_terms=["Net 30", "Net 45", "Net 60"],
        max_penalty_percent=5.0
    )
    supp_env = SupplierPrivateEnvelope(
        minimum_price=94000.0,
        target_price=105000.0,
        minimum_delivery_days=25,
        standard_delivery_days=35,
        allowed_payment_terms=["Net 30", "Net 45"],
        max_penalty_percent=5.0
    )

    session = await NegotiationOrchestrationEngine.create_negotiation(
        title="Terminal State Test",
        category="Hardware",
        buyer_name="NovaTech",
        supplier_name="Apex",
        buyer_envelope=buyer_env,
        supplier_envelope=supp_env,
        max_rounds=5,
        organization_id="org-test",
        db=db_session
    )

    # Force terminal agreed state
    session.status = "AGREED"
    await db_session.commit()

    with pytest.raises(ValueError) as exc:
        await NegotiationOrchestrationEngine.step_round(
            negotiation_id=session.id,
            db=db_session
        )
    assert "terminal state" in str(exc.value).lower()

@pytest.mark.asyncio
async def test_tenant_isolation_in_routes(db_session):
    """Verify cross-organization negotiation isolation."""
    buyer_env = BuyerPrivateEnvelope(
        max_total_price=100000.0,
        target_price=95000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        allowed_payment_terms=["Net 30"],
        max_penalty_percent=5.0
    )
    supp_env = SupplierPrivateEnvelope(
        minimum_price=94000.0,
        target_price=105000.0,
        minimum_delivery_days=25,
        standard_delivery_days=35,
        allowed_payment_terms=["Net 30"],
        max_penalty_percent=5.0
    )

    session = await NegotiationOrchestrationEngine.create_negotiation(
        title="Org Isolation Test",
        category="Hardware",
        buyer_name="NovaTech",
        supplier_name="Apex",
        buyer_envelope=buyer_env,
        supplier_envelope=supp_env,
        max_rounds=5,
        organization_id="org-alpha-tenant",
        db=db_session
    )

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Default user is org-default-01 -> querying org list should not include org-alpha-tenant unless matching
        resp = await client.get("/api/v1/negotiations")
        assert resp.status_code == 200
        items = resp.json()
        for item in items:
            assert item["organization_id"] == "org-default-01"
