import React from 'react';
import { Layers, CheckCircle2, TrendingDown, ArrowRight, Award, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { MULTI_VENDOR_RFQ_DATA } from '../../data/mockData';
import { useNegotiation } from '../../context/NegotiationContext';

export const MultiVendorRFQ: React.FC = () => {
  const { setActiveTab } = useNegotiation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              STRETCH CAPABILITY • MULTI-VENDOR RFQ
            </span>
            <span className="text-xs font-mono text-[#5F6875]">1 BUYER VS 3 VENDORS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Simultaneous Multi-Vendor RFQ &amp; Pareto Frontier
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Concurrent multi-agent negotiation matrix. The platform scores weighted multi-issue utility to discover the Pareto-optimal deal.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ARENA')}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Dual-Agent Arena</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-Supplier Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MULTI_VENDOR_RFQ_DATA.map((vendor) => (
          <div 
            key={vendor.vendorName}
            className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
              vendor.rank === 1
                ? 'bg-[#151920] border-emerald-500/40 ring-1 ring-emerald-500/20'
                : 'bg-[#111419] border-white/8 hover:border-white/16'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#1C222B] border border-white/8 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                    {vendor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F5F7FA]">{vendor.vendorName}</h3>
                    <span className="text-[10px] text-[#5F6875] font-mono">Rank #{vendor.rank} Bidder</span>
                  </div>
                </div>

                {vendor.rank === 1 && (
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" /> WINNER
                  </span>
                )}
              </div>

              {/* Utility Score */}
              <div className="py-3 text-center border-b border-white/4">
                <span className="text-[10px] font-mono text-[#5F6875] uppercase">WEIGHTED PARETO UTILITY</span>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-0.5">
                  {vendor.utilityScore} <span className="text-xs text-[#5F6875]">/ 100</span>
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="space-y-1.5 pt-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/4">
                  <span className="text-[#5F6875]">Offered Price:</span>
                  <span className="text-[#F5F7FA] font-bold">${vendor.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/4">
                  <span className="text-[#5F6875]">Delivery Timeline:</span>
                  <span className="text-[#F5F7FA] font-bold">{vendor.deliveryDays} Days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/4">
                  <span className="text-[#5F6875]">SLA Uptime:</span>
                  <span className="text-[#F5F7FA] font-bold">{vendor.sla}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/4">
                  <span className="text-[#5F6875]">Payment Terms:</span>
                  <span className="text-[#F5F7FA] font-bold">{vendor.paymentTerms}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#5F6875]">Liquidated Penalty:</span>
                  <span className="text-[#F5F7FA] font-bold">{vendor.penalty}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#08090B] border border-white/4 text-xs text-[#9BA3AF] leading-relaxed italic">
              "{vendor.recommendation}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
