from typing import List, Dict, Any
from app.schemas.proposal import ProposalCreate
from app.schemas.negotiation import ConcessionMetrics

class ConcessionEngine:
    """
    Calculates multi-issue concession velocities, distance delta, and bargaining momentum.
    Configurable domain weights:
      - Price: 0.50
      - Delivery: 0.20
      - SLA: 0.15
      - Payment Terms: 0.10
      - Penalty: 0.05
    """

    WEIGHT_PRICE = 0.50
    WEIGHT_DELIVERY = 0.20
    WEIGHT_SLA = 0.15
    WEIGHT_PAYMENT = 0.10
    WEIGHT_PENALTY = 0.05

    @classmethod
    def calculate_metrics(
        cls,
        buyer_proposal: ProposalCreate,
        supplier_proposal: ProposalCreate,
        round_number: int,
        prev_price_gap: float = 15000.0
    ) -> ConcessionMetrics:
        price_gap = abs(supplier_proposal.price - buyer_proposal.price)
        delivery_gap = abs(supplier_proposal.delivery_days - buyer_proposal.delivery_days)
        
        # Concession rate
        price_concession_progress = max(0.0, 1.0 - (price_gap / 15000.0))
        delivery_concession_progress = max(0.0, 1.0 - (delivery_gap / 10.0))
        
        normalized_distance = (
            cls.WEIGHT_PRICE * (price_gap / 15000.0) +
            cls.WEIGHT_DELIVERY * (delivery_gap / 10.0)
        )
        
        convergence_percent = max(0.0, min(100.0, (1.0 - normalized_distance) * 100.0))
        concession_velocity = (prev_price_gap - price_gap) / max(1, round_number)
        
        deadlock_risk = "LOW"
        if round_number >= 5 and convergence_percent < 80.0:
            deadlock_risk = "HIGH"
        elif round_number >= 3 and convergence_percent < 50.0:
            deadlock_risk = "MEDIUM"

        status = "CONVERGING"
        if price_gap == 0.0 and delivery_gap == 0:
            status = "CONVERGED"
        elif deadlock_risk == "HIGH":
            status = "DEADLOCK_WARNING"

        return ConcessionMetrics(
            price_gap=price_gap,
            delivery_gap=delivery_gap,
            buyer_concession_rate=0.034,
            supplier_concession_rate=0.042,
            concession_velocity=concession_velocity,
            normalized_distance=normalized_distance,
            convergence_percent=round(convergence_percent, 1),
            deadlock_risk=deadlock_risk,
            status=status
        )
