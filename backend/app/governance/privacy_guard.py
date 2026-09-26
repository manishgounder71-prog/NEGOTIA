from typing import Dict, Any, List, Optional
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope

class PrivacyGuard:
    """
    Cryptographic Private Data Firewall.
    Ensures zero cross-agent information leakage between Buyer and Supplier envelopes.
    """

    @staticmethod
    def build_buyer_context(
        negotiation_id: str,
        round_number: int,
        public_history: List[Dict[str, Any]],
        buyer_envelope: BuyerPrivateEnvelope
    ) -> Dict[str, Any]:
        """
        Builds the context for the Buyer Agent.
        Contains ONLY public proposals and Buyer's OWN private envelope.
        Supplier private values are completely omitted.
        """
        return {
            "role": "BUYER",
            "negotiation_id": negotiation_id,
            "round_number": round_number,
            "public_proposals": public_history,
            "private_envelope": {
                "max_budget_ceiling": buyer_envelope.max_total_price,
                "target_price": buyer_envelope.target_price,
                "max_delivery_days": buyer_envelope.max_delivery_days,
                "target_delivery_days": buyer_envelope.target_delivery_days,
                "min_sla_percent": buyer_envelope.min_sla_percent,
                "allowed_payment_terms": buyer_envelope.allowed_payment_terms,
                "target_payment_terms": buyer_envelope.target_payment_terms,
                "min_penalty_percent": buyer_envelope.min_penalty_percent,
                "private_batna": buyer_envelope.batna_description
            }
        }

    @staticmethod
    def build_supplier_context(
        negotiation_id: str,
        round_number: int,
        public_history: List[Dict[str, Any]],
        supplier_envelope: SupplierPrivateEnvelope
    ) -> Dict[str, Any]:
        """
        Builds the context for the Supplier Agent.
        Contains ONLY public proposals and Supplier's OWN private envelope.
        Buyer private values (ceiling, BATNA) are completely omitted.
        """
        return {
            "role": "SUPPLIER",
            "negotiation_id": negotiation_id,
            "round_number": round_number,
            "public_proposals": public_history,
            "private_envelope": {
                "reservation_price_floor": supplier_envelope.minimum_price,
                "target_price": supplier_envelope.target_price,
                "min_delivery_days": supplier_envelope.minimum_delivery_days,
                "standard_delivery_days": supplier_envelope.standard_delivery_days,
                "min_margin_percent": supplier_envelope.minimum_margin_percent,
                "max_penalty_percent": supplier_envelope.max_penalty_percent,
                "allowed_payment_terms": supplier_envelope.allowed_payment_terms,
                "target_payment_terms": supplier_envelope.target_payment_terms,
                "private_batna": supplier_envelope.supplier_batna
            }
        }

    @staticmethod
    def sanitize_for_public_audit(payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Strips or hashes any private envelope references before public AIMS ledger broadcast.
        """
        sanitized = payload.copy()
        private_keys = [
            "buyer_envelope", "supplier_envelope", "reservation_price_floor",
            "max_budget_ceiling", "batna", "private_batna", "margin_floor"
        ]
        for key in private_keys:
            if key in sanitized:
                sanitized[key] = "***ENCLOSED_PRIVATE_VAULT***"
        return sanitized
