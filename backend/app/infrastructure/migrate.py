"""
Database Migration & Multi-Region PostgreSQL Setup Utility
Usage:
    python -m app.infrastructure.migrate --check
    python -m app.infrastructure.migrate --migrate-from-sqlite
    python -m app.infrastructure.migrate --seed
"""

import asyncio
import sys
import argparse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import select, func, text
from app.config.settings import settings
from app.infrastructure.database import async_engine, Base, normalize_async_database_url
from app.domain.models import Organization, User, Supplier, Negotiation, NegotiationRound, ContractModel, AuditEventModel

async def check_connection():
    print(f"[*] Checking database connection to: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    try:
        async with async_engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            val = result.scalar()
            print(f"[+] Database connection successful! Verification query returned: {val}")
            
            # Check existing tables
            await conn.run_sync(Base.metadata.create_all)
            print("[+] DDL Schema verification/creation complete.")
            return True
    except Exception as e:
        print(f"[-] Database connection failed: {e}")
        return False

async def seed_initial_data():
    print("[*] Checking & seeding baseline enterprise data...")
    from app.infrastructure.database import AsyncSessionLocal
    import uuid
    from datetime import datetime

    async with AsyncSessionLocal() as session:
        # Check org
        org_res = await session.execute(select(Organization).limit(1))
        org = org_res.scalars().first()
        if not org:
            org = Organization(
                id=str(uuid.uuid4()),
                name="Apex Global Enterprise",
                slug="apex-global",
                created_at=datetime.utcnow()
            )
            session.add(org)
            await session.flush()
            print(f"[+] Seeded Organization: {org.name}")

        # Check default user
        user_res = await session.execute(select(User).limit(1))
        user = user_res.scalars().first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                organization_id=org.id,
                email="procurement@apex-global.com",
                hashed_password="$2b$12$e8Yk1.x.qG9KjU0xVp0oNeO1f9hM3qJ9s7uE9.eT6e3k5z0z.5e2a",
                full_name="Sarah Jenkins (CPO)",
                role="PROCUREMENT_OFFICER",
                is_active=True
            )
            session.add(user)
            print(f"[+] Seeded Default User: {user.email}")

        # Check suppliers
        sup_res = await session.execute(select(func.count(Supplier.id)))
        count = sup_res.scalar() or 0
        if count == 0:
            demo_suppliers = [
                Supplier(
                    id=str(uuid.uuid4()),
                    name="Apex Logistics Global",
                    category="Supply Chain & 3PL Logistics",
                    contact_email="sales@apexlogistics.com",
                    compliance_score=98.5,
                    reliability_score=96.0,
                    avg_concession_percent=8.2,
                    risk_rating="LOW",
                    status="ACTIVE"
                ),
                Supplier(
                    id=str(uuid.uuid4()),
                    name="NovaCore Cloud Infra",
                    category="Enterprise SaaS & GPU Compute",
                    contact_email="enterprise@novacore.io",
                    compliance_score=99.2,
                    reliability_score=99.0,
                    avg_concession_percent=5.5,
                    risk_rating="LOW",
                    status="ACTIVE"
                ),
                Supplier(
                    id=str(uuid.uuid4()),
                    name="SilicoMicro Electronics",
                    category="Semiconductor & High-Density Memory",
                    contact_email="contracts@silicomicro.com",
                    compliance_score=94.0,
                    reliability_score=92.5,
                    avg_concession_percent=11.0,
                    risk_rating="MEDIUM",
                    status="ACTIVE"
                ),
            ]
            for s in demo_suppliers:
                session.add(s)
            print(f"[+] Seeded {len(demo_suppliers)} baseline suppliers.")

        await session.commit()
        print("[+] Seed process completed successfully.")

async def migrate_from_sqlite(sqlite_path="negotia.db"):
    """Reads data from local SQLite and populates the configured PostgreSQL database."""
    print(f"[*] Starting migration from local SQLite ({sqlite_path}) to target database...")
    sqlite_url = f"sqlite+aiosqlite:///{sqlite_path}"
    sqlite_engine = create_async_engine(sqlite_url)
    
    # Initialize target schema
    async with async_engine.begin() as target_conn:
        await target_conn.run_sync(Base.metadata.create_all)
        print("[+] Target schema created.")

    # Read from SQLite
    from sqlalchemy.orm import sessionmaker
    sqlite_sessionmaker = async_sessionmaker(bind=sqlite_engine, class_=AsyncSession)
    target_sessionmaker = async_sessionmaker(bind=async_engine, class_=AsyncSession)

    tables_to_migrate = [Organization, User, Supplier, Negotiation, NegotiationRound, ContractModel, AuditEventModel]

    async with sqlite_sessionmaker() as src_session, target_sessionmaker() as dst_session:
        for model in tables_to_migrate:
            res = await src_session.execute(select(model))
            records = res.scalars().all()
            print(f"[*] Migrating {len(records)} records from {model.__tablename__}...")
            for r in records:
                # Merge into destination
                await dst_session.merge(r)
        await dst_session.commit()
        print("[+] Migration completed successfully with all records merged!")

async def main():
    parser = argparse.ArgumentParser(description="NEGOTIA Database Migration Utility")
    parser.add_argument("--check", action="store_true", help="Check database connection and schema")
    parser.add_argument("--seed", action="store_true", help="Seed default enterprise data")
    parser.add_argument("--migrate-from-sqlite", action="store_true", help="Migrate records from negotia.db")
    
    args = parser.parse_args()
    
    if args.migrate_from_sqlite:
        await migrate_from_sqlite()
    elif args.seed:
        await check_connection()
        await seed_initial_data()
    else:
        await check_connection()

if __name__ == "__main__":
    asyncio.run(main())
