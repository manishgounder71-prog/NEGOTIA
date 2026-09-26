from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from app.api.dependencies import get_current_user
from app.governance.policy_engine import DeterministicPolicyEngine
from app.schemas.proposal import ProposalCreate
from app.schemas.policy import BuyerPrivateEnvelope, SupplierPrivateEnvelope, PolicyEvaluationResult

router = APIRouter(prefix="/policies", tags=["Policy Center"])

@router.post("/validate", response_model=PolicyEvaluationResult)
async def validate_proposal_against_policies(
    proposal: ProposalCreate,
    buyer_envelope: BuyerPrivateEnvelope,
    supplier_envelope: SupplierPrivateEnvelope,
    current_user: dict = Depends(get_current_user)
):
    return DeterministicPolicyEngine.evaluate(proposal, buyer_envelope, supplier_envelope)

@router.get("/rules")
async def list_global_policy_rules(current_user: dict = Depends(get_current_user)):
    return [
        {"id": "RULE-01", "name": "Hard Budget Ceiling", "category": "FINANCE", "severity": "HARD", "action": "BLOCK"},
        {"id": "RULE-02", "name": "Minimum SLA Uptime (99.5%)", "category": "SLA", "severity": "HARD", "action": "BLOCK"},
        {"id": "RULE-03", "name": "Mandatory Delay Penalties (>=5%)", "category": "LEGAL", "severity": "HARD", "action": "BLOCK"},
        {"id": "RULE-04", "name": "Zero-Knowledge Envelope Isolation", "category": "PRIVACY", "severity": "HARD", "action": "BLOCK"}
    ]
