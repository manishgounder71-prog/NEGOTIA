from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.api.dependencies import get_current_user

router = APIRouter(prefix="/suppliers", tags=["Suppliers Intelligence"])

@router.get("")
async def list_suppliers(current_user: dict = Depends(get_current_user)):
    return [
        {
            "id": "supp-01",
            "name": "Apex Components Ltd.",
            "category": "Sensors & Microcontrollers",
            "negotiation_count": 14,
            "deals_closed": 11,
            "avg_concession_percent": 8.2,
            "compliance_score": 98.0,
            "reliability_score": 96.0,
            "risk_rating": "LOW",
            "status": "PREFERRED",
            "contact_email": "contracts@apexcomp.io"
        },
        {
            "id": "supp-02",
            "name": "SwiftCargo Logistics Intl.",
            "category": "Freight & Cold-Chain 3PL",
            "negotiation_count": 22,
            "deals_closed": 18,
            "avg_concession_percent": 11.5,
            "compliance_score": 94.0,
            "reliability_score": 92.0,
            "risk_rating": "LOW",
            "status": "ACTIVE",
            "contact_email": "enterprise@swiftcargo.com"
        },
        {
            "id": "supp-03",
            "name": "Vanguard Semi Devices",
            "category": "ASIC & Power Management",
            "negotiation_count": 8,
            "deals_closed": 5,
            "avg_concession_percent": 4.8,
            "compliance_score": 89.0,
            "reliability_score": 88.0,
            "risk_rating": "MEDIUM",
            "status": "ACTIVE",
            "contact_email": "sales@vanguardsemi.com"
        }
    ]
