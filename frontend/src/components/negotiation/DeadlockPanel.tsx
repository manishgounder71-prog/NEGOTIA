import React from 'react';
import { AlertOctagon, UserCheck, RefreshCw, XCircle, ArrowRight } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

interface DeadlockPanelProps {
  onClose?: () => void;
}

export const DeadlockPanel: React.FC<DeadlockPanelProps> = ({ onClose }) => {
  const { triggerHumanEscalation, resetNegotiation, setActiveTab, deadlockModalOpen, setDeadlockModalOpen } = useNegotiation();

  if (!deadlockModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0D0F13] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-white/8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA] font-mono">
              NEGOTIATION DEADLOCK DETECTED
            </h3>
            <p className="text-xs text-[#9BA3AF]">
              Reservation envelopes disjoint (Empty ZOPA). Automated rounds halted.
            </p>
          </div>
        </div>

        {/* Breakdown of Boundaries */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div className="p-3 rounded-lg bg-[#111419] border border-white/6">
            <div className="text-[10px] text-[#5F6875] uppercase">BUYER CEILING</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">$100,000</div>
          </div>

          <div className="p-3 rounded-lg bg-[#111419] border border-white/6">
            <div className="text-[10px] text-[#5F6875] uppercase">RESERVATION GAP</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">+$10,000</div>
          </div>

          <div className="p-3 rounded-lg bg-[#111419] border border-white/6">
            <div className="text-[10px] text-[#5F6875] uppercase">SUPPLIER FLOOR</div>
            <div className="text-sm font-bold text-blue-400 mt-0.5">$110,000</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#151920] border border-white/6 text-xs text-[#9BA3AF] space-y-1">
          <div className="font-semibold text-[#F5F7FA] flex items-center gap-1.5">
            <span>System Recommendation:</span>
          </div>
          <p>
            Engage human procurement manager to review spot market variance or adjust delivery timeline to unlock volume discounts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              setDeadlockModalOpen(false);
              triggerHumanEscalation();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>REQUEST HUMAN INTERVENTION</span>
          </button>

          <button
            onClick={() => {
              setDeadlockModalOpen(false);
              setActiveTab('POLICY_CENTER');
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-[#F5F7FA] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REOPEN WITH NEW POLICY</span>
          </button>

          <button
            onClick={() => {
              setDeadlockModalOpen(false);
              resetNegotiation();
            }}
            className="w-full sm:w-auto py-2.5 px-3 rounded-lg text-xs font-medium text-[#5F6875] hover:text-[#9BA3AF] cursor-pointer"
          >
            END SESSION
          </button>
        </div>
      </div>
    </div>
  );
};
