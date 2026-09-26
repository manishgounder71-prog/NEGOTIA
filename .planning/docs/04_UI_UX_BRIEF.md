# UI/UX Design Brief
# PactMatrix AI — Autonomous B2B Supply Chain & SLA Contract Negotiator

## Aesthetic Direction: Dark Luxury + High-Tech Glassmorphism
The UI aesthetic for PactMatrix AI is designed to evoke the high-stakes, precision engineering atmosphere of institutional trading desks, enterprise supply chain war rooms, and top-tier legal arbitration suites.

- **Primary Vibe**: Dark Luxury (`#0B0F19` deep space slate background) combined with frosted glassmorphism overlays, vivid glowing neon status accents, and smooth data visualizations.
- **Design Tokens**:
  - Background Base: `#0B0F19` (Deep Obsidian / Midnight Slate)
  - Card & Panel Glass: `rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)` and subtle border `rgba(255, 255, 255, 0.08)`
  - Buyer Accent: `#00E599` (Electric Emerald / Neo-Mint) — represents capital efficiency & buyer leverage
  - Supplier Accent: `#3B82F6` (Cobalt Blue / Cyber Sapphire) — represents manufacturing power & supply capability
  - Legal & Safe AI Accent: `#8B5CF6` (Cyber Violet / Sovereign Purple) — represents governance & arbitration
  - Alert / Deadlock Accent: `#F59E0B` (Luminous Amber)
  - Guardrail Breach Accent: `#EF4444` (Crimson Flare)
  - Text Primary: `#F9FAFB` (Pure Titanium White)
  - Text Muted: `#9CA3AF` (Cool Platinum Gray)

---

## Typography & Iconography
- **Display Font**: `Outfit`, `Plus Jakarta Sans`, or `Inter` (Geometric, clean, modern enterprise feel).
- **Monospace Font**: `JetBrains Mono` or `Fira Code` (For numerical envelopes, SHA-256 hashes, AIMS raw event logs, and contract clause values).
- **Google Fonts Import**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
```
- **Icons**: Lucide React icons (`ShieldAlert`, `Scale`, `FileText`, `Activity`, `TrendingDown`, `Cpu`, `Zap`, `CheckCircle2`, `AlertTriangle`, `Download`, `RefreshCw`, `Sliders`).

---

## Layout Hierarchy: Sidebar + Multi-Panel Command Center
- **Left Sidebar**: Fixed 260px sleek dark navigation with glowing active tab indicators and current session status widget.
- **Top Bar**: Real-time breadcrumbs, active negotiation status pills, Safe AI Guardrail live heartbeat, and quick scenario switcher.
- **Main Arena Viewport**:
  1. **Top Metric Strip**: 4 compact KPI glass cards (Rounds Elapsed, Price Gap $\Delta$, Convergence Likelihood %, Active Guardrail Status).
  2. **Split Agent Duel Grid**: Dual symmetric cards (Buyer on Left, Supplier on Right) with glowing pulse avatars, current round proposal chips, and mathematical reasoning bubbles.
  3. **Arbiter Center Hub**: Centered floating pillar showing Safe AI status badges, ZOPA overlap bar, and current deadlock risk meter.
  4. **Interactive Analytics Deck**:
     - Live **Recharts Bid Progression Curve** with historical step dots and shaded ZOPA agreement band.
     - Multi-Dimensional **Clause Delta Radar** (Price, Lead Time, SLA Uptime, Penalty, Warranty).
  5. **Live Action Console**: Floating glass action bar at bottom with buttons for `Step Turn`, `Auto-Negotiate`, `Pause`, `Inject Shock`, and `Export Contract`.

---

## Visual Components & Design Details

### 1. Agent Duel Cards
- **Buyer Card**: Emerald border-glow on active turn (`box-shadow: 0 0 25px rgba(0, 229, 153, 0.15)`), badge `BUYER BOT (Lyzr-Automata)`, private envelope masked pills (`Target: $420 | Max: [PROTECTED]`).
- **Supplier Card**: Cobalt blue border-glow (`box-shadow: 0 0 25px rgba(59, 130, 246, 0.15)`), badge `SUPPLIER BOT (Lyzr-Automata)`, private envelope masked pills (`Target: $530 | Floor: [PROTECTED]`).

### 2. Live Bid & Concession Curve (Recharts)
- X-axis: Negotiation Rounds (1 to 8).
- Y-axis: Offer Price ($ USD).
- Line 1 (Buyer Bid): Emerald stroke (`#00E599`), smooth cubic curve, animated dot on latest offer.
- Line 2 (Supplier Counter): Cobalt stroke (`#3B82F6`), smooth cubic curve.
- Shaded Band: Active ZOPA (Zone of Possible Agreement) between Buyer Ceiling ($500) and Supplier Floor ($440).

### 3. Lyzr Safe AI Guardrail Status Bar
- Dynamic shield badge: `Safe AI Guardrails: ACTIVE (100% Policy Compliant)` in emerald green.
- Interception modal: When an illegal offer is simulated, a translucent crimson backdrop pulses, displaying exact mathematical rule violated and automated correction trace.

### 4. Executable Contract Modal & Signed PDF Preview
- Monospace structured contract layout with formal legal headers (*"MASTER PROCUREMENT & SERVICE LEVEL AGREEMENT"*).
- Side-by-side Clause Diffing (Starting Position vs Final Agreed Terms).
- Floating cryptographic seal with SHA-256 verification hash and 1-click PDF download button.

---

## Motion, Micro-Interactions & Animation Rules
1. **Turn Handoff Animation**: Smooth sliding particle or glowing light beam transitioning between Buyer and Supplier cards when turns exchange.
2. **Card Enter Transitions**: Staggered fade-up animation on arena cards and metric widgets (`opacity: 0, y: 15` $\rightarrow$ `opacity: 1, y: 0` with 0.3s cubic bezier).
3. **Pulsing Agent Status**: Subdued pulsing ring animation around agent avatar when actively computing tactical counter-offers.
4. **Number Counters**: Smooth odometer/counter animation when price values and utility scores update round-by-round.
5. **Accessibility**: Full respect for `@media (prefers-reduced-motion: reduce)` with instant zero-duration transitions when user prefers.
