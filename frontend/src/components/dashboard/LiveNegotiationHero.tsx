import React from 'react';
import { 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  Lock, 
  Layers, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const LiveNegotiationHero: React.FC = () => {
  const { session, setActiveTab, setBlockedProposalModalOpen } = useNegotiation();

  return (
    <div className="bg-[#0D0F13] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 opacity-80"></div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-subtle-pulse"></span>
            <span>ROUND {session.currentRound} / {session.maxRounds}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F5F7FA] tracking-tight">
              {session.title}
            </h2>
            <p className="text-xs text-[#5F6875] font-mono">
              ID: {session.id} • Category: {session.category}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ARENA')}
            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>OPEN NEGOTIATION ARENA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_LEDGER')}
            className="px-3.5 py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>VIEW AUDIT</span>
          </button>
        </div>
      </div>

      {/* Center Duel Visualization & Connection */}
      <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Buyer Agent Identity */}
        <div className="lg:col-span-3 bg-[#111419] border border-white/8 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              BUYER AGENT
            </span>
            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
              LYZR AUTOMATA
            </span>
          </div>
          <div className="text-sm font-bold text-[#F5F7FA]">
            {session.buyerName}
          </div>
          <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-[#9BA3AF]">
            <span className="flex items-center gap-1 text-[#5F6875]">
              <Lock className="w-3 h-3 text-emerald-400/70" />
              Policy Vault:
            </span>
            <span className="text-emerald-400">ENCLOSED & SECURE</span>
          </div>
        </div>

        {/* Animated Negotiation Connection & Convergence Ring */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center py-2 px-4 space-y-4">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#5F6875]">
            <span className="text-emerald-400 font-semibold">BUYER BID: $100,000</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-semibold">
              DELTA: $0 (CONVERGED)
            </span>
            <span className="text-blue-400 font-semibold">SUPPLIER OFFER: $100,000</span>
          </div>

          {/* Interactive Convergence Track */}
          <div className="w-full relative flex items-center">
            <div className="w-full h-2 bg-[#151920] rounded-full overflow-hidden border border-white/6">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${session.convergence}%` }}
              ></div>
            </div>
            {/* Center Gate Marker */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#0D0F13] border border-indigo-500/60 flex items-center justify-center text-indigo-400 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#5F6875]">CONVERGENCE:</span>
            <span className="text-emerald-400 font-bold text-sm">{session.convergence}%</span>
            <span className="text-white/20">|</span>
            <span className="text-[#5F6875]">DEADLOCK RISK:</span>
            <span className="text-emerald-400 font-medium">LOW</span>
            <span className="text-white/20">|</span>
            <span className="text-[#5F6875]">GOVERNANCE:</span>
            <span className="text-emerald-400 font-medium">100% COMPLIANT</span>
          </div>
        </div>

        {/* Supplier Agent Identity */}
        <div className="lg:col-span-3 bg-[#111419] border border-white/8 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              SUPPLIER AGENT
            </span>
            <span className="text-[9px] font-mono bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">
              LYZR AUTOMATA
            </span>
          </div>
          <div className="text-sm font-bold text-[#F5F7FA]">
            {session.supplierName}
          </div>
          <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-[#9BA3AF]">
            <span className="flex items-center gap-1 text-[#5F6875]">
              <Lock className="w-3 h-3 text-blue-400/70" />
              Reservation Floor:
            </span>
            <span className="text-blue-400">ENCLOSED & SECURE</span>
          </div>
        </div>
      </div>

      {/* Commercial Terms Strip */}
      <div className="pt-5 border-t border-white/8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#111419] border border-white/6 rounded-lg p-3">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">CURRENT PRICE</div>
          <div className="text-base font-bold font-mono text-[#F5F7FA] mt-0.5">$100,000</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Exact Target Match</div>
        </div>

        <div className="bg-[#111419] border border-white/6 rounded-lg p-3">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">DELIVERY</div>
          <div className="text-base font-bold font-mono text-[#F5F7FA] mt-0.5">34 DAYS</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Within 35d ceiling</div>
        </div>

        <div className="bg-[#111419] border border-white/6 rounded-lg p-3">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">SLA UPTIME</div>
          <div className="text-base font-bold font-mono text-[#F5F7FA] mt-0.5">99.5%</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Meets minimum</div>
        </div>

        <div className="bg-[#111419] border border-white/6 rounded-lg p-3">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">PAYMENT TERMS</div>
          <div className="text-base font-bold font-mono text-[#F5F7FA] mt-0.5">NET 45</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Approved policy tier</div>
        </div>

        <div className="bg-[#111419] border border-white/6 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono text-[#5F6875] uppercase">DELAY PENALTY</div>
          <div className="text-base font-bold font-mono text-[#F5F7FA] mt-0.5">5.0% / WEEK</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Liquidated damages</div>
        </div>
      </div>
    </div>
  );
};
