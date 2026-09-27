import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Enum
)
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    organization_id = Column(String(64), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="PROCUREMENT_MANAGER")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    compliance_score = Column(Float, default=98.0)
    reliability_score = Column(Float, default=95.0)
    avg_concession_percent = Column(Float, default=8.5)
    risk_rating = Column(String(20), default="LOW")
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    organization_id = Column(String(64), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    buyer_name = Column(String(255), nullable=False)
    supplier_name = Column(String(255), nullable=False)
    status = Column(String(50), default="INITIALIZING")
    current_round = Column(Integer, default=1)
    max_rounds = Column(Integer, default=6)
    
    # Private Envelopes (Air-Gapped)
    buyer_envelope_json = Column(JSON, nullable=False)
    supplier_envelope_json = Column(JSON, nullable=False)
    
    # Metrics
    convergence_score = Column(Float, default=0.0)
    deadlock_score = Column(Float, default=0.0)
    concession_velocity = Column(String(100), default="0.0% / round")
    negotiation_momentum = Column(String(50), default="STABLE")
    information_leakage_count = Column(Integer, default=0)
    policy_compliance_percent = Column(Float, default=100.0)
    
    final_contract_id = Column(String(36), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    rounds = relationship("NegotiationRound", back_populates="negotiation", cascade="all, delete-orphan", order_by="NegotiationRound.round_number", lazy="selectin")
    audit_events = relationship("AuditEventModel", back_populates="negotiation", cascade="all, delete-orphan", order_by="AuditEventModel.timestamp", lazy="selectin")

class NegotiationRound(Base):
    __tablename__ = "negotiation_rounds"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    negotiation_id = Column(String(36), ForeignKey("negotiations.id"), nullable=False)
    round_number = Column(Integer, nullable=False)
    
    # Proposals & Reasoning
    buyer_proposal_json = Column(JSON, nullable=False)
    supplier_proposal_json = Column(JSON, nullable=True)
    
    price_gap = Column(Float, default=0.0)
    delivery_gap = Column(Integer, default=0)
    
    policy_result_json = Column(JSON, nullable=False)
    is_converged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    negotiation = relationship("Negotiation", back_populates="rounds")

    @property
    def buyer_proposal(self):
        return self.buyer_proposal_json

    @property
    def supplier_proposal(self):
        return self.supplier_proposal_json

    @property
    def policy_result(self):
        return self.policy_result_json

class ContractModel(Base):
    __tablename__ = "contracts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    negotiation_id = Column(String(36), ForeignKey("negotiations.id"), unique=True, nullable=False)
    contract_number = Column(String(64), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    buyer_name = Column(String(255), nullable=False)
    supplier_name = Column(String(255), nullable=False)
    status = Column(String(50), default="GOVERNANCE_APPROVED")
    
    final_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_value = Column(Float, nullable=False)
    delivery_days = Column(Integer, nullable=False)
    sla_percent = Column(Float, nullable=False)
    payment_terms = Column(String(50), nullable=False)
    penalty_percent = Column(Float, nullable=False)
    governing_law = Column(String(100), default="State of Delaware, USA")
    
    sha256_hash = Column(String(64), nullable=False)
    clauses_json = Column(JSON, nullable=False)
    signatures_json = Column(JSON, nullable=False)
    pdf_path = Column(String(512), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    ratified_at = Column(DateTime, default=datetime.utcnow)

class AuditEventModel(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    negotiation_id = Column(String(36), ForeignKey("negotiations.id"), nullable=False)
    round_number = Column(Integer, nullable=True)
    
    event_type = Column(String(50), nullable=False)
    actor = Column(String(50), nullable=False)
    action = Column(String(255), nullable=False)
    input_summary = Column(Text, nullable=False)
    decision = Column(Text, nullable=False)
    policy_result = Column(String(50), nullable=False)
    
    hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    raw_payload = Column(JSON, nullable=True)
    clause_ref = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    negotiation = relationship("Negotiation", back_populates="audit_events")

class HumanInterventionModel(Base):
    __tablename__ = "human_interventions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    negotiation_id = Column(String(36), ForeignKey("negotiations.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    reason = Column(String(100), nullable=False)
    action_taken = Column(String(50), nullable=False) # APPROVE, MODIFY, REJECT
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
