import pytest
from app.domain.concession import ConcessionEngine
from app.domain.deadlock import DeadlockEngine
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

def test_concession_engine_weights_and_constants():
    """Validate multi-issue domain weights match the procurement policy matrix."""
    assert ConcessionEngine.WEIGHT_PRICE == 0.50
    assert ConcessionEngine.WEIGHT_DELIVERY == 0.20
    assert ConcessionEngine.WEIGHT_SLA == 0.15
    assert ConcessionEngine.WEIGHT_PAYMENT == 0.10
    assert ConcessionEngine.WEIGHT_PENALTY == 0.05
    assert (
        ConcessionEngine.WEIGHT_PRICE + 
        ConcessionEngine.WEIGHT_DELIVERY + 
        ConcessionEngine.WEIGHT_SLA + 
        ConcessionEngine.WEIGHT_PAYMENT + 
        ConcessionEngine.WEIGHT_PENALTY
    ) == pytest.approx(1.00)

def test_concession_engine_perfect_convergence():
    """When proposals match identically on price and delivery, status must be CONVERGED with 100% convergence."""
    buyer_prop = ProposalCreate(
        actor="BUYER",
        round_number=3,
        price=100000.0,
        delivery_days=30,
        payment_terms="Net 45",
        sla_percent=99.5,
        penalty_percent=2.0
    )
    supplier_prop = ProposalCreate(
        actor="SUPPLIER",
        round_number=3,
        price=100000.0,
        delivery_days=30,
        payment_terms="Net 45",
        sla_percent=99.5,
        penalty_percent=2.0
    )
    
    metrics = ConcessionEngine.calculate_metrics(buyer_prop, supplier_prop, round_number=3, prev_price_gap=5000.0)
    
    assert metrics.price_gap == 0.0
    assert metrics.delivery_gap == 0
    assert metrics.normalized_distance == 0.0
    assert metrics.convergence_percent == 100.0
    assert metrics.status == "CONVERGED"
    assert metrics.deadlock_risk == "LOW"

def test_concession_engine_deadlock_escalation():
    """Check deadlock escalation to MEDIUM at round 3 (<50% convergence) and HIGH at round 5 (<80% convergence)."""
    # Large divergence
    buyer_prop = ProposalCreate(
        actor="BUYER",
        round_number=3,
        price=80000.0,
        delivery_days=20,
        payment_terms="Net 60",
        sla_percent=99.9,
        penalty_percent=3.0
    )
    supplier_prop = ProposalCreate(
        actor="SUPPLIER",
        round_number=3,
        price=120000.0, # $40k gap
        delivery_days=60, # 40 days gap
        payment_terms="Net 30",
        sla_percent=99.0,
        penalty_percent=1.0
    )
    
    metrics_r3 = ConcessionEngine.calculate_metrics(buyer_prop, supplier_prop, round_number=3, prev_price_gap=40000.0)
    assert metrics_r3.deadlock_risk == "MEDIUM"
    assert metrics_r3.status == "CONVERGING"
    
    # At round 5 with poor convergence
    metrics_r5 = ConcessionEngine.calculate_metrics(buyer_prop, supplier_prop, round_number=5, prev_price_gap=40000.0)
    assert metrics_r5.deadlock_risk == "HIGH"
    assert metrics_r5.status == "DEADLOCK_WARNING"

def test_concession_engine_velocity():
    """Verify concession velocity properly measures movement relative to previous rounds."""
    buyer_prop = ProposalCreate(
        actor="BUYER",
        round_number=2,
        price=95000.0,
        delivery_days=30,
        payment_terms="Net 45",
        sla_percent=99.5,
        penalty_percent=2.0
    )
    supplier_prop = ProposalCreate(
        actor="SUPPLIER",
        round_number=2,
        price=105000.0, # $10,000 gap
        delivery_days=35,
        payment_terms="Net 45",
        sla_percent=99.5,
        penalty_percent=2.0
    )
    # Previous price gap was 15,000; now 10,000; difference = 5,000 / round 2 = 2500 velocity
    metrics = ConcessionEngine.calculate_metrics(buyer_prop, supplier_prop, round_number=2, prev_price_gap=15000.0)
    assert metrics.concession_velocity == 2500.0

def test_deadlock_engine_empty_zopa():
    """If buyer ceiling is strictly less than supplier minimum reservation price, empty ZOPA is flagged."""
    buyer_env = BuyerPrivateEnvelope(
        target_price=80000.0,
        max_total_price=90000.0, # Ceiling $90k
        target_delivery_days=30,
        max_delivery_days=45,
        min_sla_percent=99.5,
        min_penalty_percent=5.0
    )
    supplier_env = SupplierPrivateEnvelope(
        target_price=110000.0,
        minimum_price=95000.0, # Floor $95k > Ceiling $90k
        minimum_delivery_days=15,
        standard_delivery_days=30
    )
    
    is_empty, reason = DeadlockEngine.is_zopa_empty(buyer_env, supplier_env)
    assert is_empty is True
    assert "EMPTY_ZOPA" in reason
    assert "$5,000.00" in reason

def test_deadlock_engine_feasible_zopa():
    """When buyer ceiling is above or equal to supplier floor, ZOPA is feasible."""
    buyer_env = BuyerPrivateEnvelope(
        target_price=90000.0,
        max_total_price=105000.0, # Ceiling $105k
        target_delivery_days=30,
        max_delivery_days=45,
        min_sla_percent=99.5,
        min_penalty_percent=5.0
    )
    supplier_env = SupplierPrivateEnvelope(
        target_price=110000.0,
        minimum_price=95000.0, # Floor $95k <= Ceiling $105k
        minimum_delivery_days=15,
        standard_delivery_days=30
    )
    
    is_empty, reason = DeadlockEngine.is_zopa_empty(buyer_env, supplier_env)
    assert is_empty is False
    assert reason == "FEASIBLE_ZOPA"

def test_deadlock_engine_max_rounds_reached():
    """Detects deadlock when current round reaches or exceeds max rounds threshold."""
    is_deadlock, reason = DeadlockEngine.check_round_deadlock(
        current_round=10,
        max_rounds=10,
        proposals_history=[]
    )
    assert is_deadlock is True
    assert "MAX_ROUNDS_REACHED" in reason

def test_deadlock_engine_stall_detection():
    """Detects stall when consecutive buyer and supplier proposals make zero price movement."""
    history = [
        ProposalCreate(actor="BUYER", round_number=1, price=90000.0, delivery_days=30, payment_terms="Net 30", sla_percent=99.0, penalty_percent=1.0),
        ProposalCreate(actor="SUPPLIER", round_number=1, price=110000.0, delivery_days=30, payment_terms="Net 30", sla_percent=99.0, penalty_percent=1.0),
        ProposalCreate(actor="BUYER", round_number=2, price=90000.0, delivery_days=30, payment_terms="Net 30", sla_percent=99.0, penalty_percent=1.0),
        ProposalCreate(actor="SUPPLIER", round_number=2, price=110000.0, delivery_days=30, payment_terms="Net 30", sla_percent=99.0, penalty_percent=1.0),
    ]
    
    is_deadlock, reason = DeadlockEngine.check_round_deadlock(
        current_round=2,
        max_rounds=10,
        proposals_history=history
    )
    assert is_deadlock is True
    assert "STALL_DETECTED" in reason
