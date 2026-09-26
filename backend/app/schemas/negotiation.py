from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Dict, Any, Union
from datetime import datetime
from app.schemas.proposal import ProposalResponse, ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope, PolicyEvaluationResult

class NegotiationCreate(BaseModel):
    title: str = Field(..., description="Title of the procurement negotiation")
    category: str = Field(default="Enterprise Hardware / Microcontrollers")
    buyer_name: str = Field(default="NovaTech Industries")
    supplier_name: str = Field(default="Apex Components Ltd.")
    buyer_envelope: BuyerPrivateEnvelope
    supplier_envelope: SupplierPrivateEnvelope
    max_rounds: int = Field(default=6, ge=1, le=20)
    organization_id: str = Field(default="org-default-01")

class NegotiationRoundResponse(BaseModel):
    id: Optional[str] = None
    round_number: int
    buyer_proposal: Union[ProposalResponse, ProposalCreate, Dict[str, Any]]
    supplier_proposal: Optional[Union[ProposalResponse, ProposalCreate, Dict[str, Any]]] = None
    price_gap: float
    delivery_gap: int
    policy_result: Union[PolicyEvaluationResult, Dict[str, Any]]
    is_converged: bool = False
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NegotiationResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    category: str
    buyer_name: str
    supplier_name: str
    status: str
    current_round: int
    max_rounds: int
    convergence_score: float
    deadlock_score: float
    concession_velocity: str
    negotiation_momentum: str
    information_leakage_count: int
    policy_compliance_percent: float
    rounds: List[NegotiationRoundResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ConcessionMetrics(BaseModel):
    price_gap: float
    delivery_gap: int
    buyer_concession_rate: float
    supplier_concession_rate: float
    concession_velocity: float
    normalized_distance: float
    convergence_percent: float
    deadlock_risk: Literal["LOW", "MEDIUM", "HIGH"]
    status: str
