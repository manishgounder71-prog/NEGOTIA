from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.infrastructure.database import get_db
from app.api.dependencies import get_current_user
from app.domain.models import AuditEventModel
from app.schemas.audit import AuditEventResponse, AuditVerificationResponse
from app.audit.integrity import AuditIntegrityValidator

router = APIRouter(prefix="/audit", tags=["AIMS Audit Ledger"])

@router.get("/{negotiation_id}", response_model=List[AuditEventResponse])
async def get_audit_ledger(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AuditEventModel).where(AuditEventModel.negotiation_id == negotiation_id).order_by(AuditEventModel.timestamp)
    )
    events = result.scalars().all()
    return events

@router.get("/{negotiation_id}/verify", response_model=AuditVerificationResponse)
async def verify_audit_chain(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AuditEventModel).where(AuditEventModel.negotiation_id == negotiation_id).order_by(AuditEventModel.timestamp)
    )
    events = result.scalars().all()
    
    event_dicts = [
        {
            "id": e.id,
            "hash": e.hash,
            "previous_hash": e.previous_hash,
            "raw_payload": e.raw_payload or {}
        }
        for e in events
    ]

    is_valid, checked_count, root_hash, invalid_id = AuditIntegrityValidator.verify_chain(event_dicts)

    return AuditVerificationResponse(
        valid=is_valid,
        events_checked=checked_count,
        root_hash=root_hash,
        first_invalid_event=invalid_id,
        status="AUDIT_CHAIN_VERIFIED" if is_valid else "CORRUPTED_CHAIN_DETECTED"
    )
