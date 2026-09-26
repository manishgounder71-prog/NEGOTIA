import pytest
from app.governance.policy_engine import DeterministicPolicyEngine
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

@pytest.fixture
def buyer_envelope():
    return BuyerPrivateEnvelope(
        max_total_price=100000.0,
        target_price=95000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        min_penalty_percent=5.0,
        allowed_payment_terms=["Net 30", "Net 45", "Net 60"],
        target_payment_terms="Net 60"
    )

@pytest.fixture
def supplier_envelope():
    return SupplierPrivateEnvelope(
        minimum_price=98000.0,
        target_price=110000.0,
        minimum_delivery_days=32,
        standard_delivery_days=40,
        minimum_margin_percent=18.5,
        max_penalty_percent=5.0,
        allowed_payment_terms=["Net 30", "Net 45"]
    )

def test_compliant_proposal_authorized(buyer_envelope, supplier_envelope):
    proposal = ProposalCreate(
        actor="BUYER",
        round_number=1,
        price=97000.0,
        delivery_days=32,
        sla_percent=99.5,
        payment_terms="Net 45",
        penalty_percent=5.0
    )
    result = DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)
    assert result.status == "AUTHORIZED"
    assert len(result.violations) == 0

def test_price_exceeding_buyer_ceiling_blocked(buyer_envelope, supplier_envelope):
    proposal = ProposalCreate(
        actor="BUYER",
        round_number=1,
        price=107000.0, # Violates $100,000 ceiling
        delivery_days=34,
        sla_percent=99.5,
        payment_terms="Net 45",
        penalty_percent=5.0
    )
    result = DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)
    assert result.status == "BLOCKED"
    assert any("exceeds Buyer Budget Ceiling" in v for v in result.violations)

def test_price_below_supplier_floor_blocked(buyer_envelope, supplier_envelope):
    proposal = ProposalCreate(
        actor="SUPPLIER",
        round_number=1,
        price=92000.0, # Violates $98,000 reservation floor
        delivery_days=34,
        sla_percent=99.5,
        payment_terms="Net 45",
        penalty_percent=5.0
    )
    result = DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)
    assert result.status == "BLOCKED"
    assert any("breaches Supplier Reservation Floor" in v for v in result.violations)

def test_delivery_exceeding_max_days_blocked(buyer_envelope, supplier_envelope):
    proposal = ProposalCreate(
        actor="BUYER",
        round_number=1,
        price=98000.0,
        delivery_days=45, # Exceeds 35 days max
        sla_percent=99.5,
        payment_terms="Net 45",
        penalty_percent=5.0
    )
    result = DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)
    assert result.status == "BLOCKED"
    assert any("exceeds Buyer Max Window" in v for v in result.violations)

def test_sla_below_minimum_blocked(buyer_envelope, supplier_envelope):
    proposal = ProposalCreate(
        actor="BUYER",
        round_number=1,
        price=98000.0,
        delivery_days=34,
        sla_percent=98.0, # Below 99.5% minimum
        payment_terms="Net 45",
        penalty_percent=5.0
    )
    result = DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)
    assert result.status == "BLOCKED"
    assert any("below required minimum" in v for v in result.violations)
