from typing import Dict, Any, List
from app.governance.policy_engine import DeterministicPolicyEngine
from app.governance.prompt_injection import PromptInjectionDetector
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope, PolicyEvaluationResult

class LegalSafetyArbiter:
    """
    Independent Legal & Safety Arbiter combining Safe AI LLM evaluations
    with strict deterministic policy verification.
    """

    @classmethod
    def inspect_proposal(
        cls,
        proposal: ProposalCreate,
        buyer_envelope: BuyerPrivateEnvelope,
        supplier_envelope: SupplierPrivateEnvelope
    ) -> PolicyEvaluationResult:
        # 1. Inspect for Adversarial Prompt Injection in rationale
        if proposal.rationale:
            is_injection, reason = PromptInjectionDetector.inspect_text(proposal.rationale)
            if is_injection:
                return PolicyEvaluationResult(
                    status="BLOCKED",
                    violations=[reason],
                    warnings=[],
                    checks=[],
                    remediation_advice="SECURITY_BLOCK: Malicious prompt injection detected and neutralized."
                )

        # 2. Run Deterministic Policy Engine
        return DeterministicPolicyEngine.evaluate(
            proposal=proposal,
            buyer_envelope=buyer_envelope,
            supplier_envelope=supplier_envelope
        )
