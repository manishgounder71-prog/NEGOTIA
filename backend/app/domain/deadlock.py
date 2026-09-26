from typing import Tuple, List
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope
from app.schemas.proposal import ProposalCreate

class DeadlockEngine:
    """
    Deterministic Deadlock Detection Engine.
    Detects empty ZOPA (disjoint reservation prices), max round timeouts,
    or zero-movement concession stalls.
    """

    @staticmethod
    def is_zopa_empty(
        buyer_envelope: BuyerPrivateEnvelope,
        supplier_envelope: SupplierPrivateEnvelope
    ) -> Tuple[bool, str]:
        """
        If Buyer Ceiling < Supplier Reservation Floor, no feasible agreement zone exists.
        """
        if buyer_envelope.max_total_price < supplier_envelope.minimum_price:
            gap = supplier_envelope.minimum_price - buyer_envelope.max_total_price
            return True, f"EMPTY_ZOPA: Buyer max ceiling (${buyer_envelope.max_total_price:,.2f}) is below Supplier minimum floor (${supplier_envelope.minimum_price:,.2f}) by ${gap:,.2f}."
        return False, "FEASIBLE_ZOPA"

    @staticmethod
    def check_round_deadlock(
        current_round: int,
        max_rounds: int,
        proposals_history: List[ProposalCreate]
    ) -> Tuple[bool, str]:
        if current_round >= max_rounds:
            return True, f"MAX_ROUNDS_REACHED: Negotiation reached round {current_round}/{max_rounds} without convergence."

        # Check for 3 consecutive identical proposals (stall)
        if len(proposals_history) >= 4:
            last_two_buyer = [p.price for p in proposals_history if p.actor == "BUYER"][-2:]
            if len(last_two_buyer) == 2 and last_two_buyer[0] == last_two_buyer[1]:
                last_two_supp = [p.price for p in proposals_history if p.actor == "SUPPLIER"][-2:]
                if len(last_two_supp) == 2 and last_two_supp[0] == last_two_supp[1]:
                    return True, "STALL_DETECTED: Both agents have ceased making price concessions."

        return False, "NEGOTIATION_ACTIVE"
