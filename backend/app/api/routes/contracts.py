from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.infrastructure.database import get_db
from app.api.dependencies import get_current_user
from app.domain.models import ContractModel
from app.schemas.contract import ContractResponse, ContractClauseSchema
from app.contracts.pdf_generator import PDFContractGenerator

router = APIRouter(prefix="/contracts", tags=["Contracts"])

@router.get("", response_model=List[ContractResponse])
async def list_contracts(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ContractModel).order_by(ContractModel.created_at.desc()))
    contracts = result.scalars().all()
    
    responses = []
    for c in contracts:
        responses.append(ContractResponse(
            id=c.id,
            negotiation_id=c.negotiation_id,
            contract_number=c.contract_number,
            title=c.title,
            buyer_name=c.buyer_name,
            supplier_name=c.supplier_name,
            status=c.status,
            final_price=c.final_price,
            quantity=c.quantity,
            total_value=c.total_value,
            delivery_days=c.delivery_days,
            sla_percent=c.sla_percent,
            payment_terms=c.payment_terms,
            penalty_percent=c.penalty_percent,
            governing_law=c.governing_law,
            sha256_hash=c.sha256_hash,
            clauses=[ContractClauseSchema(**cl) for cl in c.clauses_json],
            signatures=c.signatures_json,
            created_at=c.created_at,
            ratified_at=c.ratified_at
        ))
    return responses

@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContractModel).where((ContractModel.id == contract_id) | (ContractModel.negotiation_id == contract_id))
    )
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found.")

    return ContractResponse(
        id=c.id,
        negotiation_id=c.negotiation_id,
        contract_number=c.contract_number,
        title=c.title,
        buyer_name=c.buyer_name,
        supplier_name=c.supplier_name,
        status=c.status,
        final_price=c.final_price,
        quantity=c.quantity,
        total_value=c.total_value,
        delivery_days=c.delivery_days,
        sla_percent=c.sla_percent,
        payment_terms=c.payment_terms,
        penalty_percent=c.penalty_percent,
        governing_law=c.governing_law,
        sha256_hash=c.sha256_hash,
        clauses=[ContractClauseSchema(**cl) for cl in c.clauses_json],
        signatures=c.signatures_json,
        created_at=c.created_at,
        ratified_at=c.ratified_at
    )

@router.get("/{contract_id}/pdf")
async def download_contract_pdf(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContractModel).where((ContractModel.id == contract_id) | (ContractModel.negotiation_id == contract_id))
    )
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found.")

    contract_schema = ContractResponse(
        id=c.id,
        negotiation_id=c.negotiation_id,
        contract_number=c.contract_number,
        title=c.title,
        buyer_name=c.buyer_name,
        supplier_name=c.supplier_name,
        status=c.status,
        final_price=c.final_price,
        quantity=c.quantity,
        total_value=c.total_value,
        delivery_days=c.delivery_days,
        sla_percent=c.sla_percent,
        payment_terms=c.payment_terms,
        penalty_percent=c.penalty_percent,
        governing_law=c.governing_law,
        sha256_hash=c.sha256_hash,
        clauses=[ContractClauseSchema(**cl) for cl in c.clauses_json],
        signatures=c.signatures_json,
        created_at=c.created_at,
        ratified_at=c.ratified_at
    )

    pdf_bytes = PDFContractGenerator.generate_pdf_bytes(contract_schema)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={c.contract_number}.pdf"}
    )
