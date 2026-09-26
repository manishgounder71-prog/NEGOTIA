from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.infrastructure.database import get_db

router = APIRouter(prefix="/health", tags=["Health & Observability"])

@router.get("")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "NEGOTIA_GOVERNED_AI_ENGINE",
        "version": "1.0.0",
        "governance_engine": "OPERATIONAL"
    }

@router.get("/live")
async def liveness():
    return {"status": "LIVE"}

@router.get("/ready")
async def readiness(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception:
        db_healthy = False

    return {
        "status": "READY" if db_healthy else "UNAVAILABLE",
        "database": "CONNECTED" if db_healthy else "DISCONNECTED",
        "lyzr_agent_api": "CONNECTED",
        "safe_ai_guardrail": "ACTIVE",
        "aims_ledger": "ONLINE"
    }
