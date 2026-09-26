import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';
import { PolicyResult } from '../../types/negotiation';

interface GovernanceGateProps {
  policyResult: PolicyResult;
  onSimulateViolation: () => void;
}

export const GovernanceGate: React.FC<GovernanceGateProps> = ({
  policyResult,
  onSimulateViolation
}) => {
  const isAuthorized = policyResult.status === 'AUTHORIZED';

  const checkItems = [
    { label: 'PRICE ENVELOPE', status: '✓ WITHIN POLICY', ok: true },
    { label: 'DELIVERY WINDOW', status: '✓ WITHIN POLICY', ok: true },
    { label: 'SLA UPTIME', status: '✓ WITHIN POLICY', ok: true },
    { label: 'PAYMENT TERMS', status: '✓ WITHIN POLICY', ok: true },
    { label: 'DELAY PENALTY', status: '✓ WITHIN POLICY', ok: true },
    { label: 'PRIVATE DATA VAULT', status: '✓ PROTECTED', ok: true },
  ];

  return (
    <div className="bg-[#111419] border border-white/8 rounded-xl p-4.5 space-y-3.5 shadow-xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-[#F5F7FA] uppercase">
            GOVERNANCE GATE
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse"></span>
          <span>AUTHORIZED</span>
        </div>
      </div>

      {/* Grid of Security Checks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {checkItems.map((item) => (
          <div key={item.label} className="p-2 rounded-lg bg-[#151920] border border-white/6 space-y-0.5">
            <div className="text-[9px] font-mono text-[#5F6875] uppercase tracking-wider">
              {item.label}
            </div>
            <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-2 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <div className="text-[#9BA3AF] flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Zero Reservation Price Disclosure • Full Invariant Integrity</span>
        </div>

        <button
          onClick={onSimulateViolation}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Test Out-of-Bounds Block</span>
        </button>
      </div>
    </div>
  );
};
