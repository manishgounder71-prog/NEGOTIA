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

class ProposalResponse(ProposalCreate):
    id: str
    negotiation_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
