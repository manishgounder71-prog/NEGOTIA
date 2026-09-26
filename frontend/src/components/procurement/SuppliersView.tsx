import React from 'react';
import { Users, CheckCircle2, TrendingDown, ArrowUpRight, ShieldCheck, PlusCircle } from 'lucide-react';
import { MOCK_SUPPLIERS } from '../../data/mockData';
import { useNegotiation } from '../../context/NegotiationContext';

export const SuppliersView: React.FC = () => {
  const { setActiveTab } = useNegotiation();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
              <Users className="w-3.5 h-3.5" />
              ENTERPRISE SUPPLIER MATRIX
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Supplier Intelligence &amp; Autonomous Performance
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Real historical metrics: compliance scores, average concessions, deal velocity, and risk classifications.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('PROCUREMENT_WIZARD')}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New RFQ for Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_SUPPLIERS.map((supp) => (
          <div key={supp.id} className="p-5 rounded-xl bg-[#111419] border border-white/8 space-y-4 shadow-xl hover:border-white/16 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C222B] border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-indigo-300">
                  {supp.avatarInitials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FA]">{supp.name}</h3>
                  <p className="text-xs text-[#5F6875]">{supp.category}</p>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                supp.status === 'PREFERRED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                'bg-blue-500/15 text-blue-400 border border-blue-500/25'
              }`}>
                {supp.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2.5 rounded-lg bg-[#151920] border border-white/4">
                <div className="text-[10px] text-[#5F6875] uppercase">COMPLIANCE</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{supp.complianceScore}%</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#151920] border border-white/4">
                <div className="text-[10px] text-[#5F6875] uppercase">RELIABILITY</div>
                <div className="text-sm font-bold text-indigo-300 mt-0.5">{supp.reliabilityScore}%</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#151920] border border-white/4">
                <div className="text-[10px] text-[#5F6875] uppercase">AVG CONCESSION</div>
                <div className="text-sm font-bold text-[#F5F7FA] mt-0.5">{supp.avgConcessionPercent}%</div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/6 flex items-center justify-between text-xs font-mono">
              <span className="text-[#5F6875]">Deals Closed: <strong className="text-[#F5F7FA]">{supp.dealsClosed} / {supp.negotiationCount}</strong></span>
              <span className="text-emerald-400 font-semibold">RISK: {supp.riskRating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
