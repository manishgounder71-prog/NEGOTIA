import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import { Proposal, PrivateBuyerEnvelope, PrivateSupplierEnvelope } from '../../types/negotiation';

interface AgentCardProps {
  role: 'BUYER' | 'SUPPLIER';
  agentName: string;
  agentModel: string;
  proposal: Proposal;
  envelope: PrivateBuyerEnvelope | PrivateSupplierEnvelope;
  isTurnActive: boolean;
  onInspectPolicy: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  role,
  agentName,
  agentModel,
  proposal,
  envelope,
  isTurnActive,
  onInspectPolicy
}) => {
  const isBuyer = role === 'BUYER';
  const accentColor = isBuyer ? 'emerald' : 'blue';
  
  return (
    <div className={`bg-[#111419] border rounded-xl p-5 space-y-4 transition-all duration-300 relative ${
      isTurnActive 
        ? isBuyer 
          ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
          : 'border-blue-500/50 shadow-lg shadow-blue-500/10'
        : 'border-white/8 hover:border-white/16'
    }`}>
      {/* Top Tag & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isBuyer 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isBuyer ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {isBuyer ? 'BUYER AGENT' : 'SUPPLIER AGENT'}
            </div>
            <div className="text-sm font-bold text-[#F5F7FA]">
              {agentName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#151920] border border-white/8 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse"></span>
            ACTIVE
          </span>
        </div>
      </div>

      {/* Current Round Proposal Grid */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#5F6875] mb-2 font-semibold flex items-center justify-between">
          <span>CURRENT PROPOSAL (ROUND {proposal.round})</span>
          {proposal.isAcceptance && (
            <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              ACCEPTED
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6">
            <div className="text-[10px] font-mono text-[#5F6875]">PRICE</div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              ${proposal.price.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6">
            <div className="text-[10px] font-mono text-[#5F6875]">DELIVERY</div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              {proposal.deliveryDays} Days
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6">
            <div className="text-[10px] font-mono text-[#5F6875]">SLA UPTIME</div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              {proposal.sla}%
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#151920] border border-white/6">
            <div className="text-[10px] font-mono text-[#5F6875]">PAYMENT TERMS</div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              {proposal.paymentTerms}
            </div>
          </div>
        </div>

        <div className="mt-2 p-2 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between text-xs font-mono">
          <span className="text-[#5F6875]">DELAY PENALTY:</span>
          <span className="text-[#F5F7FA] font-bold">{proposal.penaltyPercent}% / week</span>
        </div>

        {proposal.rationale && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-[#08090B]/60 border border-white/4 text-xs text-[#9BA3AF] italic">
            "{proposal.rationale}"
          </div>
        )}
      </div>

      {/* Private Policy Vault (Enclosed & Masked) */}
      <div className="p-3.5 rounded-lg bg-[#0D0F13] border border-white/8 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#9BA3AF]">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>PRIVATE POLICY VAULT</span>
          </div>
          <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
            🔒 PROTECTED
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono text-[#5F6875]">
          <div className="flex justify-between items-center py-0.5 border-b border-white/4">
            <span>{isBuyer ? 'Budget Ceiling:' : 'Reservation Floor:'}</span>
            <span className="text-[#9BA3AF] font-bold bg-[#151920] px-2 py-0.5 rounded border border-white/6">
              •••••••• (Encrypted)
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-white/4">
            <span>{isBuyer ? 'Walk-away BATNA:' : 'Margin Floor:'}</span>
            <span className="text-[#9BA3AF] font-bold bg-[#151920] px-2 py-0.5 rounded border border-white/6">
              •••••••• (Protected)
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span>Information Leakage:</span>
            <span className="text-emerald-400 font-bold">0.0% (Zero Disclosure)</span>
          </div>
        </div>

        <button
          onClick={onInspectPolicy}
          className="w-full mt-2 py-1.5 px-3 rounded bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>INSPECT AUTHORIZED POLICY</span>
        </button>
      </div>
    </div>
  );
};
