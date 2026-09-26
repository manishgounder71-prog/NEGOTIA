from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class AgentContext(BaseModel):
    role: Literal["BUYER", "SUPPLIER", "ARBITER"]
    negotiation_id: str
    round_number: int
    public_proposals: List[Dict[str, Any]]
    private_envelope_summary: Dict[str, Any]
    procurement_context: Dict[str, Any]

class AgentActionResponse(BaseModel):
    actor: Literal["BUYER", "SUPPLIER"]
    proposal_params: Dict[str, Any]
    strategic_rationale: str
    is_acceptance: bool = False
    model_name: str
    tokens_used: int = 0
