import pytest
from app.governance.privacy_guard import PrivacyGuard
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

def test_buyer_context_does_not_contain_supplier_reservation_floor():
    buyer_env = BuyerPrivateEnvelope(
        max_total_price=100000.0,
        target_price=95000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        min_penalty_percent=5.0
    )
    supplier_env = SupplierPrivateEnvelope(
        minimum_price=98000.0,
        target_price=110000.0,
        minimum_delivery_days=32,
        standard_delivery_days=40
    )

    buyer_context = PrivacyGuard.build_buyer_context(
        negotiation_id="test-neg-01",
        round_number=1,
        public_history=[],
        buyer_envelope=buyer_env
    )

    # 1. Verify Buyer has its own ceiling
    assert buyer_context["private_envelope"]["max_budget_ceiling"] == 100000.0

    # 2. CRITICAL TEST: Verify Supplier floor ($98,000) is nowhere in buyer context
    context_str = str(buyer_context)
    assert "98000" not in context_str
    assert "reservation_price_floor" not in buyer_context["private_envelope"]

def test_supplier_context_does_not_contain_buyer_budget_ceiling():
    buyer_env = BuyerPrivateEnvelope(
        max_total_price=100000.0,
        target_price=95000.0,
        max_delivery_days=35,
        target_delivery_days=30,
        min_sla_percent=99.5,
        min_penalty_percent=5.0
    )
    supplier_env = SupplierPrivateEnvelope(
        minimum_price=98000.0,
        target_price=110000.0,
        minimum_delivery_days=32,
        standard_delivery_days=40
    )

    supp_context = PrivacyGuard.build_supplier_context(
        negotiation_id="test-neg-01",
        round_number=1,
        public_history=[],
        supplier_envelope=supplier_env
    )

    # 1. Verify Supplier has its own floor
    assert supp_context["private_envelope"]["reservation_price_floor"] == 98000.0

    # 2. CRITICAL TEST: Verify Buyer ceiling ($100,000) is nowhere in supplier context
    context_str = str(supp_context)
    assert "100000" not in context_str
    assert "max_budget_ceiling" not in supp_context["private_envelope"]
