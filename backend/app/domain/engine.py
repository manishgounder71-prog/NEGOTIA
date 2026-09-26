import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.domain.models import Negotiation, NegotiationRound, ContractModel, AuditEventModel
from app.domain.state_machine import NegotiationStateMachine
from app.domain.concession import ConcessionEngine
from app.domain.convergence import ConvergenceEngine
from app.domain.deadlock import DeadlockEngine
from app.agents.buyer_agent import BuyerAgent
from app.agents.supplier_agent import SupplierAgent
from app.agents.arbiter_agent import LegalSafetyArbiter
from app.contracts.generator import ContractGenerator
from app.contracts.pdf_generator import PDFContractGenerator
from app.audit.hashing import AuditHasher
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope
from app.schemas.proposal import ProposalCreate
from app.config.logging import logger

class NegotiationOrchestrationEngine:
    """
    Core Multi-Agent Orchestration Engine for NEGOTIA.
    Manages turn taking, privacy boundaries, deterministic policy evaluation,
    concession metrics, contract generation, and immutable audit logging.
    """

    @classmethod
    async def create_negotiation(
        cls,
        title: str,
        category: str,
        buyer_name: str,
        supplier_name: str,
        buyer_envelope: BuyerPrivateEnvelope,
        supplier_envelope: SupplierPrivateEnvelope,
        max_rounds: int,
        organization_id: str,
        db: AsyncSession
    ) -> Negotiation:
        # Check ZOPA
        is_empty, reason = DeadlockEngine.is_zopa_empty(buyer_envelope, supplier_envelope)
        initial_status = "DEADLOCK" if is_empty else "INITIALIZING"

        session = Negotiation(
            id=str(uuid.uuid4()),
            organization_id=organization_id,
            title=title,
            category=category,
            buyer_name=buyer_name,
            supplier_name=supplier_name,
            status=initial_status,
            current_round=1,
            max_rounds=max_rounds,
            buyer_envelope_json=buyer_envelope.model_dump(),
            supplier_envelope_json=supplier_envelope.model_dump(),
            convergence_score=0.0,
            deadlock_score=1.0 if is_empty else 0.0,
            concession_velocity="0.0% / round",
            negotiation_momentum="STABLE",
            information_leakage_count=0,
            policy_compliance_percent=100.0,
            started_at=datetime.utcnow()
        )

        db.add(session)
        await db.flush()

        # Genesis Audit Event
        genesis_event = AuditEventModel(
            id=str(uuid.uuid4()),
            negotiation_id=session.id,
            round_number=0,
            event_type="NEGOTIATION_INIT",
            actor="GOVERNANCE_GATE",
            action="Negotiation Session Initialized",
            input_summary=f"Session {session.id} created. Dual private policy envelopes cryptographically locked.",
            decision="Envelopes locked. State machine initialized.",
            policy_result="PASSED",
            hash=AuditHasher.compute_hash({"init": session.id, "title": title}, AuditHasher.GENESIS_HASH),
            previous_hash=AuditHasher.GENESIS_HASH,
            raw_payload={"init": session.id, "title": title}
        )
        db.add(genesis_event)
        await db.commit()
        await db.refresh(session)
        return session

    @classmethod
    async def step_round(
        cls,
        negotiation_id: str,
        db: AsyncSession,
        injected_buyer_proposal: Optional[ProposalCreate] = None,
        injected_supplier_proposal: Optional[ProposalCreate] = None
    ) -> NegotiationRound:
        # Fetch Session
        result = await db.execute(select(Negotiation).where(Negotiation.id == negotiation_id))
        session = result.scalar_one_or_none()
        if not session:
            raise ValueError(f"Negotiation {negotiation_id} not found.")

        # Guard against stepping terminal or deadlocked negotiations
        if session.status in ["AGREED", "DEADLOCK", "CANCELLED", "FAILED"]:
            raise ValueError(f"Cannot step negotiation: session is in terminal state '{session.status}'.")

        # Check if max rounds exceeded without consensus -> Transition to DEADLOCK
        if session.current_round > session.max_rounds:
            session.status = "DEADLOCK"
            session.deadlock_score = 1.0
            await db.commit()
            raise ValueError(f"Negotiation reached maximum round limit ({session.max_rounds}). Status transitioned to DEADLOCK.")

        buyer_env = BuyerPrivateEnvelope(**session.buyer_envelope_json)
        supp_env = SupplierPrivateEnvelope(**session.supplier_envelope_json)
        round_number = session.current_round

        # 1. Buyer Agent Turn
        if injected_buyer_proposal:
            buyer_prop = injected_buyer_proposal
        else:
            buyer_prop = await BuyerAgent.generate_proposal(
                negotiation_id=session.id,
                round_number=round_number,
                public_history=[],
                buyer_envelope=buyer_env
            )

        # 2. Arbiter Validates Buyer Proposal
        buyer_policy_result = LegalSafetyArbiter.inspect_proposal(buyer_prop, buyer_env, supp_env)

        # 3. Supplier Agent Turn
        if injected_supplier_proposal:
            supp_prop = injected_supplier_proposal
        else:
            supp_prop = await SupplierAgent.generate_counter_proposal(
                negotiation_id=session.id,
                round_number=round_number,
                public_history=[buyer_prop.model_dump()],
                supplier_envelope=supp_env
            )

        # 4. Arbiter Validates Supplier Proposal
        supp_policy_result = LegalSafetyArbiter.inspect_proposal(supp_prop, buyer_env, supp_env)

        # Merge Policy Results
        combined_status = "AUTHORIZED"
        violations = buyer_policy_result.violations + supp_policy_result.violations
        if violations:
            combined_status = "BLOCKED"
        
        policy_result_dict = {
            "status": combined_status,
            "violations": violations,
            "checks": [c.model_dump() for c in (buyer_policy_result.checks + supp_policy_result.checks)]
        }

        # Concession & Convergence Metrics
        metrics = ConcessionEngine.calculate_metrics(
            buyer_proposal=buyer_prop,
            supplier_proposal=supp_prop,
            round_number=round_number
        )

        is_agreed, agree_reason = ConvergenceEngine.check_agreement(buyer_prop, supp_prop)

        # Create Round Record
        round_record = NegotiationRound(
            id=str(uuid.uuid4()),
            negotiation_id=session.id,
            round_number=round_number,
            buyer_proposal_json=buyer_prop.model_dump(),
            supplier_proposal_json=supp_prop.model_dump(),
            price_gap=metrics.price_gap,
            delivery_gap=metrics.delivery_gap,
            policy_result_json=policy_result_dict,
            is_converged=is_agreed,
            created_at=datetime.utcnow()
        )
        db.add(round_record)

        # Update Session State
        session.convergence_score = metrics.convergence_percent
        session.concession_velocity = f"{metrics.concession_velocity:+,.0f} / round"
        session.negotiation_momentum = metrics.status

        # Previous Audit Hash
        audit_res = await db.execute(
            select(AuditEventModel).where(AuditEventModel.negotiation_id == session.id).order_by(AuditEventModel.timestamp.desc())
        )
        last_audit = audit_res.scalars().first()
        prev_hash = last_audit.hash if last_audit else AuditHasher.GENESIS_HASH

        # Audit Event for this Round
        round_audit_payload = {
            "round": round_number,
            "buyer_price": buyer_prop.price,
            "supplier_price": supp_prop.price,
            "policy_status": combined_status
        }
        current_hash = AuditHasher.compute_hash(round_audit_payload, prev_hash)

        audit_event = AuditEventModel(
            id=str(uuid.uuid4()),
            negotiation_id=session.id,
            round_number=round_number,
            event_type="PROPOSAL_EVALUATED" if combined_status == "AUTHORIZED" else "POLICY_BLOCKED",
            actor="LEGAL_ARBITER",
            action=f"Round 0{round_number} Proposals Evaluated",
            input_summary=f"Buyer: ${buyer_prop.price:,.0f} | Supplier: ${supp_prop.price:,.0f}",
            decision="Proposals Authorized" if combined_status == "AUTHORIZED" else f"Blocked: {violations[0] if violations else 'Policy Violation'}",
            policy_result=combined_status,
            hash=current_hash,
            previous_hash=prev_hash,
            raw_payload=round_audit_payload
        )
        db.add(audit_event)

        # Handle Consensus & Contract Generation
        if is_agreed and combined_status == "AUTHORIZED":
            session.status = "AGREED"
            session.completed_at = datetime.utcnow()

            # Compile Structured Contract
            contract_schema = ContractGenerator.compile_contract(
                negotiation_id=session.id,
                buyer_name=session.buyer_name,
                supplier_name=session.supplier_name,
                agreed_proposal=buyer_prop,
                root_audit_hash=current_hash
            )

            contract_model = ContractModel(
                id=contract_schema.id,
                negotiation_id=session.id,
                contract_number=contract_schema.contract_number,
                title=contract_schema.title,
                buyer_name=contract_schema.buyer_name,
                supplier_name=contract_schema.supplier_name,
                status="GOVERNANCE_APPROVED",
                final_price=contract_schema.final_price,
                quantity=contract_schema.quantity,
                total_value=contract_schema.total_value,
                delivery_days=contract_schema.delivery_days,
                sla_percent=contract_schema.sla_percent,
                payment_terms=contract_schema.payment_terms,
                penalty_percent=contract_schema.penalty_percent,
                governing_law=contract_schema.governing_law,
                sha256_hash=contract_schema.sha256_hash,
                clauses_json=[c.model_dump() for c in contract_schema.clauses],
                signatures_json=contract_schema.signatures,
                pdf_path=f"/tmp/{contract_schema.contract_number}.pdf",
                created_at=datetime.utcnow()
            )
            db.add(contract_model)
            session.final_contract_id = contract_model.id

        elif combined_status == "BLOCKED":
            session.status = "POLICY_BLOCKED"
        else:
            session.current_round += 1
            session.status = "RUNNING"

        await db.commit()
        await db.refresh(round_record)
        return round_record
