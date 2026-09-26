import React from 'react';
import { Lock, ShieldCheck, ArrowLeftRight, CheckCircle2, EyeOff } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const PrivacyBoundaryView: React.FC = () => {
  const { session } = useNegotiation();

  return (
    <div className="bg-[#0D0F13] border border-white/8 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div>
          <h3 className="text-sm font-bold text-[#F5F7FA] tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Cryptographic Privacy Boundary & Enclosure Architecture</span>
          </h3>
          <p className="text-[11px] text-[#5F6875] font-mono">
            Zero-knowledge policy isolation: Private constraints never cross the governance perimeter
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-semibold">
          100% ISOLATION VERIFIED
        </span>
      </div>

      {/* 3-Zone Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
        {/* Buyer Private Zone */}
        <div className="lg:col-span-4 bg-[#111419] border border-emerald-500/30 rounded-xl p-4 space-y-2.5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              BUYER PRIVATE SPACE
            </span>
            <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded">
              ENCLOSED
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Budget Ceiling:</span>
              <span className="text-[#F5F7FA] font-bold">$100,000 max</span>
            </div>
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Private BATNA:</span>
              <span className="text-[#F5F7FA] font-bold">Alt Beta $103.5K</span>
            </div>
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Min SLA Threshold:</span>
              <span className="text-[#F5F7FA] font-bold">99.5%</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-emerald-400/90 text-center pt-1 flex items-center justify-center gap-1">
            <EyeOff className="w-3 h-3" />
            <span>Hidden from Supplier Agent</span>
          </div>
        </div>

        {/* Center Governance Gate */}
        <div className="lg:col-span-3 bg-[#151920] border border-indigo-500/40 rounded-xl p-3 text-center space-y-2 relative shadow-lg">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-[#F5F7FA]">
              GOVERNANCE GATEWAY
            </div>
            <div className="text-[10px] text-[#9BA3AF] mt-0.5">
              Only authorized public proposal values pass
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#0D0F13] border border-white/6 text-[10px] font-mono text-emerald-400">
            ✓ Public Bid: $100,000 / 34d
          </div>
        </div>

        {/* Supplier Private Zone */}
        <div className="lg:col-span-4 bg-[#111419] border border-blue-500/30 rounded-xl p-4 space-y-2.5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              SUPPLIER PRIVATE SPACE
            </span>
            <span className="text-[9px] font-mono bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded">
              ENCLOSED
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Cost Floor:</span>
              <span className="text-[#F5F7FA] font-bold">$98,000 min</span>
            </div>
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Margin Floor:</span>
              <span className="text-[#F5F7FA] font-bold">18.5% margin</span>
            </div>
            <div className="p-2 rounded bg-[#151920] border border-white/4 flex justify-between">
              <span className="text-[#5F6875]">Min Production Time:</span>
              <span className="text-[#F5F7FA] font-bold">32 calendar days</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-blue-400/90 text-center pt-1 flex items-center justify-center gap-1">
            <EyeOff className="w-3 h-3" />
            <span>Hidden from Buyer Agent</span>
          </div>
        </div>
      </div>
    </div>
  );
};
