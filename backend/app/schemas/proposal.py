from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime
import uuid

class CommercialTerms(BaseModel):
    price: float = Field(..., description="Total price in USD")
    quantity: int = Field(..., description="Units to procure")
    unit_price: Optional[float] = Field(None, description="Price per unit ($)")
    delivery_days: int = Field(..., description="Delivery timeline in calendar days")
    sla_percent: float = Field(..., description="Service level agreement uptime commitment (e.g. 99.5)")
    payment_terms: str = Field(..., description="Payment terms (e.g. Net 30, Net 45, Net 60)")
    penalty_percent: float = Field(..., description="Liquidated damages penalty per week of delay (e.g. 5.0)")
    currency: str = Field(default="USD")

class ProposalClause(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    clause_type: str
    title: str
    content: str
    agreed_value: str

class GroundingMetadata(BaseModel):
    source_policy_id: str = Field(..., description="ID of the policy envelope grounding this proposal")
    envelope_clause_ref: str = Field(..., description="Specific policy clause constraint applied")
    batna_ref: str = Field(..., description="Reference to BATNA boundary enforced")
    governing_rule_id: str = Field(..., description="Rule ID preventing boundary violation")
    evidence_chain_hash: Optional[str] = Field(None, description="SHA-256 hash of the evidence context")
    prompt_version: str = Field(default="v2.1.0", description="Version of system prompt used")
    confidence_score: float = Field(default=0.98, description="Uncertainty quantification score (0.0 - 1.0)")
    uncertainty_rating: Literal["LOW", "MEDIUM", "HIGH"] = Field(default="LOW", description="Uncertainty classification tier")
    confidence_reason: Optional[str] = Field(default="Fully grounded in policy bounds", description="Verification explanation")

class TokenMetrics(BaseModel):
    prompt_tokens: int = Field(default=0, description="Tokens consumed in prompt")
    completion_tokens: int = Field(default=0, description="Tokens consumed in completion")
    total_tokens: int = Field(default=0, description="Total token consumption")
    estimated_cost_usd: float = Field(default=0.0, description="Estimated inference cost in USD")
    is_cached: bool = Field(default=False, description="Whether response utilized cache")

class ProposalCreate(BaseModel):
    actor: Literal["BUYER", "SUPPLIER"]
    round_number: int
    price: float
    quantity: int = 10000
    delivery_days: int
    sla_percent: float
    payment_terms: str
    penalty_percent: float
    currency: str = "USD"
    rationale: Optional[str] = None
    is_acceptance: bool = False
    clauses: List[ProposalClause] = Field(default_factory=list)
    grounding: Optional[GroundingMetadata] = Field(None, description="Cryptographic & policy grounding attribution")
    token_metrics: Optional[TokenMetrics] = Field(None, description="Token consumption & costing telemetry")

class ProposalResponse(ProposalCreate):
    id: str
    negotiation_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
