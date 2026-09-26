from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/governance", tags=["Governance"])

@router.get("/events")
async def list_governance_events(current_user: dict = Depends(get_current_user)):
    return [
        {
            "id": "gov-evt-01",
            "type": "PRICE_CEILING_ENFORCED",
            "severity": "CRITICAL_INTERCEPT",
            "action": "Blocked $107,000 Out-of-Bounds Proposal",
            "actor": "LYZR_SAFE_AI",
            "status": "PASS_CONTAINED"
        },
        {
            "id": "gov-evt-02",
            "type": "PROMPT_INJECTION_DEFENSE",
            "severity": "SECURITY_ALERT",
            "action": "Blocked Adversarial BATNA Extraction Probe",
            "actor": "PRIVACY_FIREWALL",
            "status": "ZERO_LEAKAGE"
        }
    ]
