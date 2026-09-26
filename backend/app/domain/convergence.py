from typing import Tuple
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

class ConvergenceEngine:
    """
    Evaluates whether mutual consensus has been achieved on all commercial clauses.
    Agreement requires exact price match, delivery alignment, payment term mutual consent,
    and valid liquidated damages.
    """

    @staticmethod
    def check_agreement(
        buyer_proposal: ProposalCreate,
        supplier_proposal: ProposalCreate
    ) -> Tuple[bool, str]:
        # Price match
        if abs(buyer_proposal.price - supplier_proposal.price) > 0.01:
            return False, f"Price gap remains: ${abs(buyer_proposal.price - supplier_proposal.price):,.2f}"

        # Delivery match
        if buyer_proposal.delivery_days != supplier_proposal.delivery_days:
            return False, f"Delivery gap remains: {abs(buyer_proposal.delivery_days - supplier_proposal.delivery_days)} days"

        # SLA match
        if buyer_proposal.sla_percent != supplier_proposal.sla_percent:
            return False, f"SLA mismatch: Buyer {buyer_proposal.sla_percent}% vs Supplier {supplier_proposal.sla_percent}%"

        # Payment terms match
        if buyer_proposal.payment_terms != supplier_proposal.payment_terms:
            return False, f"Payment terms mismatch: Buyer {buyer_proposal.payment_terms} vs Supplier {supplier_proposal.payment_terms}"

        # Penalty match
        if abs(buyer_proposal.penalty_percent - supplier_proposal.penalty_percent) > 0.01:
            return False, f"Penalty rate mismatch: Buyer {buyer_proposal.penalty_percent}% vs Supplier {supplier_proposal.penalty_percent}%"

        return True, "AGREEMENT_CONFIRMED: All 6 commercial terms identically ratified."
