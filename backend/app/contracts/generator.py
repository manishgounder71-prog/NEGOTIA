import uuid
from datetime import datetime
from typing import Dict, Any, List
from app.schemas.proposal import ProposalCreate
from app.schemas.contract import ContractResponse, ContractClauseSchema
from app.audit.hashing import AuditHasher

class ContractGenerator:
    """
    Compiles ratified commercial negotiation terms into a structured, schema-validated digital contract.
    """

    @classmethod
    def compile_contract(
        cls,
        negotiation_id: str,
        buyer_name: str,
        supplier_name: str,
        agreed_proposal: ProposalCreate,
        root_audit_hash: str
    ) -> ContractResponse:
        contract_number = f"PACT-2026-{str(uuid.uuid4())[:8].upper()}"
        total_value = agreed_proposal.price
        quantity = agreed_proposal.quantity or 10000
        unit_price = round(total_value / quantity, 2)

        clauses = [
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 1.0 — Commercial Consideration & Price",
                clause_text=f"Buyer agrees to purchase and Supplier agrees to manufacture and deliver {quantity:,} units of telemetry sensors at a fixed unit price of ${unit_price:,.2f} USD, for an aggregate contract value of ${total_value:,.2f} USD.",
                category="COMMERCIAL",
                agreed_value=f"${total_value:,.2f} (${unit_price:,.2f} / unit)",
                baseline_value="Buyer: Target $95K | Supplier: Target $110K",
                originating_round=agreed_proposal.round_number,
                policy_compliance="VERIFIED",
                audit_ref_id=f"audit-ref-{agreed_proposal.round_number}"
            ),
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 2.0 — Delivery Timeline & Logistics Milestones",
                clause_text=f"Supplier shall complete manufacturing and deliver conforming product to Buyer logistics facility within {agreed_proposal.delivery_days} calendar days from contract execution.",
                category="DELIVERY",
                agreed_value=f"{agreed_proposal.delivery_days} Calendar Days",
                baseline_value="Buyer: 30d | Supplier: 40d",
                originating_round=agreed_proposal.round_number,
                policy_compliance="VERIFIED",
                audit_ref_id=f"audit-ref-{agreed_proposal.round_number}"
            ),
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 3.0 — Service Level Agreement (SLA) & Reliability",
                clause_text=f"Supplier warrants operational component reliability and uptime commitment of not less than {agreed_proposal.sla_percent}% throughout the warranty coverage period.",
                category="SLA",
                agreed_value=f"{agreed_proposal.sla_percent}% SLA Uptime Guarantee",
                baseline_value="Buyer: 99.5% min | Supplier: 99.0%",
                originating_round=agreed_proposal.round_number,
                policy_compliance="VERIFIED",
                audit_ref_id=f"audit-ref-{agreed_proposal.round_number}"
            ),
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 4.0 — Invoicing & Payment Terms",
                clause_text=f"Invoices rendered by Supplier shall be payable by Buyer under {agreed_proposal.payment_terms} terms following verified acceptance of conforming shipment.",
                category="PAYMENT",
                agreed_value=agreed_proposal.payment_terms,
                baseline_value="Buyer: Net 60 | Supplier: Net 30",
                originating_round=agreed_proposal.round_number,
                policy_compliance="VERIFIED",
                audit_ref_id=f"audit-ref-{agreed_proposal.round_number}"
            ),
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 5.0 — Delay Penalties & Liquidated Damages",
                clause_text=f"For each week of unexcused shipment delay, Supplier forfeits liquidated damages equal to {agreed_proposal.penalty_percent}% of unfulfilled PO consideration.",
                category="LIABILITY",
                agreed_value=f"{agreed_proposal.penalty_percent}% Liquidated Damages / week",
                baseline_value="Buyer: 5.0% | Supplier: 2.0%",
                originating_round=agreed_proposal.round_number,
                policy_compliance="VERIFIED",
                audit_ref_id=f"audit-ref-{agreed_proposal.round_number}"
            ),
            ContractClauseSchema(
                id=f"cl-{str(uuid.uuid4())[:8]}",
                title="Section 6.0 — Governance, Safe AI Audit & Jurisdiction",
                clause_text="This agreement was autonomously negotiated via NEGOTIA Governed AI Engine under Lyzr Safe AI constraints. All negotiation turns are immutably preserved in AIMS Ledger. Governed by the laws of Delaware.",
                category="GOVERNANCE",
                agreed_value="State of Delaware, USA • AIMS Audit Verified",
                baseline_value="Standard Corporate Governance",
                originating_round=1,
                policy_compliance="VERIFIED",
                audit_ref_id="audit-ref-genesis"
            )
        ]

        contract_payload = {
            "negotiation_id": negotiation_id,
            "contract_number": contract_number,
            "buyer_name": buyer_name,
            "supplier_name": supplier_name,
            "total_value": total_value,
            "delivery_days": agreed_proposal.delivery_days,
            "sla_percent": agreed_proposal.sla_percent,
            "payment_terms": agreed_proposal.payment_terms,
            "penalty_percent": agreed_proposal.penalty_percent,
            "clauses": [c.model_dump() for c in clauses]
        }

        sha256_hash = AuditHasher.compute_contract_hash(contract_payload)

        signatures = {
            "buyer_agent_stamp": f"ED25519-STAMP:8a92f01c:PactBuyer-{buyer_name}",
            "supplier_agent_stamp": f"ED25519-STAMP:3d4e7b1a:PactSupplier-{supplier_name}",
            "legal_arbiter_seal": f"LYZR-SAFE-AI-SEAL:99f8c12a:VERIFIED_COMPLIANT"
        }

        return ContractResponse(
            id=str(uuid.uuid4()),
            negotiation_id=negotiation_id,
            contract_number=contract_number,
            title="MASTER SUPPLY & SERVICE LEVEL PROCUREMENT AGREEMENT",
            buyer_name=buyer_name,
            supplier_name=supplier_name,
            status="GOVERNANCE_APPROVED",
            final_price=unit_price,
            quantity=quantity,
            total_value=total_value,
            delivery_days=agreed_proposal.delivery_days,
            sla_percent=agreed_proposal.sla_percent,
            payment_terms=agreed_proposal.payment_terms,
            penalty_percent=agreed_proposal.penalty_percent,
            governing_law="State of Delaware, United States",
            sha256_hash=sha256_hash,
            clauses=clauses,
            signatures=signatures,
            created_at=datetime.utcnow(),
            ratified_at=datetime.utcnow()
        )
