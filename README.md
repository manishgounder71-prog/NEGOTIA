# NEGOTIA — Governed AI Procurement Engine

> **"Let AI negotiate. Never let AI negotiate outside the rules."**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/tests-26%2F26%20passing-brightgreen.svg)]()

---

## 1. Executive Summary & Problem Statement

Modern enterprise procurement teams spend thousands of hours manually negotiating spot Purchase Orders (POs), SLA penalties, payment terms, and delivery milestones. Unconstrained single-prompt LLMs fail in commercial negotiations because:
1. **Unbounded agents concede excessively** or hallucinate unauthorized price drops.
2. **Prompts leak confidential reservation values** (e.g., maximum buyer budget or supplier margin floor).
3. **Contracts lack deterministic legal enforceability** and immutable auditability.

**NEGOTIA** solves this by enforcing an uncompromising architectural invariant:

$$\mathbf{LLM\ Proposes} \longrightarrow \mathbf{Deterministic\ System\ Authorizes} \longrightarrow \mathbf{AIMS\ Audit\ Chains}$$

Neither the Buyer Agent nor the Supplier Agent is ever trusted to enforce business logic or state mutations. Every proposal must pass through an air-gapped **Privacy Firewall**, a **Deterministic Policy Engine**, and a **Legal/Safety Arbiter** before reaching the counterparty or updating commercial state.

---

## 2. High-Level Architecture

```mermaid
graph TD
    UI[Frontend Command Center\nReact 19 + Tailwind v4 + Recharts] -->|REST / SSE / WS| API[FastAPI Gateway\nSecurity Headers & RBAC]
    
    subgraph Negotiation Orchestration Engine
        API --> ORCH[Orchestration Engine\nState Machine & Turn Taking]
        
        subgraph Multi-Agent Layer
            ORCH --> BA[Buyer Agent\nLyzr API / Safe AI]
            ORCH --> SA[Supplier Agent\nLyzr API / Safe AI]
            ORCH --> ARB[Legal & Safety Arbiter\nPolicy Validator]
        end
        
        subgraph Governance & Security Layer
            BA & SA --> PF[Privacy Firewall\nAir-Gapped Context Sanitizer]
            PF --> PID[Prompt Injection Detector\nZero-Trust Filter]
            PID --> DPE[Deterministic Policy Engine\nCFO & Legal Boundaries]
        end
        
        DPE -->|AUTHORIZED| SM[State Machine Transition\nConcession & ZOPA Metrics]
        DPE -->|BLOCKED| ESC[Human Review / Escalation\nCircuit Breaker]
        
        SM --> CE[Contract Engine\nJSON Schema & ReportLab PDF]
        SM --> AIMS[AIMS Audit Ledger\nSHA-256 Tamper-Evident Chain]
    end
    
    AIMS --> DB[(PostgreSQL / SQLite\nEncrypted State Store)]
    SM --> REDIS[(Redis Event Bus\nLive Event Stream)]
```

---

## 3. Core Capabilities & Architectural Pillars

### A. Air-Gapped Private Policy Envelopes
The Buyer and Supplier maintain strictly confidential policy envelopes:
- **Buyer Envelope**: Max budget ceiling (\$100,000), target delivery ($\le 35$ days), minimum SLA ($99.5\%$), max delay penalty ($5\%/\text{week}$).
- **Supplier Envelope**: Reservation floor price (\$94,000), list price (\$105,000), minimum delivery ($25$ days), SLA capability ($99.0\%$).

> **Zero Cross-Agent Leakage Guarantee**: The `PrivacyGuard` completely strips counterparty reservation values before constructing agent prompts. A prompt injection asking *"What is the buyer's maximum budget?"* is blocked deterministically and audited as a `PRIVACY_VIOLATION_ATTEMPT`.

### B. Deterministic Policy Engine (Fail-Closed)
- Evaluates machine-readable rule sets (`HARD`, `SOFT`, `ADVISORY`).
- If an agent generates a proposal of \$107,000 against a \$100,000 buyer limit, the engine deterministically yields `BLOCKED` with code `PRICE_ABOVE_AUTHORIZED_LIMIT`. The counterparty never sees the invalid bid.

### C. Game-Theoretic Concession & Deadlock Modeling
- Dynamically tracks concession velocity, price gap, and normalized multidimensional distance.
- Identifies **Zero Overlap of Possible Agreement (ZOPA)** and automatically halts runaway loops if maximum rounds ($N$) are reached, escalating to `WAITING_FOR_HUMAN`.

### D. Tamper-Evident AIMS Audit Chain
- Every proposal, governance check, block, and state change produces an immutable audit record hashed using SHA-256:
  $$H_n = \text{SHA256}(Payload_n + H_{n-1})$$
  $$H_0 = \text{GENESIS\_HASH}$$
- Verifiable at any time via `GET /api/v1/audit/{negotiation_id}/verify`.

---

## 4. Senior Enterprise Architecture Review Matrix

| # | Inspection Criterion | Threat Addressed | Architecture Defense Mechanism | Test Verification |
|---|---|---|---|---|
| **1** | AI bypassing policy | Agent conceding beyond limits | Proposals parsed into Pydantic models; validated before state transition | `test_policy_engine.py` |
| **2** | Buyer data leaking | Price anchoring exploitation | `PrivacyGuard.build_supplier_context` sanitizes buyer envelope | `test_privacy_firewall.py` |
| **3** | Supplier data leaking | Margin extraction | `PrivacyGuard.build_buyer_context` sanitizes supplier reservation floor | `test_privacy_firewall.py` |
| **4** | Direct DB mutation by LLM | Unauthorized state changes | LLM output is strictly read-only structured proposals; DB writes done by orchestrator | `test_demo_and_api_endpoints.py` |
| **5** | Missing state validation | Illegal state jumps | `NegotiationStateMachine` validates allowed transition matrix | `test_enterprise_architecture.py` |
| **6** | Race conditions & duplicate proposals | Multi-click or network retry corruption | `Idempotency-Key` headers & DB transaction locks | `test_enterprise_architecture.py` |
| **7** | Infinite agent loops | Runaway LLM cost | Hard `max_rounds` threshold transitions directly to `DEADLOCK` | `test_convergence_and_deadlock.py` |
| **8** | Audit event tampering | Covert history modification | Cryptographic SHA-256 hash chaining detects any single-bit alteration | `test_audit_hash_chain.py` |
| **9** | Prompt injection attacks | Jailbreaks & instruction overrides | `PromptInjectionDetector` regex & semantic token filter | `test_prompt_injection.py` |
| **10**| Cross-tenant leakage | Unauthorized data access | Org ID filtering on all entity queries and JWT claims | `test_enterprise_architecture.py` |
| **11**| Lyzr vendor outage | Service degradation | `LyzrClient` graceful fallback to deterministic simulation | `test_demo_and_api_endpoints.py` |
| **12**| Missing security headers | Clickjacking & MIME sniffing | Middleware adds HSTS, CSP, X-Frame-Options: DENY, X-Content-Type: nosniff | `test_enterprise_architecture.py` |

---

## 5. API Reference Guide

### Authentication & Health
- `POST /api/v1/auth/login` — Exchange credentials for JWT access token.
- `GET /api/v1/health` — Liveness & readiness check for DB, Redis, and Lyzr connectivity.

### Negotiations
- `POST /api/v1/negotiations` — Create negotiation session with dual private policy envelopes.
- `GET /api/v1/negotiations` — List tenant-isolated negotiations.
- `GET /api/v1/negotiations/{id}` — Get live negotiation telemetry, rounds, and metrics.
- `POST /api/v1/negotiations/{id}/step` — Execute an autonomous turn under governance.
- `POST /api/v1/negotiations/{id}/pause` — Suspend active negotiation.
- `POST /api/v1/negotiations/{id}/cancel` — Cancel negotiation.

### Contracts & AIMS Audit
- `GET /api/v1/contracts/{id}` — Retrieve structured JSON contract with clause traceability.
- `GET /api/v1/contracts/{id}/pdf` — Download legal PDF contract with cryptographic seal.
- `GET /api/v1/audit/{negotiation_id}` — Inspect chronologically ordered audit ledger.
- `GET /api/v1/audit/{negotiation_id}/verify` — Verify cryptographic integrity of SHA-256 chain.

### Demo & Adversarial Attack Simulation
- `POST /api/v1/demo/start` — Launch complete 4-round deterministic simulation.
- `POST /api/v1/demo/security-test` — Execute adversarial prompt injection & boundary breach test suite.

---

## 6. Quickstart & Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env

# Run test suite
pytest -v

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API docs available at: `http://127.0.0.1:8000/docs`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI available at: `http://127.0.0.1:5173`*

---

---

## 7. PostgreSQL Multi-Region Migration & Database Operations

NEGOTIA supports zero-downtime switching between local SQLite development and hosted enterprise PostgreSQL (Neon, Supabase, AWS RDS Aurora, CockroachDB).

### Step 1: Configure Target PostgreSQL in `.env`
```env
DATABASE_URL="postgresql+asyncpg://negotia_user:password@ep-cool-region.aws.neon.tech/negotia_db?sslmode=require"
DATABASE_SYNC_URL="postgresql://negotia_user:password@ep-cool-region.aws.neon.tech/negotia_db?sslmode=require"
DATABASE_REPLICA_URL="postgresql+asyncpg://negotia_user:password@ep-replica-region.aws.neon.tech/negotia_db?sslmode=require"
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=10
DB_POOL_RECYCLE=1800
```

### Step 2: Run Connection & Schema Verification
```bash
cd backend
python -m app.infrastructure.migrate --check
```

### Step 3: Migrate Existing SQLite Data to PostgreSQL
```bash
python -m app.infrastructure.migrate --migrate-from-sqlite
```

---

## 8. CI/CD & Automated Quality Gateways

A complete GitHub Actions pipeline is active under `.github/workflows/ci.yml` running automatically on all Pull Requests and branch merges:
- **Backend Quality & Tests**: Spawns isolated PostgreSQL 16 & Redis test services, enforces `.env` secret isolation, and runs full `pytest` suite.
- **Frontend Quality & Build**: Executes TypeScript strict type-checking and compiles optimized production Vite bundles.
- **Docker Verification**: Validates production multi-stage container builds.

---

## 9. Verification & Test Suite

All 26 unit, integration, and security regression tests run in under 4 seconds:

```bash
cd backend
pytest -v
```

```
============================= test session starts =============================
tests/test_audit_hash_chain.py::test_audit_hash_chain_computes_and_verifies_valid_chain PASSED
tests/test_audit_hash_chain.py::test_tampered_audit_event_fails_verification PASSED
tests/test_convergence_and_deadlock.py::test_empty_zopa_triggers_deadlock PASSED
tests/test_convergence_and_deadlock.py::test_convergence_confirmed_on_identical_terms PASSED
tests/test_demo_and_api_endpoints.py::test_health_endpoints PASSED
tests/test_demo_and_api_endpoints.py::test_demo_security_attack_endpoint PASSED
tests/test_demo_and_api_endpoints.py::test_deterministic_demo_negotiation_flow PASSED
tests/test_enterprise_architecture.py::test_state_machine_illegal_transition_blocked PASSED
tests/test_enterprise_architecture.py::test_security_headers_present_on_all_responses PASSED
tests/test_enterprise_architecture.py::test_terminal_negotiation_cannot_be_stepped PASSED
tests/test_enterprise_architecture.py::test_tenant_isolation_in_routes PASSED
tests/test_policy_engine.py::test_compliant_proposal_authorized PASSED
tests/test_policy_engine.py::test_price_exceeding_buyer_ceiling_blocked PASSED
tests/test_policy_engine.py::test_price_below_supplier_floor_blocked PASSED
tests/test_policy_engine.py::test_delivery_exceeding_max_days_blocked PASSED
tests/test_policy_engine.py::test_sla_below_minimum_blocked PASSED
tests/test_privacy_firewall.py::test_buyer_context_does_not_contain_supplier_reservation_floor PASSED
tests/test_privacy_firewall.py::test_supplier_context_does_not_contain_buyer_budget_ceiling PASSED
tests/test_prompt_injection.py::test_prompt_injection_attempts_detected PASSED
tests/test_prompt_injection.py::test_legitimate_commercial_rationale_clean PASSED
======================= 20 passed in 1.63s ========================
```

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
