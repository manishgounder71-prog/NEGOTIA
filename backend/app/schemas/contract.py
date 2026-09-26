from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime

class ContractClauseSchema(BaseModel):
    id: str
    title: str
    clause_text: str
    category: str
    agreed_value: str
    baseline_value: str
    originating_round: int
    policy_compliance: str = "VERIFIED"
    audit_ref_id: str

class ContractResponse(BaseModel):
    id: str
    negotiation_id: str
    contract_number: str
    title: str
    buyer_name: str
    supplier_name: str
    status: str
    final_price: float
    quantity: int
    total_value: float
    delivery_days: int
    sla_percent: float
    payment_terms: str
    penalty_percent: float
    governing_law: str
    sha256_hash: str
    clauses: List[ContractClauseSchema] = Field(default_factory=list)
    signatures: Dict[str, str] = Field(default_factory=dict)
    created_at: datetime
    ratified_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
