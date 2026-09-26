# App Flow Document
# PactMatrix AI — Autonomous B2B Supply Chain & SLA Contract Negotiator

## Overview & User Journey
PactMatrix AI provides an intuitive, high-stakes command center for setting up, executing, observing, and auditing autonomous multi-agent B2B contract negotiations.

---

## Screen & Page Structure

```
PactMatrix AI Dashboard
├── 1. Navigation & Header
│    ├── Top Bar: Active Session Selector, Status Badges, Lyzr Safe AI Guardrail Indicator
│    └── Left Sidebar:
│         ├── [Arena] Live Dual-Agent & Multi-Vendor Simulation
│         ├── [Policy Envelopes] CFO & Legal Guardrail Builder
│         ├── [Contract Vault] Digital JSON / Signed PDF Contracts
│         ├── [AIMS Ledger] Lyzr Audit Trail & Decision Logs
│         ├── [Multi-Vendor RFQ] 1-vs-3 Supplier Tournament
│         └── [Telemetry Lab] Live Supply Shock & Weather Webhook Simulator
│
├── 2. Policy Setup Screen (/envelopes)
│    ├── Step 1: Procurement Item & RFQ Scope Definition
│    ├── Step 2: Buyer Private Policy Envelope (Target, BATNA, Ceiling, SLA min)
│    ├── Step 3: Supplier Private Policy Envelope (Cost Floor, Lead time, Margin target)
│    ├── Step 4: Legal & Safe AI Governance Configuration (Penalty caps, Governing Law)
│    └── Action: [Launch Negotiation Session]
│
├── 3. Live Negotiation Arena Screen (/arena)
│    ├── Top Banner: Round Progress Tracker (e.g., Round 3 of 8) & Convergence Probability
│    ├── Center Split:
│    │    ├── Left: Buyer Agent Card (PactBuyer status, latest proposal, tactical rationale)
│    │    ├── Middle: Arbiter & Safe AI Guardrail Status (Verification Pass/Fail & Rule Checks)
│    │    └── Right: Supplier Agent Card (PactSupplier status, counter-offer, concession note)
│    ├── Interactive Controls: [Step 1 Round] [Auto-Play Negotiation] [Pause] [Inject Concession] [Declare Deadlock]
│    ├── Live Analytics Panels:
│    │    ├── Bid Convergence Curve (Recharts: Buyer Bid vs Supplier Counter over rounds)
│    │    ├── Multi-Issue Radar Chart (Price, Delivery Days, SLA Uptime, Penalty, Payment Terms)
│    │    └── Concession Velocity & Delta Tracker
│    └── Live Message Feed & Dialogue Stream (Markdown formatted agent thoughts + proposals)
│
├── 4. Contract Consensus & Vault Screen (/contracts)
│    ├── Agreement Banner: "Consensus Reached in Round 4" (or "Deadlock Reached")
│    ├── Contract Metadata: Unique UUID, SHA-256 Stamp, Timestamp, Governing Law
│    ├── Clauses Breakdown (Interactive accordion with agreed vs original starting values)
│    ├── Actions:
│    │    ├── [Download Legally Binding PDF]
│    │    ├── [Export Structured JSON Schema]
│    │    └── [Inspect SHA-256 Cryptographic Hash]
│    └── Digital Signature Badges (PactBuyer Ed25519 Stamp & PactSupplier Stamp)
│
├── 5. Lyzr AIMS Audit & Decision Trace Screen (/aims)
│    ├── Timeline Filter (Filter by Round, Guardrail Triggers, Agent Thought, Rule Violations)
│    ├── Raw JSON-LD Event Explorer with copy & download
│    └── Rule Interception Log: Shows where Safe AI prevented unauthorized concessions
│
├── 6. Multi-Vendor RFQ Tournament Screen (/rfq)
│    ├── 1-Buyer vs 3-Suppliers Grid (e.g., ApexSupplies, SwiftCargo, EcoLogistics)
│    ├── Live simultaneous 3-way negotiation streams
│    └── Pareto Efficiency Leaderboard: Automatically ranks vendors on Weighted Utility Score
│
└── 7. Telemetry & Webhook Simulator Screen (/telemetry)
     ├── Supply Shock Trigger (e.g., Category 4 Hurricane in Taiwan $\rightarrow$ 7-day delay)
     ├── Live Webhook Dispatcher (`POST /api/webhooks/telemetry`)
     └── Dynamic Autonomous Renegotiation Stream (Adjusts delivery dates and SLA penalty relief)
```

---

## Detailed User Interaction Flows

### Flow 1: Launching a Dual-Agent Negotiation
1. User navigates to **Policy Envelopes** or chooses a Pre-configured Template (e.g., *"Automotive Microcontroller Spot PO"*, *"Cold-Chain Pharma Logistics SLA"*).
2. Adjusts target price ($420), buyer ceiling ($500), supplier floor ($440), delivery windows (14-21 days), and penalty terms.
3. Clicks **"Initialize Negotiation in Arena"**.
4. System allocates session UUID, validates that a mathematical ZOPA (Zone of Possible Agreement) can exist, and redirects to the **Arena**.
5. User clicks **"Auto-Play"** or **"Step Round"**.
6. Each round triggers:
   - Buyer generates proposal with reasoning $\rightarrow$
   - Safe AI validates proposal against Buyer Envelope $\rightarrow$
   - Supplier evaluates utility score and generates counter-proposal $\rightarrow$
   - Safe AI validates proposal against Supplier Envelope $\rightarrow$
   - Arbiter checks for convergence criteria ($\Delta \text{Price} \le \$5$ & all clauses matched).
7. If consensus is reached $\rightarrow$ triggers **Contract Consensus Screen** with instant PDF generation.

### Flow 2: Live Guardrail Violation & Safe AI Recovery
1. In manual override or extreme scenario, an agent attempts to offer a price beyond its hard limit.
2. The **Lyzr Safe AI Legal Arbiter** flags the violation with a glowing red indicator:
   - *"Safe AI Intercept: Proposed price $510 exceeds Buyer Ceiling $500. Offer rejected."*
3. The arbiter forces the agent to regenerate an amended proposal within bounded limits.
4. The event is recorded in the **AIMS Ledger** with violation severity `HIGH` and auto-remediation trace.

### Flow 3: Supply Chain Telemetry Webhook & Mid-Contract Renegotiation
1. User clicks into the **Telemetry Lab**.
2. Selects an active ratified contract.
3. Injects a disruption payload (e.g., *"Port of Long Beach Congestion: +5 Days Lead Time"*).
4. Webhook fires $\rightarrow$ The orchestrator awakens both Buyer and Supplier agents.
5. Agents execute a focused 2-round addendum negotiation (e.g., Supplier grants 3% price rebate in exchange for 5-day delivery extension without SLA penalty).
6. Compiles **"Contract Addendum #1 (Force Majeure Adjustment)"** with updated PDF and audit log.

---

## State Transitions & Error States

| State | Trigger | Next State | Error / Recovery Action |
|---|---|---|---|
| **INITIALIZING** | Envelope submitted | **READY_TO_NEGOTIATE** | Validate bounds ($P_{floor} < P_{ceiling}$). Show warning if ZOPA is empty. |
| **NEGOTIATING** | Round step initiated | **EVALUATING_OFFER** | Retry if LLM response is malformed; fallback to bounded deterministic strategy. |
| **GUARDRAIL_VIOLATION** | Envelope constraint breached | **AUTO_CORRECTING** | Safe AI rejects proposal; forces tactical revision within bounds. |
| **CONSENSUS_REACHED** | Proposals align within $\epsilon$ | **CONTRACT_GENERATION** | Generate JSON schema & compile downloadable PDF. |
| **DEADLOCK_DETECTED** | No concession for 3 rounds | **ARBITRATION_PROPOSAL** | Arbiter injects creative non-price trade-off (e.g., payment terms or warranty). |
| **TERMINATED_UNRESOLVED** | Max rounds (8) exceeded | **DEADLOCK_SUMMARY** | Emit full AIMS post-mortem explaining reservation gap. |
| **TELEMETRY_DISRUPTION** | Webhook payload received | **RENEGOTIATING_ADDENDUM** | Spawn bounded addendum session on affected clauses only. |

---

## Empty, Loading & Success States
- **Empty State (No Active Session)**: Hero card with "Select a Procurement Scenario" and 1-click Quick Launch templates.
- **Loading State (Agent Reasoning)**: Pulse glowing avatar with real-time reasoning stream ("*PactBuyer is analyzing Supplier's Counter-Offer on Net 45 terms...*").
- **Success State (Contract Signed)**: Emerald celebration banner with holographic digital seal, signature stamps, and one-click PDF download.
