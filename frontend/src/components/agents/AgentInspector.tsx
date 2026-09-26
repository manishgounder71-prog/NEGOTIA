import React, { useState } from 'react';
import { Cpu, Lock, ShieldCheck, Terminal, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const AgentInspector: React.FC = () => {
  const { session } = useNegotiation();
  const [activeTab, setActiveTab] = useState<'BUYER' | 'SUPPLIER' | 'ARBITER'>('BUYER');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              LYZR AGENT RUNTIME &amp; MEMORY
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Lyzr Autonomous Agent Inspector
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Inspect runtime configurations, tool integrations, Safe AI guardrail bindings, and auditable reasoning metadata.
          </p>
        </div>

        {/* Agent Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#111419] border border-white/8 font-mono text-xs">
          {(['BUYER', 'SUPPLIER', 'ARBITER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#9BA3AF] hover:text-white'
              }`}
            >
              {tab === 'BUYER' ? 'Buyer Agent' : tab === 'SUPPLIER' ? 'Supplier Agent' : 'Legal Arbiter'}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Detail Card */}
      <div className="p-6 rounded-2xl bg-[#111419] border border-white/8 space-y-5 font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/6">
          <div>
            <span className="text-[10px] text-[#5F6875] uppercase">AGENT IDENTIFIER</span>
            <div className="text-sm font-bold text-[#F5F7FA]">
              {activeTab === 'BUYER' ? 'lyzr-buyer-v2.8-prod (NovaTech Buyer)' :
               activeTab === 'SUPPLIER' ? 'lyzr-supplier-v2.8-prod (Apex Supplier)' :
               'lyzr-legal-arbiter-guardrail-v1.0'}
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            ● RUNTIME ACTIVE &amp; ISOLATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#151920] border border-white/4 space-y-2">
            <span className="text-[10px] text-[#5F6875] block uppercase">MODEL ORCHESTRATION</span>
            <div className="text-xs text-[#F5F7FA] font-bold">Lyzr Automata with GPT-4o / Claude 3.5 Fallback</div>
            <p className="text-[11px] text-[#9BA3AF] leading-relaxed">
              Deterministic temperature (0.1), bounded context window, strict JSON-schema emission for proposals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#151920] border border-white/4 space-y-2">
            <span className="text-[10px] text-[#5F6875] block uppercase">BOUNDED TOOLS &amp; INTEGRATIONS</span>
            <div className="space-y-1 text-xs text-indigo-300">
              <div className="flex items-center gap-1.5">✓ Policy Envelope Validator</div>
              <div className="flex items-center gap-1.5">✓ Game-Theoretic Concession Engine (Boulware)</div>
              <div className="flex items-center gap-1.5">✓ Lyzr Safe AI Guardrail Interceptor</div>
            </div>
          </div>
        </div>

        {/* Auditable Decision Summaries */}
        <div className="space-y-2">
          <span className="text-[10px] text-[#5F6875] block uppercase">RECENT AUDITABLE DECISION LOGS</span>
          <div className="p-3.5 rounded-xl bg-[#08090B] border border-white/6 space-y-2 text-[#9BA3AF]">
            <div className="flex justify-between border-b border-white/4 pb-1">
              <span className="text-[#F5F7FA]">Turn 04 Decision:</span>
              <span className="text-emerald-400">Target Convergence Met</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              "Conceded on payment terms from Net 60 to Net 45 after calculating that accelerated 34-day delivery timeline yielded a higher aggregate utility score (+4.8 pts) than holding cash reserves."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
