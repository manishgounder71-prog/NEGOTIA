import React from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertCircle, Lock } from 'lucide-react';
import { NegotiationSession } from '../../types/negotiation';

interface NegotiationHealthProps {
  session: NegotiationSession;
}

export const NegotiationHealth: React.FC<NegotiationHealthProps> = ({ session }) => {
  return (
    <div className="bg-[#111419] border border-white/8 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-[#F5F7FA] tracking-tight">
            Negotiation Health & Policy Index
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">
          {session.convergence}% OPTIMAL
        </span>
      </div>

      {/* Progress meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-[#5F6875]">
          <span>COMPLIANCE & STABILITY SCORE</span>
          <span className="text-emerald-400 font-bold">96 / 100</span>
        </div>
        <div className="w-full h-2.5 bg-[#151920] rounded-full overflow-hidden border border-white/6">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
            style={{ width: '96%' }}
          ></div>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center py-1 border-b border-white/4">
          <span className="text-[#5F6875] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Policy Compliance:
          </span>
          <span className="text-emerald-400 font-bold">100%</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/4">
          <span className="text-[#5F6875] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Position Convergence:
          </span>
          <span className="text-indigo-400 font-bold">94%</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/4">
          <span className="text-[#5F6875] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
            Deadlock Risk:
          </span>
          <span className="text-emerald-400 font-bold">Low (0.04)</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/4">
          <span className="text-[#5F6875] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Information Leakage:
          </span>
          <span className="text-emerald-400 font-bold">0 Disclosures</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-[#5F6875]">Rounds Remaining:</span>
          <span className="text-[#F5F7FA] font-bold">2 (Converged early)</span>
        </div>
      </div>
    </div>
  );
};
