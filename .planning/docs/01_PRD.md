# Product Requirements Document (PRD)
# PactMatrix AI — Autonomous B2B Supply Chain & SLA Contract Negotiator

## App Overview
- **App Name**: PactMatrix AI (Autonomous B2B Supply Chain & SLA Contract Negotiator)
- **One-line idea**: An autonomous multi-agent procurement platform powered by Lyzr Agent API and Lyzr Automata where bounded Buyer and Supplier agents negotiate price, delivery, and SLA clauses under hard CFO/Legal guardrails to emit legally enforceable contracts and AIMS audit trails.
- **Version**: v1.0 Enterprise MVP + Stretch Capabilities
- **Repository Category**: HiDevs AI Quest — PS 02 (Advanced Enterprise B2B / Procurement / Supply Chain Management)

---

## Target Users
- **Primary Users**: Enterprise Procurement Officers, Category Managers, Vendor Relationship Managers.
- **Secondary Users**: Enterprise Suppliers, Sales Directors, 3PL Logistics Providers.
- **Auditors & Approvers**: CFOs, Corporate Legal Counsel, Compliance & Risk Officers.
- **Evaluators / Judges**: Hackathon evaluators, Dr. Agent automated benchmark runners.

---

## Problem Statement
Procurement and vendor management teams spend thousands of high-friction hours annually negotiating spot Purchase Orders (POs), delivery schedules, payment terms, and SLA penalty clauses. In volatile supply chain markets:
1. **Single LLM Prompts Fail**: Unbounded AI agents suffer from hallucination, leak reservation prices, or make irrational concessions without game-theoretic discipline.
2. **Missing Hard Guardrails**: Human CFOs and Legal teams cannot trust AI that doesn't respect mathematical ceilings (budget thresholds, penalty caps, liability limits).
3. **Lack of Verifiable Execution**: Existing chatbots generate conversational text rather than legally binding, cryptographically verifiable, structured contracts with complete auditability.

PactMatrix AI solves this by introducing dual isolated Lyzr agents operating within mathematical policy envelopes, monitored in real-time by a Lyzr Safe AI Legal Arbiter, converging toward optimal Pareto agreements with instant contract compilation and AIMS audit logging.

---

## Core Features

### 1. Private Policy Envelope Engine (CFO & Legal Guardrails)
- **Buyer Policy Envelope**: Target price, BATNA (Best Alternative to a Negotiated Agreement), hard walk-away ceiling, latest acceptable delivery date, minimum warranty period, payment terms (e.g., Net 30/60), and minimum SLA uptime/penalty tiers.
- **Supplier Policy Envelope**: Cost floor (reservation price), target margin, production lead-time, expedited freight capabilities, maximum penalty liability cap, and preferred cash flow terms.
- **Information Isolation**: Neither agent can inspect the opponent's private envelope; all strategic concessions are driven purely through bounded multi-round game mechanics.

### 2. Autonomous Multi-Agent Negotiation Orchestrator (Lyzr Automata & Lyzr Agent API)
- **Buyer Agent (`PactBuyer`)**: Employs strategic bargaining (Boulware time-dependent or Tit-for-Tat concession strategies) to maximize cost efficiency and SLA reliability.
- **Supplier Agent (`PactSupplier`)**: Balances volume discounts, delivery speed, and SLA risk while defending margins.
- **State Machine & Round Progression**: Structured turn-taking protocol (Offer $\rightarrow$ Evaluation $\rightarrow$ Counter-Offer / Acceptance / Rejection / Deadlock).
- **Deadlock Detection & Concession Optimizer**: Detects negotiation stalemates and proposes creative non-zero-sum trade-offs (e.g., faster payment terms in exchange for lower unit price or higher SLA penalty caps).

### 3. Lyzr Safe AI & Legal Arbiter Guardrail
- Real-time pre-flight and post-turn validation on every proposal.
- Validates mathematical bounds (e.g., price $\le$ buyer ceiling, delivery $\le$ max lead time).
- Validates legal risk (e.g., liability indemnification, force majeure compliance, governing law).
- Automatic veto of invalid counter-offers with specific remediation prompts.

### 4. Executable Contract Generator (JSON & PDF)
- Compiles mutually ratified clauses into a structured, schema-validated Digital Contract JSON.
- Generates a styled, print-ready, legally structured PDF contract with unique Contract UUID, SHA-256 hash stamp, party signatures, and schedule annexures.

### 5. Lyzr AIMS Audit & Decision Trace
- Complete immutable audit logging of every offer, rationale, rejected proposal, and guardrail check.
- Traceability index for compliance teams and audit export (JSON / CSV / Timeline).

### 6. Stretch Features
- **Multi-Vendor RFQ Matrix**: 1 Buyer Agent negotiates simultaneously against 3 distinct Vendor Agents (e.g., EcoLogistics, SwiftCargo, ApexSupplies) to select the Pareto-optimal deal.
- **External Telemetry / Weather Disruption Webhook**: Simulates mid-contract supply shock (e.g., severe storm delaying shipment) that triggers autonomous clause renegotiation.
- **Live Interactive Arena UI**: Real-time visualization of bid curves, concession trends, utility score frontiers, and round-by-round chat feeds.

---

## User Roles & Permissions

| Role | Description | Permissions |
|---|---|---|
| **Procurement Buyer** | Enterprise buyer setting up RFQs | Create policy envelopes, trigger negotiations, review proposals, approve final contracts |
| **Supplier / Vendor** | Vendor representative configuring sales envelopes | Set baseline costs, margin limits, lead times, accept/counter RFQs |
| **Legal / Compliance** | Legal counsel & Risk officers | Set corporate legal guardrails, inspect AIMS audit traces, review contract terms |
| **Arena Spectator / Judge** | Hackathon evaluators & Dr. Agent | Run automated test suites, replay multi-vendor scenarios, simulate telemetry shocks |

---

## User Stories
- **US-1 (Buyer)**: *As a Procurement Manager*, I want to define hard price and SLA boundaries so that my AI agent negotiates on my behalf without exceeding our quarterly budget.
- **US-2 (Supplier)**: *As a Sales Operations Lead*, I want my vendor agent to protect our gross margin and lead times while remaining competitive against rivals.
- **US-3 (Legal / CFO)**: *As Corporate Counsel*, I want Safe AI guardrails to intercept any clause violating corporate liability thresholds before it is presented to the counterparty.
- **US-4 (All Parties)**: *As a Contract Stakeholder*, I want instant compilation of agreed terms into a signed PDF and verified JSON contract with complete AIMS audit history.
- **US-5 (Supply Chain Ops)**: *As a Logistics Specialist*, I want automated webhook renegotiation triggered by weather/port delays so that SLA penalties are equitably re-settled in real time.

---

## MVP vs Stretch Scope

### Included in MVP (v1.0)
- ✅ Dual-agent negotiation (Buyer vs Supplier) using Lyzr Agent architecture.
- ✅ Private Policy Envelopes with hard BATNA / walk-away parameters.
- ✅ Lyzr Safe AI Hard Guardrails validating numerical thresholds and clause legality.
- ✅ Multi-round convergence engine with concession curves & deadlock handling (max 10 rounds).
- ✅ Structured Contract Generator (JSON & styled PDF output).
- ✅ Lyzr AIMS-compliant audit log capturing all turn traces and telemetry.
- ✅ Full web application UI with interactive arena and visual bid curves.

### Stretch Scope (v1.1+)
- 🌟 Multi-Vendor RFQ Arena (1 Buyer vs 3 Suppliers with Pareto frontier ranking).
- 🌟 External Telemetry Webhook Simulator (IoT / Weather / Port strike shock event renegotiation).
- 🌟 Custom Clause Editor for dynamic legal terms inject.

---

## Success Metrics
1. **Zero Policy Leakage**: 0% rate of agents revealing private reservation prices or exceeding hard envelopes.
2. **Convergence Rate**: $\ge 85\%$ successful contract convergence when feasible bargaining zones (ZOPA) exist.
3. **Audit Completeness**: 100% of negotiation turns and rule checks recorded in AIMS logs.
4. **Execution Latency**: Complete 5-round negotiation + contract generation in $< 30$ seconds.
5. **Contract Validity**: 100% adherence to standard legal contract schema with zero broken parameters.
