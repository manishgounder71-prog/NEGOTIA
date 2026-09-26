import React from 'react';
import { Sliders, ShieldCheck, CheckCircle2, Lock, Plus, Save } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const PolicyCenter: React.FC = () => {
  const { session } = useNegotiation();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
              <Sliders className="w-3.5 h-3.5" />
              CORPORATE GOVERNANCE CENTER
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Policy Rules &amp; CFO / Legal Thresholds
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Configure deterministic policy rules that Safe AI enforces across all autonomous negotiation sessions.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md">
          <Save className="w-3.5 h-3.5" />
          <span>Save Governance Changes</span>
        </button>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {[
          { id: 'POL-01', title: 'Hard Budget Ceiling Enforcement', cat: 'FINANCE / CFO', val: 'Never exceed authorized PO budget ceiling ($100,000)', status: 'ACTIVE' },
          { id: 'POL-02', title: 'Minimum SLA Uptime Threshold', cat: 'OPERATIONS', val: 'SLA >= 99.5% required for all critical infrastructure suppliers', status: 'ACTIVE' },
          { id: 'POL-03', title: 'Mandatory Delay Damages Clause', cat: 'LEGAL', val: 'Liquidated delay damages must be >= 5.0% / week', status: 'ACTIVE' },
          { id: 'POL-04', title: 'Zero-Knowledge Privacy Isolation', cat: 'SECURITY', val: 'Zero disclosure of private reservation prices or BATNAs', status: 'ACTIVE' },
          { id: 'POL-05', title: 'Governing Law Standardization', cat: 'COMPLIANCE', val: 'All contracts must specify Delaware or New York jurisdiction', status: 'ACTIVE' },
        ].map((rule) => (
          <div key={rule.id} className="p-4 rounded-xl bg-[#111419] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {rule.id}
                </span>
                <span className="text-[10px] text-[#5F6875] uppercase">{rule.cat}</span>
              </div>
              <div className="text-sm font-bold text-[#F5F7FA]">{rule.title}</div>
              <div className="text-[#9BA3AF] text-xs">{rule.val}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {rule.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
