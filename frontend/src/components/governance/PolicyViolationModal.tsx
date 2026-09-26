import React from 'react';
import { ShieldAlert, XCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const PolicyViolationModal: React.FC = () => {
  const { blockedProposalModalOpen, setBlockedProposalModalOpen, session } = useNegotiation();

  if (!blockedProposalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0D0F13] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Top glowing bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-3 border-b border-white/8">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-red-400 font-bold tracking-wider uppercase">
              LYZR SAFE AI • GOVERNANCE INTERCEPT
            </div>
            <h3 className="text-lg font-bold text-[#F5F7FA] font-mono">
              POLICY VIOLATION BLOCKED
            </h3>
          </div>
        </div>

        {/* Core Blocked Detail Card */}
        <div className="bg-[#111419] border border-red-500/20 rounded-xl p-4.5 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5F6875]">VIOLATION TRIGGER:</span>
            <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              PRICE &gt; AUTHORIZED CEILING
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 border-y border-white/6 text-xs">
            <div>
              <span className="text-[#5F6875] text-[10px] block">PROPOSED VALUE</span>
              <span className="text-red-400 text-base font-bold">$107,000</span>
              <span className="text-[10px] text-red-400/80 block">+$7,000 Over Budget</span>
            </div>
            <div>
              <span className="text-[#5F6875] text-[10px] block">AUTHORIZED LIMIT</span>
              <span className="text-emerald-400 text-base font-bold">$100,000</span>
              <span className="text-[10px] text-emerald-400/80 block">CFO Hard Ceiling</span>
            </div>
          </div>

          <div className="text-[11px] text-[#9BA3AF] space-y-1">
            <div className="text-[#F5F7FA] font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Governance Enforcement Action:</span>
            </div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              The Safe AI guardrail successfully intercepted the out-of-bounds counter-offer before transmission. Zero budget leakage occurred. The agent was issued an automatic tactical remediation directive.
            </p>
          </div>
        </div>

        {/* Verification Checkpoint */}
        <div className="p-3 rounded-lg bg-[#151920] border border-white/6 flex items-center justify-between text-xs font-mono">
          <span className="text-[#5F6875]">AIMS AUDIT HASH:</span>
          <span className="text-indigo-400 font-semibold truncate max-w-[220px]">
            0x99a182fc091838271a9e8810293847aa
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            onClick={() => setBlockedProposalModalOpen(false)}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <span>DISMISS & RESUME GOVERNED NEGOTIATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
