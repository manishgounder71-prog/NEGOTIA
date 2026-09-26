import React from 'react';
import { UserCheck, CheckCircle2, Sliders, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const HumanApprovalModal: React.FC = () => {
  const { 
    humanApprovalModalOpen, 
    setHumanApprovalModalOpen, 
    resolveHumanApproval,
    session 
  } = useNegotiation();

  if (!humanApprovalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D0F13] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F7FA] font-mono">
                HUMAN REVIEW REQUIRED
              </h3>
              <p className="text-xs text-[#9BA3AF]">
                Disputed commercial compromise requiring executive authorization
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-semibold">
            ESCALATION #04
          </span>
        </div>

        {/* Reason Box */}
        <div className="p-3.5 rounded-lg bg-[#151920] border border-white/6 space-y-1 text-xs">
          <div className="font-semibold text-[#F5F7FA]">Escalation Reason:</div>
          <p className="text-[#9BA3AF] leading-relaxed">
            "Supplier requested Net 45 payment terms (vs target Net 60) and 34-day production window in exchange for accepting the Buyer's target price ceiling of $100,000. Autonomous agents require human sign-off on cash flow terms."
          </p>
        </div>

        {/* Position Comparison Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#111419] border border-emerald-500/20 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">BUYER POSITION</div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>Price:</span>
              <span className="text-[#F5F7FA] font-bold">$100,000 (Target)</span>
            </div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>Delivery:</span>
              <span className="text-[#F5F7FA] font-bold">34 Days</span>
            </div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>Payment:</span>
              <span className="text-amber-400 font-bold">Net 45 (Compromise)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#111419] border border-blue-500/20 space-y-1.5">
            <div className="text-[10px] text-blue-400 font-bold uppercase">SUPPLIER POSITION</div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>Price:</span>
              <span className="text-[#F5F7FA] font-bold">$100,000 (Accepted)</span>
            </div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>Delivery:</span>
              <span className="text-[#F5F7FA] font-bold">34 Days</span>
            </div>
            <div className="flex justify-between text-[#9BA3AF]">
              <span>SLA Uptime:</span>
              <span className="text-[#F5F7FA] font-bold">99.5%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => resolveHumanApproval('APPROVE')}
            className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>APPROVE DEAL</span>
          </button>

          <button
            onClick={() => resolveHumanApproval('MODIFY')}
            className="py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sliders className="w-4 h-4" />
            <span>MODIFY TERMS</span>
          </button>

          <button
            onClick={() => resolveHumanApproval('REJECT')}
            className="py-2.5 px-3 rounded-lg bg-[#151920] hover:bg-red-500/20 border border-white/10 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>REJECT PROPOSAL</span>
          </button>

          <button
            onClick={() => setHumanApprovalModalOpen(false)}
            className="py-2.5 px-3 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#9BA3AF] text-xs font-medium cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
