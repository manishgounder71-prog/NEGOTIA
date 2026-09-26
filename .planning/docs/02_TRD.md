# Technical Requirements Document (TRD)
# PactMatrix AI — Autonomous B2B Supply Chain & SLA Contract Negotiator

## Technical Architecture Overview
PactMatrix AI is structured into three clean, decoupled tiers adhering strictly to the HiDevs AI Quest required repository structure:
- `agents/`: Autonomous Lyzr-powered agent definitions, policy envelope validators, multi-agent state machines, concession algorithms, and Safe AI guardrails.
- `backend/`: High-performance Python FastAPI service exposing REST & WebSocket endpoints for live negotiation control, PDF contract compilation, telemetry webhooks, and AIMS audit persistence.
- `frontend/`: Modern responsive Next.js / Vite React application with Dark Luxury / Glassmorphism aesthetic, interactive real-time Arena, live Recharts bid & concession curves, clause diff matrix, and PDF contract previewer.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                    Frontend UI (React)                 │
                    │  - Negotiation Arena   - Concession Curves (Recharts)  │
                    │  - Policy Configurator - PDF Contract & AIMS Viewer    │
                    └───────────────────────────┬────────────────────────────┘
                                                │ REST / WebSocket
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               FastAPI Backend (Python)                 │
                    │  - /negotiation/start  - /negotiation/step             │
                    │  - /contract/generate  - /aims/audit-log               │
                    │  - /webhooks/telemetry - /rfq/multi-vendor             │
                    └───────────────────────────┬────────────────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│   Buyer Agent    │                  │  Supplier Agent  │                  │  Legal Arbiter   │
│ (Lyzr Automata / │                  │ (Lyzr Automata / │                  │ (Lyzr Safe AI    │
│  Agent API)      │                  │  Agent API)      │                  │  Guardrail)      │
└────────┬─────────┘                  └────────┬─────────┘                  └────────┬─────────┘
         │                                      │                                      │
         └──────────────────┬───────────────────┴──────────────────────────────────────┘
                            ▼
              ┌───────────────────────────┐
              │ State Machine & Arbiter   │
              │ - ZOPA & Pareto Engine    │
              │ - Deadlock Mitigation     │
              │ - Contract Compiler (PDF) │
              │ - AIMS Immutable Ledger   │
              └───────────────────────────┘
```

---

## Technology Stack

### 1. Agents Tier (`agents/`)
- **Framework**: Lyzr Agent API (`lyzr-agent-api`) & Lyzr Automata (`lyzr-automata`).
- **LLM Engine**: OpenAI GPT-4o / Claude 3.5 Sonnet / Groq Llama-3-70b (configurable via environment variables with graceful fallback and mock emulation mode for zero-key evaluation).
- **Guardrails**: Lyzr Safe AI hard-constraint interceptors (numerical bounds checker + legal compliance filters).
- **Bargaining Algorithms**:
  - Boulware concession curve: $P(t) = P_{min} + (P_{target} - P_{min}) \cdot (1 - (t/T)^\beta)$ where $\beta > 1$ represents hardliner posture.
  - Conceder concession curve: $\beta < 1$ for rapid convergence when deadlines approach.
  - Pareto Frontier Optimizer for multi-issue bargaining (Unit Price, Volume, Delivery Lead Time, Payment Terms, Penalty Per Day Late, Warranty Months).

### 2. Backend Tier (`backend/`)
- **Framework**: Python 3.11+ / FastAPI with Uvicorn ASGI server.
- **Data Validation**: Pydantic v2 schemas for all payloads, contract clauses, and audit events.
- **Contract PDF Engine**: ReportLab / WeasyPrint with custom CSS templates, digital signature stamps, and SHA-256 integrity hashing.
- **Database / State Storage**: SQLite with SQLAlchemy async ORM (and in-memory session cache) for deterministic zero-dependency local runs.
- **Audit Logging**: Lyzr AIMS-compliant audit emitter generating structured JSON-LD / CSV audit artifacts.

### 3. Frontend Tier (`frontend/`)
- **Framework**: React 18+ / Vite or Next.js with TypeScript.
- **Styling**: TailwindCSS + Vanilla CSS custom tokens following the **Dark Luxury** & **Glassmorphism** design system (`#0B0F19` deep space background, `#00E599` emerald for Buyer, `#3B82F6` electric blue for Supplier, `#8B5CF6` neon purple for Legal Arbiter).
- **Visualization**: Recharts / Chart.js for real-time bid progression curves, utility radar charts, and concession slope graphs.
- **Icons & Motion**: Lucide React icons + Framer Motion micro-animations.

---

## Core System Modules & APIs

### `agents/` Directory Structure
```
agents/
  ├── buyer_agent.py          # Lyzr-based Buyer agent with private envelope & strategy
  ├── supplier_agent.py       # Lyzr-based Supplier agent with cost floors & margin rules
  ├── legal_arbiter.py        # Safe AI guardrail & clause legal compliance validator
  ├── orchestrator.py         # Multi-round negotiation state machine & convergence logic
  ├── multi_vendor_rfq.py     # 1 Buyer vs N Suppliers simultaneous RFQ orchestrator
  ├── strategies.py           # Boulware, Conceder, Tit-for-Tat concession math
  └── config.py               # Prompt templates, default envelopes, LLM parameters
```

### `backend/` Directory Structure
```
backend/
  ├── main.py                 # FastAPI application root & CORS setup
  ├── routes/
  │   ├── negotiation.py      # Negotiation lifecycle (create, step, auto-run, status)
  │   ├── contracts.py        # Contract generation, verification, and PDF download
  │   ├── aims.py             # Lyzr AIMS audit log retrieval and export
  │   ├── telemetry.py        # Webhook simulator for supply chain disruption events
  │   └── rfq.py              # Multi-vendor RFQ tournament endpoints
  ├── models/
  │   ├── schemas.py          # Pydantic models for envelopes, offers, and contracts
  │   └── db_models.py        # SQLAlchemy database entities
  ├── services/
  │   ├── contract_pdf.py     # High-fidelity PDF generation with digital signature hash
  │   ├── aims_logger.py      # Immutable audit trail recorder
  │   └── zopa_analyzer.py    # Zone of Possible Agreement calculation & Pareto analysis
  └── database.py             # SQLite connection and session management
```

### `frontend/` Directory Structure
```
frontend/
  ├── index.html              # HTML shell with Google Fonts (Outfit & Inter)
  ├── src/
  │   ├── components/
  │   │   ├── Arena/          # Live negotiation ring, chat transcript, round stepper
  │   │   ├── PolicyEnvelopes/# Form builders for Buyer & Supplier CFO/Legal constraints
  │   │   ├── Analytics/      # Recharts bid curves, utility frontiers, concession deltas
  │   │   ├── ContractModal/  # Executable contract viewer, diff inspector, PDF exporter
  │   │   ├── AIMSViewer/     # Lyzr AIMS audit log timeline with filterable traces
  │   │   ├── TelemetryShock/ # Webhook trigger for weather/logistics disruption
  │   │   └── MultiVendorRFQ/ # 1-vs-3 Supplier comparative tournament view
  │   ├── hooks/              # Custom React hooks (useNegotiation, useAIMS, useWebSocket)
  │   ├── services/           # Axios / Fetch client for FastAPI backend
  │   ├── styles/             # Global CSS tokens, glassmorphism utilities, scroll animations
  │   ├── App.tsx             # Main dashboard layout with sidebar navigation
  │   └── main.tsx            # React DOM entry point
  └── package.json
```

---

## API Specifications

### 1. `POST /api/negotiation/create`
Initializes a new negotiation session with private policy envelopes.
- **Request Body**:
```json
{
  "title": "Q4 Semiconductor Procurement & SLA",
  "buyer_envelope": {
    "target_price": 420.00,
    "max_ceiling_price": 500.00,
    "required_delivery_days": 14,
    "max_delivery_days": 21,
    "min_sla_uptime_percent": 99.5,
    "min_penalty_per_day_late": 1500.00,
    "target_payment_terms": "Net 60",
    "acceptable_payment_terms": ["Net 30", "Net 45", "Net 60"],
    "min_warranty_months": 24,
    "strategy": "boulware"
  },
  "supplier_envelope": {
    "target_price": 530.00,
    "floor_reservation_price": 440.00,
    "min_production_days": 10,
    "standard_delivery_days": 18,
    "max_sla_uptime_percent": 99.9,
    "max_penalty_per_day_late": 2000.00,
    "target_payment_terms": "Net 30",
    "acceptable_payment_terms": ["Net 30", "Net 45"],
    "min_warranty_months": 12,
    "strategy": "tit_for_tat"
  },
  "max_rounds": 8,
  "safe_ai_enabled": true
}
```

### 2. `POST /api/negotiation/{session_id}/step`
Advances the negotiation by one turn (Buyer offer $\rightarrow$ Legal check $\rightarrow$ Supplier evaluation $\rightarrow$ Counter-offer).

### 3. `POST /api/negotiation/{session_id}/auto-run`
Executes complete multi-round negotiation until agreement, deadlock, or max rounds reached.

### 4. `GET /api/contracts/{session_id}/pdf`
Downloads the legally structured PDF contract with SHA-256 verification hash and terms summary.

### 5. `POST /api/webhooks/telemetry`
Simulates external IoT/weather disruption trigger to autonomously renegotiate terms.

---

## Security & Guardrail Requirements
1. **Private Memory Segregation**: Buyer agent cannot read Supplier agent memory or context window; all exchanges occur strictly through the intermediary state machine.
2. **Safe AI Invariant Enforcement**:
   - If Buyer proposes price $> \text{Buyer Ceiling}$, Arbiter immediately rejects offer.
   - If Supplier proposes price $< \text{Supplier Floor}$, Arbiter rejects offer.
   - If proposed delivery days exceed max allowable, Arbiter triggers auto-amendment.
3. **Data Integrity**: Contract JSON is hashed with SHA-256 and signed with session UUID to prevent tampering.
4. **Resilience & Fallbacks**: Backend operates cleanly in both live Lyzr API mode (with `LYZR_API_KEY`) and smart autonomous simulation mode if running offline.
