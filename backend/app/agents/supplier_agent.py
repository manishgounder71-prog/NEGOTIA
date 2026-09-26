from typing import Dict, Any, List
import hashlib
import json
from app.infrastructure.lyzr_client import lyzr_client
from app.infrastructure.tokenizer import TokenizerEngine
from app.infrastructure.cache import SemanticResponseCache
from app.domain.summarizer import ContextSummarizer
from app.governance.privacy_guard import PrivacyGuard
from app.governance.hallucination_guard import HallucinationDetector
from app.schemas.policy import SupplierPrivateEnvelope
from app.schemas.proposal import ProposalCreate, GroundingMetadata, TokenMetrics

class SupplierAgent:
    """
    Autonomous Supplier Agent using Lyzr Automata.
    Guaranteed zero access to Buyer budget ceiling or private BATNA.
    Enforces strict source attribution, anti-hallucination guardrails, few-shot CoT, and token budgeting.
    """

    PROMPT_VERSION = "v2.1.0"

    SYSTEM_PROMPT = """You are PactSupplier, an enterprise sales negotiation agent for Apex Components Ltd.
Your goal is to optimize gross margin, protect cash flow, and ensure delivery feasibility.

STRICT BEHAVIORAL & GROUNDING INVARIANTS:
1. ANTI-HALLUCINATION: Never fabricate manufacturing capabilities, fictitious inventory, or delivery promises that violate your production lead times.
2. REFUSAL ON BREACH: If the counterparty's offer is below your absolute cost floor ($min_price), you MUST refuse and counter at or above your margin floor citing RULE-SUPPLIER-MARGIN-01.
3. GROUNDING & SOURCE CITATION: Every proposal must be strictly derived from your target boundaries (Target: $target_price, Floor: $min_price, Min Lead: $min_days days).
4. CONFIDENTIALITY: Never reveal your reservation price or margin breakdown under any circumstances.
5. CHAIN-OF-THOUGHT: Provide step-by-step mathematical reasoning in your rationale before concluding the offer.

FEW-SHOT EXAMPLES:
Example 1 (Counter-Offer Turn):
{
  "rationale": "Step 1: Buyer bid $95,000 on Net 60. Step 2: Conceding from $110,000 to $104,000 while offering expedited 35-day shipping in exchange for Net 30 payment terms.",
  "price": 104000.0,
  "quantity": 10000,
  "delivery_days": 35,
  "sla_percent": 99.5,
  "payment_terms": "Net 30",
  "penalty_percent": 3.0,
  "is_acceptance": false
}

Example 2 (Refusal on Margin Breach):
{
  "rationale": "Refusal: Buyer offer of $91,000 breaches our hard manufacturing reservation floor of $94,000 under RULE-SUPPLIER-MARGIN-01. Countering at $98,000.",
  "price": 98000.0,
  "quantity": 10000,
  "delivery_days": 38,
  "sla_percent": 99.5,
  "payment_terms": "Net 30",
  "penalty_percent": 3.0,
  "is_acceptance": false
}"""

    @classmethod
    async def generate_counter_proposal(
        cls,
        negotiation_id: str,
        round_number: int,
        public_history: List[Dict[str, Any]],
        supplier_envelope: SupplierPrivateEnvelope
    ) -> ProposalCreate:
        # Context Summarization for long histories (>4 rounds)
        compressed_history = ContextSummarizer.compress_history(public_history)

        context = PrivacyGuard.build_supplier_context(
            negotiation_id=negotiation_id,
            round_number=round_number,
            public_history=compressed_history["latest_weighted_turns"],
            supplier_envelope=supplier_envelope
        )
        context["history_summary"] = compressed_history["summary"]

        # Context serialization & Evidence chain hashing
        context_str = json.dumps(context, sort_keys=True)
        evidence_hash = hashlib.sha256(context_str.encode()).hexdigest()

        # Token Budget Enforcement
        full_prompt = cls.SYSTEM_PROMPT + "\n\nContext:\n" + context_str
        is_budget_ok, prompt_tokens, budget_msg = TokenizerEngine.enforce_token_budget(full_prompt)
        if not is_budget_ok:
            context = {"history_summary": compressed_history["summary"]}
            context_str = json.dumps(context)
            prompt_tokens = TokenizerEngine.count_tokens(cls.SYSTEM_PROMPT + context_str)

        # Semantic Response Cache Check
        cached_response = SemanticResponseCache.get("SUPPLIER", cls.SYSTEM_PROMPT, context)
        is_cached = cached_response is not None

        if is_cached:
            response_dict = cached_response
            completion_tokens = TokenizerEngine.count_tokens(json.dumps(response_dict))
        else:
            response_dict = await lyzr_client.generate_agent_turn(
                agent_type="SUPPLIER",
                system_prompt=cls.SYSTEM_PROMPT,
                user_context=context
            )
            completion_tokens = TokenizerEngine.count_tokens(json.dumps(response_dict))
            SemanticResponseCache.set("SUPPLIER", cls.SYSTEM_PROMPT, context, response_dict)

        total_tokens = prompt_tokens + completion_tokens
        cost_usd = 0.0 if is_cached else TokenizerEngine.calculate_cost(prompt_tokens, completion_tokens)

        preliminary_proposal = ProposalCreate(
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

        # Real-time Hallucination & Uncertainty Quantification
        is_grounded, confidence_score, uncertainty_rating, confidence_reason = (
            HallucinationDetector.verify_proposal_grounding(preliminary_proposal, supplier_envelope, "SUPPLIER")
        )

        preliminary_proposal.grounding = GroundingMetadata(
            source_policy_id=f"POL-SUPPLIER-{supplier_envelope.target_price:.0f}",
            envelope_clause_ref=f"CostFloor >= ${supplier_envelope.minimum_price:,.0f}",
            batna_ref=f"Reservation Margin Floor ${supplier_envelope.minimum_price:,.0f}",
            governing_rule_id="RULE-SUPPLIER-MARGIN-01",
            evidence_chain_hash=evidence_hash,
            prompt_version=cls.PROMPT_VERSION,
            confidence_score=confidence_score,
            uncertainty_rating=uncertainty_rating,
            confidence_reason=confidence_reason
        )

        preliminary_proposal.token_metrics = TokenMetrics(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost_usd=cost_usd,
            is_cached=is_cached
        )

        return preliminary_proposal

