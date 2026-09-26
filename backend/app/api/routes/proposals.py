from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.infrastructure.database import get_db
from app.api.dependencies import get_current_user
from app.domain.models import NegotiationRound
from app.schemas.proposal import ProposalResponse

router = APIRouter(prefix="/negotiations/{negotiation_id}/proposals", tags=["Proposals"])

@router.get("", response_model=List[dict])
async def list_proposals(
    negotiation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(NegotiationRound).where(NegotiationRound.negotiation_id == negotiation_id).order_by(NegotiationRound.round_number)
    )
    rounds = result.scalars().all()
    proposals = []
    for r in rounds:
        proposals.append(r.buyer_proposal_json)
        if r.supplier_proposal_json:
            proposals.append(r.supplier_proposal_json)
    return proposals
