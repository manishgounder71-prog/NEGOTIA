# Backend Schema Document
# PactMatrix AI — Autonomous B2B Supply Chain & SLA Contract Negotiator

## Database Schema & Storage Architecture
PactMatrix AI utilizes an asynchronous SQLite database (with SQLAlchemy ORM / Pydantic v2 schemas) for lightweight, zero-dependency local execution, easily portable to PostgreSQL in enterprise environments.

---

## Entity Relationship Diagram (ERD)

```
┌──────────────────────┐         1:N         ┌────────────────────────┐
│ negotiation_sessions │────────────────────<│   negotiation_rounds   │
│  - id (UUID PK)      │                     │  - id (UUID PK)        │
│  - title             │                     │  - session_id (FK)     │
│  - status            │                     │  - round_number        │
│  - buyer_envelope    │                     │  - buyer_proposal      │
│  - supplier_envelope │                     │  - supplier_proposal   │
│  - created_at        │                     │  - arbiter_verdict     │
└──────────┬───────────┘                     └────────────────────────┘
           │
           │ 1:1
           ▼
┌──────────────────────┐         1:N         ┌────────────────────────┐
│      contracts       │────────────────────<│    aims_audit_logs     │
│  - id (UUID PK)      │                     │  - id (UUID PK)        │
│  - session_id (FK)   │                     │  - session_id (FK)     │
│  - contract_hash     │                     │  - event_type          │
│  - agreed_terms      │                     │  - agent_name          │
│  - pdf_path          │                     │  - payload             │
│  - signed_at         │                     │  - timestamp           │
└──────────────────────┘                     └────────────────────────┘
```

---

## Detailed Data Tables & Column Definitions

### 1. `negotiation_sessions`
Stores the overarching negotiation configuration, metadata, and private envelopes.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Unique UUID identifier for the negotiation session |
| `title` | VARCHAR(255) | NOT NULL | Title of the RFQ / Contract Negotiation |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'INITIALIZED' | `INITIALIZED`, `IN_PROGRESS`, `CONVERGED`, `DEADLOCKED`, `RENEGOTIATING` |
| `buyer_name` | VARCHAR(100) | NOT NULL | Name of the Buyer entity (e.g., "AeroSpace Dynamics Corp") |
| `supplier_name` | VARCHAR(100) | NOT NULL | Name of the Supplier entity (e.g., "Nexus Semiconductor Ltd") |
| `buyer_envelope` | JSON | NOT NULL | Private buyer envelope (targets, ceilings, SLA constraints) |
| `supplier_envelope`| JSON | NOT NULL | Private supplier envelope (targets, floors, lead times) |
| `max_rounds` | INTEGER | NOT NULL, DEFAULT 8 | Maximum permitted negotiation rounds before timeout |
| `current_round` | INTEGER | NOT NULL, DEFAULT 0 | Currently active round index |
| `convergence_score`| FLOAT | DEFAULT 0.0 | Normalized metric (0.0 to 1.0) of terms closeness |
| `created_at` | DATETIME | NOT NULL | Timestamp of session initialization |
| `updated_at` | DATETIME | NOT NULL | Timestamp of last round execution |

---

### 2. `negotiation_rounds`
Captures round-by-round proposals, strategic rationales, and arbiter interventions.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Unique UUID of the round |
| `session_id` | VARCHAR(36) | FOREIGN KEY (`negotiation_sessions.id`) | Reference to parent session |
| `round_number` | INTEGER | NOT NULL | Current round index (1, 2, 3...) |
| `buyer_proposal` | JSON | NOT NULL | Exact proposal parameters submitted by Buyer |
| `buyer_rationale`| TEXT | NULL | Chain-of-thought strategic reasoning of Buyer |
| `supplier_proposal`| JSON | NULL | Exact proposal parameters submitted by Supplier |
| `supplier_rationale`| TEXT | NULL | Chain-of-thought strategic reasoning of Supplier |
| `price_gap` | FLOAT | NOT NULL | Difference between Supplier Offer and Buyer Offer ($) |
| `safe_ai_passed` | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether both proposals passed Safe AI validation |
| `guardrail_events`| JSON | DEFAULT '[]' | Array of intercepted violations or warnings |
| `created_at` | DATETIME | NOT NULL | Timestamp of turn completion |

---

### 3. `contracts`
Stores the finalized ratified agreement, signed clauses, and cryptographic verification hash.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Unique Contract UUID |
| `session_id` | VARCHAR(36) | UNIQUE, FOREIGN KEY (`negotiation_sessions.id`) | Linked negotiation session |
| `contract_number`| VARCHAR(64) | UNIQUE, NOT NULL | Human-readable contract ID (e.g., `PACT-2026-9842`) |
| `final_price` | FLOAT | NOT NULL | Agreed unit price ($ USD) |
| `quantity` | INTEGER | NOT NULL | Total procurement units |
| `delivery_days` | INTEGER | NOT NULL | Agreed delivery timeline (days from signing) |
| `sla_uptime_percent`| FLOAT | NOT NULL | Agreed SLA uptime commitment (%) |
| `penalty_per_day`| FLOAT | NOT NULL | Agreed liquidated damages penalty ($/day) |
| `payment_terms` | VARCHAR(50) | NOT NULL | Agreed payment terms (e.g., "Net 45") |
| `warranty_months`| INTEGER | NOT NULL | Agreed warranty period (months) |
| `governing_law` | VARCHAR(100)| NOT NULL, DEFAULT 'Delaware, USA' | Governing legal jurisdiction |
| `raw_clauses_json`| JSON | NOT NULL | Complete clause dictionary and special terms |
| `contract_hash` | VARCHAR(64) | NOT NULL | SHA-256 integrity hash of final terms JSON |
| `pdf_path` | VARCHAR(512)| NOT NULL | Filesystem path to compiled PDF contract document |
| `signed_at` | DATETIME | NOT NULL | Timestamp of mutual agreement ratification |

---

### 4. `aims_audit_logs`
Immutable audit trace record compliant with Lyzr AIMS governance standards.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Unique Audit Event UUID |
| `session_id` | VARCHAR(36) | FOREIGN KEY (`negotiation_sessions.id`) | Linked session |
| `round_number` | INTEGER | NULL | Linked round if applicable |
| `event_type` | VARCHAR(50) | NOT NULL | `ENVELOPE_LOCK`, `OFFER_SUBMITTED`, `SAFE_AI_CHECK`, `GUARDRAIL_INTERCEPT`, `AGREEMENT_RATIFIED`, `TELEMETRY_SHOCK` |
| `actor` | VARCHAR(50) | NOT NULL | `PactBuyer`, `PactSupplier`, `SafeAIGuardrail`, `LegalArbiter`, `ExternalTelemetry` |
| `severity` | VARCHAR(20) | NOT NULL, DEFAULT 'INFO' | `INFO`, `WARNING`, `GUARDRAIL_VIOLATION`, `CRITICAL` |
| `payload` | JSON | NOT NULL | Complete event state, mathematical delta, and rule trace |
| `timestamp` | DATETIME | NOT NULL | ISO-8601 millisecond timestamp |

---

## Core Pydantic Models & Schemas

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class BuyerEnvelopeSchema(BaseModel):
    target_price: float = Field(..., description="Desired ideal purchase price ($)")
    max_ceiling_price: float = Field(..., description="Hard maximum budget ceiling ($) - strictly enforced")
    target_delivery_days: int = Field(..., description="Desired delivery speed (days)")
    max_delivery_days: int = Field(..., description="Hard latest acceptable delivery date (days)")
    min_sla_uptime_percent: float = Field(99.5, description="Minimum acceptable SLA uptime (%)")
    min_penalty_per_day_late: float = Field(1500.0, description="Minimum required penalty for late shipments ($/day)")
    target_payment_terms: str = Field("Net 60", description="Desired payment terms")
    acceptable_payment_terms: List[str] = Field(default_factory=lambda: ["Net 30", "Net 45", "Net 60"])
    min_warranty_months: int = Field(24, description="Minimum required warranty period")
    strategy: Literal["boulware", "conceder", "tit_for_tat", "adaptive"] = "boulware"

class SupplierEnvelopeSchema(BaseModel):
    target_price: float = Field(..., description="Ideal quoting price ($)")
    floor_reservation_price: float = Field(..., description="Hard cost floor ($) - strictly protected")
    min_production_days: int = Field(..., description="Fastest expedited delivery feasible (days)")
    standard_delivery_days: int = Field(..., description="Standard production lead time (days)")
    max_sla_uptime_percent: float = Field(99.9, description="Maximum guaranteed uptime capability (%)")
    max_penalty_per_day_late: float = Field(2000.0, description="Maximum acceptable penalty liability ceiling ($/day)")
    target_payment_terms: str = Field("Net 30", description="Preferred cash flow terms")
    acceptable_payment_terms: List[str] = Field(default_factory=lambda: ["Net 30", "Net 45"])
    min_warranty_months: int = Field(12, description="Standard baseline warranty")
    strategy: Literal["boulware", "conceder", "tit_for_tat", "adaptive"] = "tit_for_tat"

class ProposalSchema(BaseModel):
    proposer: Literal["buyer", "supplier"]
    price: float
    delivery_days: int
    sla_uptime_percent: float
    penalty_per_day_late: float
    payment_terms: str
    warranty_months: int
    rationale: Optional[str] = None
    is_acceptance: bool = False

class SafeAICheckResult(BaseModel):
    is_valid: bool
    violations: List[str] = []
    warnings: List[str] = []
    remediated_proposal: Optional[ProposalSchema] = None

class ContractSchema(BaseModel):
    contract_id: str
    session_id: str
    contract_number: str
    buyer_name: str
    supplier_name: str
    final_price: float
    quantity: int
    delivery_days: int
    sla_uptime_percent: float
    penalty_per_day: float
    payment_terms: str
    warranty_months: int
    governing_law: str
    contract_hash: str
    signed_at: datetime
    pdf_url: str
```
