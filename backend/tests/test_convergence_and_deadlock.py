import pytest
from app.domain.convergence import ConvergenceEngine
from app.domain.deadlock import DeadlockEngine
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

def test_empty_zopa_triggers_deadlock():
    buyer_env = BuyerPrivateEnvelope(
        max_total_price=90000.0, # Buyer ceiling $90K
        target_price=85000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        min_penalty_percent=5.0
    )
    supplier_env = SupplierPrivateEnvelope(
        minimum_price=105000.0, # Supplier floor $105K (disjoint from Buyer)
        target_price=115000.0,
        minimum_delivery_days=32,
        standard_delivery_days=40
    )

    is_empty, reason = DeadlockEngine.is_zopa_empty(buyer_env, supplier_env)
    assert is_empty is True
    assert "EMPTY_ZOPA" in reason

def test_convergence_confirmed_on_identical_terms():
    buyer_prop = ProposalCreate(
        actor="BUYER", round_number=4, price=100000.0, delivery_days=34,
        sla_percent=99.5, payment_terms="Net 45", penalty_percent=5.0
    )
    supplier_prop = ProposalCreate(
        actor="SUPPLIER", round_number=4, price=100000.0, delivery_days=34,
        sla_percent=99.5, payment_terms="Net 45", penalty_percent=5.0
    )

    is_agreed, reason = ConvergenceEngine.check_agreement(buyer_prop, supplier_prop)
    assert is_agreed is True
    assert "AGREEMENT_CONFIRMED" in reason
