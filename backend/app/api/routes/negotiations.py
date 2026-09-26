from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from app.infrastructure.database import get_db
from app.api.dependencies import get_current_user, require_role
from app.schemas.negotiation import NegotiationCreate, NegotiationResponse, NegotiationRoundResponse
from app.domain.models import Negotiation, NegotiationRound
from app.domain.engine import NegotiationOrchestrationEngine

router = APIRouter(prefix="/negotiations", tags=["Negotiations"])

@router.post("", response_model=NegotiationResponse, status_code=status.HTTP_201_CREATED)
async def create_negotiation(
    req: NegotiationCreate,
    idempotency_key: Optional[str] = Header(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await NegotiationOrchestrationEngine.create_negotiation(
        title=req.title,
        category=req.category,
        buyer_name=req.buyer_name,
        supplier_name=req.supplier_name,
        buyer_envelope=req.buyer_envelope,
        supplier_envelope=req.supplier_envelope,
        max_rounds=req.max_rounds,
        organization_id=current_user.get("organization_id", "org-default-01"),
        db=db
    )
    return session

@router.get("", response_model=List[NegotiationResponse])
async def list_negotiations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    org_id = current_user.get("organization_id", "org-default-01")
    result = await db.execute(
        select(Negotiation).where(Negotiation.organization_id == org_id).order_by(Negotiation.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{negotiation_id}", response_model=NegotiationResponse)
async def get_negotiation(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Negotiation).where(Negotiation.id == negotiation_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Negotiation session not found.")
    return session

@router.post("/{negotiation_id}/step", response_model=NegotiationRoundResponse)
async def step_negotiation(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    round_record = await NegotiationOrchestrationEngine.step_round(
        negotiation_id=negotiation_id,
        db=db
    )
    return round_record

@router.post("/{negotiation_id}/pause")
async def pause_negotiation(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Negotiation).where(Negotiation.id == negotiation_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Negotiation not found.")
    session.status = "PAUSED"
    await db.commit()
    return {"status": "PAUSED", "negotiation_id": negotiation_id}

@router.post("/{negotiation_id}/cancel")
async def cancel_negotiation(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Negotiation).where(Negotiation.id == negotiation_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Negotiation not found.")
    session.status = "CANCELLED"
    session.completed_at = datetime.utcnow()
    await db.commit()
    return {"status": "CANCELLED", "negotiation_id": negotiation_id}
