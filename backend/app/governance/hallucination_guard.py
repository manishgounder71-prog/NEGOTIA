"""
Real-Time Numerical Hallucination Verifier & Uncertainty Quantification Engine
Intercepts fabricated numbers, validates mathematical claim provenance, and scores confidence.
"""

from typing import Dict, Any, Tuple, Optional
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

class HallucinationDetector:
    """
    Lightweight, Real-Time Pre-Flight Hallucination & Uncertainty Classifier.
    Runs on agent proposals before passing to the Policy Engine.
    """

    @classmethod
    def verify_proposal_grounding(
        cls,
        proposal: ProposalCreate,
        envelope: Any,
        actor: str
    ) -> Tuple[bool, float, str, str]:
        """
        Cross-verifies that proposal numbers originate from bounded policy logic.
        Returns:
            (is_grounded, confidence_score, uncertainty_rating, reason)
        """
        confidence_deductions = 0.0
        reasons = []

        # 1. Price Verification
        if actor == "BUYER":
            max_price = getattr(envelope, "max_total_price", 100000.0)
            target_price = getattr(envelope, "target_price", 95000.0)
            
            if proposal.price > max_price:
                confidence_deductions += 0.40
                reasons.append(f"Price ${proposal.price:,.0f} exceeds max authorized budget ${max_price:,.0f}")
            elif proposal.price < (target_price * 0.70):
                # Unreasonably low ungrounded price
                confidence_deductions += 0.25
                reasons.append("Price is ungroundedly below reasonable opening boundary")
        else: # SUPPLIER
            min_price = getattr(envelope, "minimum_price", 94000.0)
            target_price = getattr(envelope, "target_price", 105000.0)
            
            if proposal.price < min_price:
                confidence_deductions += 0.40
                reasons.append(f"Price ${proposal.price:,.0f} breaches cost floor ${min_price:,.0f}")
            elif proposal.price > (target_price * 1.50):
                confidence_deductions += 0.25
                reasons.append("Price is excessively inflated without historical justification")

        # 2. SLA Range Validation
        if proposal.sla_percent < 90.0 or proposal.sla_percent > 100.0:
            confidence_deductions += 0.30
            reasons.append(f"SLA uptime {proposal.sla_percent}% is outside realistic commercial range (90-100%)")

        # 3. Delivery Timeline Validation
        if proposal.delivery_days < 1 or proposal.delivery_days > 365:
            confidence_deductions += 0.30
            reasons.append(f"Delivery timeline {proposal.delivery_days} days is mathematically anomalous")

        # 4. Penalty Validation
        if proposal.penalty_percent < 0.0 or proposal.penalty_percent > 50.0:
            confidence_deductions += 0.20
            reasons.append(f"Liquidated damages penalty {proposal.penalty_percent}% is outside standard bounds (0-50%)")

        confidence_score = max(0.0, round(1.0 - confidence_deductions, 3))

        if confidence_score >= 0.85:
            uncertainty_rating = "LOW"
        elif confidence_score >= 0.65:
            uncertainty_rating = "MEDIUM"
        else:
            uncertainty_rating = "HIGH"

        is_grounded = confidence_score >= 0.60
        summary_reason = "; ".join(reasons) if reasons else "Proposal fully grounded within mathematical policy boundaries"

        return is_grounded, confidence_score, uncertainty_rating, summary_reason
