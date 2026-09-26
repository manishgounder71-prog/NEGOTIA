import React from 'react';
import { 
  Activity, 
  DollarSign, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  ArrowUpRight, 
  Radio, 
  FileText, 
  Cpu, 
  Lock, 
  Terminal, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { LiveNegotiationHero } from './LiveNegotiationHero';
import { useNegotiation } from '../../context/NegotiationContext';
import { MOCK_SUPPLIERS, MOCK_SECURITY_TESTS } from '../../data/mockData';

export const CommandCenter: React.FC = () => {
  const { setActiveTab, setBlockedProposalModalOpen, runSecurityAttackSimulation } = useNegotiation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">
            Procurement Command Center
          </h1>
          <p className="text-xs text-[#9BA3AF] mt-1 max-w-2xl">
            Monitor autonomous negotiations, governance events, contracts, and supplier activity from one control plane.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('PROCUREMENT_WIZARD')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Launch RFQ Wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="ACTIVE NEGOTIATIONS"
          value="07"
          trend="+2 this week"
          trendPositive={true}
          context="Across 4 enterprise categories"
          icon={Radio}
          accentColor="indigo"
        />
        <MetricCard
          label="NEGOTIATED VALUE"
          value="$2.84M"
          trend="+$420K"
          trendPositive={true}
          context="Under governed price envelopes"
          icon={DollarSign}
          accentColor="emerald"
        />
        <MetricCard
          label="DEALS CLOSED"
          value="42"
          trend="91.3% rate"
          trendPositive={true}
          context="Avg 4.2 rounds to convergence"
          icon={CheckCircle2}
          accentColor="blue"
        />
        <MetricCard
          label="POLICY BLOCKS"
          value="23"
          trend="+8 this week"
          trendPositive={true}
          context="Prevented unsafe concessions"
          icon={ShieldAlert}
          accentColor="amber"
        />
        <MetricCard
          label="HUMAN ESCALATIONS"
          value="04"
          trend="-2 vs last month"
          trendPositive={true}
          context="Resolved via 1-click approvals"
          icon={UserCheck}
          accentColor="emerald"
        />
      </div>

      {/* Main Live Hero Card */}
      <LiveNegotiationHero />

      {/* Dual Section Grid: Governance Safety Stream & Supplier Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Governance & Safety Stream */}
        <div className="lg:col-span-7 bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-[#F5F7FA]">
                Governance & Policy Intercept Stream
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('SAFETY_EVENTS')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View All 23 Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Incident 1 */}
            <div className="p-3 rounded-lg bg-[#151920] border border-amber-500/20 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                    PRICE EXCEED BLOCKED
                  </span>
                  <span className="text-[11px] font-mono text-[#5F6875]">21:40:37</span>
                </div>
                <div className="text-xs text-[#F5F7FA] font-medium">
                  Apex Agent counter-offer of $107,000 intercepted
                </div>
                <div className="text-[11px] text-[#9BA3AF]">
                  Violated Buyer CFO envelope ceiling ($100,000). System forced automated tactical revision.
                </div>
              </div>
              <button
                onClick={() => setBlockedProposalModalOpen(true)}
                className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-500/30 whitespace-nowrap cursor-pointer"
              >
                Inspect Intercept
              </button>
            </div>

            {/* Incident 2 */}
            <div className="p-3 rounded-lg bg-[#151920] border border-emerald-500/20 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                    PROMPT INJECTION CONTAINED
                  </span>
                  <span className="text-[11px] font-mono text-[#5F6875]">20:15:02</span>
                </div>
                <div className="text-xs text-[#F5F7FA] font-medium">
                  Adversarial BATNA extraction probe blocked
                </div>
                <div className="text-[11px] text-[#9BA3AF]">
                  Untrusted prompt attempted to read Buyer reservation envelope. Zero information leakage.
                </div>
              </div>
              <button
                onClick={runSecurityAttackSimulation}
                className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/30 whitespace-nowrap cursor-pointer"
              >
                Security Lab
              </button>
            </div>

            {/* Incident 3 */}
            <div className="p-3 rounded-lg bg-[#151920] border border-white/6 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-semibold">
                    SLA PENALTY ENFORCED
                  </span>
                  <span className="text-[11px] font-mono text-[#5F6875]">19:54:18</span>
                </div>
                <div className="text-xs text-[#F5F7FA] font-medium">
                  Clause modified from 2.0% to 5.0% liquidated damages
                </div>
                <div className="text-[11px] text-[#9BA3AF]">
                  Legal Arbiter rejected below-threshold indemnity cap before reaching contract compilation.
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 py-1">RESOLVED</span>
            </div>
          </div>
        </div>

        {/* Right: Supplier Intelligence Quick Rank */}
        <div className="lg:col-span-5 bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-[#F5F7FA]">
                Top Autonomous Suppliers
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('SUPPLIERS')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_SUPPLIERS.slice(0, 3).map((supp) => (
              <div key={supp.id} className="p-3 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#1C222B] border border-white/8 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                    {supp.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F5F7FA]">{supp.name}</div>
                    <div className="text-[11px] text-[#5F6875]">{supp.category}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-emerald-400">{supp.complianceScore}% Compliance</div>
                  <div className="text-[10px] text-[#9BA3AF]">{supp.avgConcessionPercent}% avg concession</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stretch Teaser */}
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('MULTI_VENDOR_RFQ')}
              className="w-full py-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Launch 1-vs-3 Multi-Vendor RFQ Tournament</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
