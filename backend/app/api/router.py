from fastapi import APIRouter
from app.api.routes import (
    auth,
    negotiations,
    proposals,
    policies,
    contracts,
    audit,
    suppliers,
    governance,
    demo,
    health
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(negotiations.router)
api_router.include_router(proposals.router)
api_router.include_router(policies.router)
api_router.include_router(contracts.router)
api_router.include_router(audit.router)
api_router.include_router(suppliers.router)
api_router.include_router(governance.router)
api_router.include_router(demo.router)
api_router.include_router(health.router)
