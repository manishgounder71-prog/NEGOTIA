from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime

class AuditEventCreate(BaseModel):
    negotiation_id: str
    round_number: Optional[int] = None
    event_type: str
    actor: str
    action: str
    input_summary: str
    decision: str
    policy_result: str
    raw_payload: Optional[Dict[str, Any]] = None
    clause_ref: Optional[str] = None

class AuditEventResponse(AuditEventCreate):
    id: str
    hash: str
    previous_hash: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class AuditVerificationResponse(BaseModel):
    valid: bool
    events_checked: int
    root_hash: str
    first_invalid_event: Optional[str] = None
    status: str = "AUDIT_CHAIN_VERIFIED"
