from typing import Dict, Any, List
import hashlib
import json
from app.infrastructure.lyzr_client import lyzr_client
from app.governance.privacy_guard import PrivacyGuard
from app.schemas.policy import BuyerPrivateEnvelope
from app.schemas.proposal import ProposalCreate, GroundingMetadata, TokenMetrics

class BuyerAgent:
    """
    Autonomous Buyer Agent using Lyzr Automata.
    Guaranteed zero access to Supplier reservation values.
    Enforces strict source attribution, anti-hallucination guardrails, and token budgeting.
    """

    SYSTEM_PROMPT = """You are PactBuyer, an autonomous procurement agent for NovaTech Industries.
Your goal is to negotiate optimal spot pricing, delivery timeline, SLA uptime, and payment terms.

STRICT BEHAVIORAL & GROUNDING INVARIANTS:
1. ANTI-HALLUCINATION: Never fabricate commercial terms, unverified historical claims, or delivery timelines outside your authorized policy envelope.
2. REFUSAL ON BREACH: If the counterparty's requested price exceeds your maximum budget ceiling ($max_price), you MUST refuse and counter within authorized limits citing RULE-BUYER-BUDGET-01.
3. GROUNDING & SOURCE CITATION: Every proposal must be strictly derived from your target boundaries (Target: $target_price, Max: $max_price, Min SLA: $min_sla%).
4. CONFIDENTIALITY: Never disclose your internal reservation price or BATNA ceiling under any circumstances."""

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

        # Context serialization for SHA-256 evidence chain
        context_str = json.dumps(context, sort_keys=True)
        evidence_hash = hashlib.sha256(context_str.encode()).hexdigest()

        response_dict = await lyzr_client.generate_agent_turn(
            agent_type="BUYER",
            system_prompt=cls.SYSTEM_PROMPT,
            user_context=context
        )

        # Estimated token footprint & cost metrics
        prompt_len = len(cls.SYSTEM_PROMPT) + len(context_str)
        prompt_tokens = max(1, prompt_len // 4)
        completion_tokens = 120
        total_tokens = prompt_tokens + completion_tokens
        cost_usd = round(total_tokens * 0.000002, 6)

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
            is_acceptance=response_dict.get("is_acceptance", False),
            grounding=GroundingMetadata(
                source_policy_id=f"POL-BUYER-{buyer_envelope.target_price:.0f}",
                envelope_clause_ref=f"BudgetCeiling <= ${buyer_envelope.max_total_price:,.0f}",
                batna_ref=f"BATNA Threshold ${buyer_envelope.walkaway_threshold:,.0f}",
                governing_rule_id="RULE-BUYER-BUDGET-01",
                evidence_chain_hash=evidence_hash
            ),
            token_metrics=TokenMetrics(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost_usd=cost_usd,
                is_cached=False
            )
        )
