from typing import Dict, Any, List
from app.infrastructure.lyzr_client import lyzr_client
from app.governance.privacy_guard import PrivacyGuard
from app.schemas.policy import SupplierPrivateEnvelope
from app.schemas.proposal import ProposalCreate

class SupplierAgent:
    """
    Autonomous Supplier Agent using Lyzr Automata.
    Guaranteed zero access to Buyer budget ceiling or private BATNA.
    """

    SYSTEM_PROMPT = """You are PactSupplier, an enterprise sales negotiation agent for Apex Components Ltd.
Your goal is to optimize gross margin, protect cash flow, and ensure delivery feasibility.
You must strictly respect your private floor. Never reveal your reservation price to the counterparty."""

    @classmethod
    async def generate_counter_proposal(
        cls,
        negotiation_id: str,
        round_number: int,
        public_history: List[Dict[str, Any]],
        supplier_envelope: SupplierPrivateEnvelope
    ) -> ProposalCreate:
        context = PrivacyGuard.build_supplier_context(
            negotiation_id=negotiation_id,
            round_number=round_number,
            public_history=public_history,
            supplier_envelope=supplier_envelope
        )

        response_dict = await lyzr_client.generate_agent_turn(
            agent_type="SUPPLIER",
            system_prompt=cls.SYSTEM_PROMPT,
            user_context=context
        )

        return ProposalCreate(
            actor="SUPPLIER",
            round_number=round_number,
            price=response_dict.get("price", 110000.0),
            quantity=response_dict.get("quantity", 10000),
            delivery_days=response_dict.get("delivery_days", 40),
            sla_percent=response_dict.get("sla_percent", 99.5),
            payment_terms=response_dict.get("payment_terms", "Net 30"),
            penalty_percent=response_dict.get("penalty_percent", 3.0),
            currency=response_dict.get("currency", "USD"),
            rationale=response_dict.get("rationale"),
            is_acceptance=response_dict.get("is_acceptance", False)
        )
