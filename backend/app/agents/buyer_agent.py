from typing import Dict, Any, List
from app.infrastructure.lyzr_client import lyzr_client
from app.governance.privacy_guard import PrivacyGuard
from app.schemas.policy import BuyerPrivateEnvelope
from app.schemas.proposal import ProposalCreate

class BuyerAgent:
    """
    Autonomous Buyer Agent using Lyzr Automata.
    Guaranteed zero access to Supplier reservation values.
    """

    SYSTEM_PROMPT = """You are PactBuyer, an autonomous procurement agent for NovaTech Industries.
Your goal is to negotiate optimal spot pricing, delivery timeline, SLA uptime, and payment terms.
You must strictly respect your private envelope. Never reveal your maximum budget ceiling to the counterparty."""

    @classmethod
    async def generate_proposal(
        cls,
        negotiation_id: str,
        round_number: int,
        public_history: List[Dict[str, Any]],
        buyer_envelope: BuyerPrivateEnvelope
    ) -> ProposalCreate:
        context = PrivacyGuard.build_buyer_context(
            negotiation_id=negotiation_id,
            round_number=round_number,
            public_history=public_history,
            buyer_envelope=buyer_envelope
        )

        response_dict = await lyzr_client.generate_agent_turn(
            agent_type="BUYER",
            system_prompt=cls.SYSTEM_PROMPT,
            user_context=context
        )

        return ProposalCreate(
            actor="BUYER",
            round_number=round_number,
            price=response_dict.get("price", 95000.0),
            quantity=response_dict.get("quantity", 10000),
            delivery_days=response_dict.get("delivery_days", 30),
            sla_percent=response_dict.get("sla_percent", 99.5),
            payment_terms=response_dict.get("payment_terms", "Net 60"),
            penalty_percent=response_dict.get("penalty_percent", 5.0),
            currency=response_dict.get("currency", "USD"),
            rationale=response_dict.get("rationale"),
            is_acceptance=response_dict.get("is_acceptance", False)
        )
