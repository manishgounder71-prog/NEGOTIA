from typing import Dict, Any, List, Optional
from datetime import datetime
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import (
    BuyerPrivateEnvelope, 
    SupplierPrivateEnvelope, 
    PolicyEvaluationResult, 
    PolicyCheckResult
)

class DeterministicPolicyEngine:
    """
    Deterministic rule engine that validates proposals against mathematical CFO and Legal bounds.
    Core Principle: LLMs propose. Deterministic systems authorize.
    """

    @staticmethod
    def evaluate(
        proposal: ProposalCreate,
        buyer_envelope: BuyerPrivateEnvelope,
        supplier_envelope: SupplierPrivateEnvelope
    ) -> PolicyEvaluationResult:
        checks: List[PolicyCheckResult] = []
        violations: List[str] = []
        warnings: List[str] = []

        # 1. Price Checks
        if proposal.actor == "BUYER":
            # Buyer proposing: Must not exceed buyer's own hard ceiling
            if proposal.price > buyer_envelope.max_total_price:
                violations.append(f"Price ${proposal.price:,.2f} exceeds Buyer Budget Ceiling ${buyer_envelope.max_total_price:,.2f}")
                checks.append(PolicyCheckResult(
                    rule_name="RULE-BUYER-BUDGET-CEILING",
                    category="PRICE",
                    status="VIOLATION",
                    tested_value=f"${proposal.price:,.2f}",
                    authorized_limit=f"${buyer_envelope.max_total_price:,.2f} max",
                    message="Proposal blocked: Price exceeds authorized budget cap."
                ))
            else:
                checks.append(PolicyCheckResult(
                    rule_name="RULE-BUYER-BUDGET-CEILING",
                    category="PRICE",
                    status="PASSED",
                    tested_value=f"${proposal.price:,.2f}",
                    authorized_limit=f"${buyer_envelope.max_total_price:,.2f} max",
                    message="Price is within authorized budget ceiling."
                ))
        elif proposal.actor == "SUPPLIER":
            # Supplier proposing: Must not breach supplier reservation floor
            if proposal.price < supplier_envelope.minimum_price:
                violations.append(f"Price ${proposal.price:,.2f} breaches Supplier Reservation Floor ${supplier_envelope.minimum_price:,.2f}")
                checks.append(PolicyCheckResult(
                    rule_name="RULE-SUPPLIER-COST-FLOOR",
                    category="PRICE",
                    status="VIOLATION",
                    tested_value=f"${proposal.price:,.2f}",
                    authorized_limit=f"${supplier_envelope.minimum_price:,.2f} min",
                    message="Proposal blocked: Price violates minimum gross margin floor."
                ))
            else:
                checks.append(PolicyCheckResult(
                    rule_name="RULE-SUPPLIER-COST-FLOOR",
                    category="PRICE",
                    status="PASSED",
                    tested_value=f"${proposal.price:,.2f}",
                    authorized_limit=f"${supplier_envelope.minimum_price:,.2f} min",
                    message="Price satisfies supplier margin threshold."
                ))

        # 2. Delivery Timeline Checks
        if proposal.delivery_days > buyer_envelope.max_delivery_days:
            violations.append(f"Delivery {proposal.delivery_days} days exceeds Buyer Max Window {buyer_envelope.max_delivery_days} days")
            checks.append(PolicyCheckResult(
                rule_name="RULE-DELIVERY-WINDOW",
                category="DELIVERY",
                status="VIOLATION",
                tested_value=f"{proposal.delivery_days} days",
                authorized_limit=f"{buyer_envelope.max_delivery_days} days max",
                message="Delivery timeline violates supply chain operational window."
            ))
        elif proposal.delivery_days < supplier_envelope.minimum_delivery_days:
            violations.append(f"Delivery {proposal.delivery_days} days faster than Supplier Minimum Lead Time {supplier_envelope.minimum_delivery_days} days")
            checks.append(PolicyCheckResult(
                rule_name="RULE-MIN-LEADTIME",
                category="DELIVERY",
                status="VIOLATION",
                tested_value=f"{proposal.delivery_days} days",
                authorized_limit=f"{supplier_envelope.minimum_delivery_days} days min",
                message="Delivery timeline is physically infeasible for manufacturing line."
            ))
        else:
            checks.append(PolicyCheckResult(
                rule_name="RULE-DELIVERY-WINDOW",
                category="DELIVERY",
                status="PASSED",
                tested_value=f"{proposal.delivery_days} days",
                authorized_limit=f"{buyer_envelope.max_delivery_days} days max",
                message="Delivery timeline within authorized parameters."
            ))

        # 3. SLA Uptime Checks
        if proposal.sla_percent < buyer_envelope.min_sla_percent:
            violations.append(f"SLA {proposal.sla_percent}% is below required minimum {buyer_envelope.min_sla_percent}%")
            checks.append(PolicyCheckResult(
                rule_name="RULE-SLA-MINIMUM",
                category="SLA",
                status="VIOLATION",
                tested_value=f"{proposal.sla_percent}%",
                authorized_limit=f"{buyer_envelope.min_sla_percent}% min",
                message="SLA commitment does not satisfy mission-critical uptime threshold."
            ))
        else:
            checks.append(PolicyCheckResult(
                rule_name="RULE-SLA-MINIMUM",
                category="SLA",
                status="PASSED",
                tested_value=f"{proposal.sla_percent}%",
                authorized_limit=f"{buyer_envelope.min_sla_percent}% min",
                message="SLA commitment meets or exceeds requirement."
            ))

        # 4. Payment Terms Checks
        if proposal.payment_terms not in buyer_envelope.allowed_payment_terms:
            violations.append(f"Payment term '{proposal.payment_terms}' is not in Buyer Authorized Terms {buyer_envelope.allowed_payment_terms}")
            checks.append(PolicyCheckResult(
                rule_name="RULE-PAYMENT-TERMS",
                category="PAYMENT",
                status="VIOLATION",
                tested_value=proposal.payment_terms,
                authorized_limit=str(buyer_envelope.allowed_payment_terms),
                message="Payment term is outside corporate treasury approved list."
            ))
        else:
            checks.append(PolicyCheckResult(
                rule_name="RULE-PAYMENT-TERMS",
                category="PAYMENT",
                status="PASSED",
                tested_value=proposal.payment_terms,
                authorized_limit=str(buyer_envelope.allowed_payment_terms),
                message="Payment terms conform to corporate cash-flow policy."
            ))

        # 5. Liquidated Penalty Checks
        if proposal.penalty_percent < buyer_envelope.min_penalty_percent:
            violations.append(f"Delay penalty {proposal.penalty_percent}% is below Legal Minimum {buyer_envelope.min_penalty_percent}%")
            checks.append(PolicyCheckResult(
                rule_name="RULE-PENALTY-LIABILITY",
                category="PENALTY",
                status="VIOLATION",
                tested_value=f"{proposal.penalty_percent}%",
                authorized_limit=f"{buyer_envelope.min_penalty_percent}% min",
                message="Liquidated damages clause below mandatory legal indemnity threshold."
            ))
        else:
            checks.append(PolicyCheckResult(
                rule_name="RULE-PENALTY-LIABILITY",
                category="PENALTY",
                status="PASSED",
                tested_value=f"{proposal.penalty_percent}%",
                authorized_limit=f"{buyer_envelope.min_penalty_percent}% min",
                message="Delay damages conform to standard corporate contract schedule."
            ))

        # Final Authorization Determination
        if violations:
            return PolicyEvaluationResult(
                status="BLOCKED",
                violations=violations,
                warnings=warnings,
                checks=checks,
                remediation_advice="Adjust proposal values to conform within authorized envelope boundaries."
            )

        return PolicyEvaluationResult(
            status="AUTHORIZED",
            violations=[],
            warnings=warnings,
            checks=checks,
            remediation_advice=None
        )
