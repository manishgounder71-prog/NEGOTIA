import React from 'react';
import { Search, Bell, Shield, Radio, ShieldCheck, Terminal, Cpu, Sparkles } from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const TopBar: React.FC = () => {
  const { activeTab, setIsCommandPaletteOpen, isDemoRunning, demoProgressText } = useNegotiation();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'COMMAND_CENTER': return 'Command Center / Overview';
      case 'ARENA': return 'Negotiations / Arena (NEG-2026-00421)';
      case 'ACTIVE_DEALS': return 'Negotiations / Active Deals';
      case 'HISTORY': return 'Negotiations / History Archive';
      case 'PROCUREMENT_WIZARD': return 'Procurement / Launch RFQ Wizard';
      case 'SUPPLIERS': return 'Procurement / Supplier Intelligence';
      case 'CONTRACT_VAULT': return 'Procurement / Digital Contract Vault';
      case 'POLICY_CENTER': return 'Governance / Policy Center';
      case 'SAFETY_EVENTS': return 'Governance / Safety Intercept Events';
      case 'AUDIT_LEDGER': return 'Governance / Lyzr AIMS Audit Ledger';
      case 'SECURITY_TESTS': return 'Intelligence / Security Attack Lab';
      case 'MULTI_VENDOR_RFQ': return 'Intelligence / Multi-Vendor RFQ Matrix';
      case 'AGENT_INSPECTOR': return 'Intelligence / Lyzr Agent Inspector';
      case 'SYSTEM_STATUS': return 'System / Lyzr Health & API Status';
      case 'SETTINGS': return 'System / Configuration Settings';
      default: return 'Command Center';
    }
  };

  return (
    <header className="h-14 bg-[#08090B]/90 backdrop-blur-md border-b border-white/8 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="text-xs font-mono text-[#5F6875]">NEGOTIA</div>
        <div className="text-xs text-white/20">/</div>
        <div className="text-xs font-medium text-[#F5F7FA] truncate max-w-[280px]">
          {getBreadcrumbTitle()}
        </div>
      </div>

      {/* Center: Global Search / Command Bar (⌘K) */}
      <div className="flex-1 max-w-lg mx-6">
        {isDemoRunning ? (
          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1.5 flex items-center justify-between text-xs text-amber-300 font-mono animate-pulse">
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              {demoProgressText || 'Autonomous Demo Simulation Active...'}
            </span>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded uppercase font-semibold">LIVE SCRIPT</span>
          </div>
        ) : (
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full bg-[#111419] hover:bg-[#151920] border border-white/8 hover:border-white/16 rounded-md px-3 py-1.5 flex items-center justify-between text-xs text-[#5F6875] transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#5F6875] group-hover:text-[#9BA3AF]" />
              <span className="text-[#9BA3AF] group-hover:text-[#F5F7FA]">Search negotiations, suppliers, contracts, audit hashes...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-[#151920] group-hover:bg-[#1C222B] text-[#9BA3AF] px-1.5 py-0.5 rounded border border-white/6">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        )}
      </div>

      {/* Right: Live Status Badges & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#111419] border border-white/6 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse"></span>
            <span>LIVE</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#111419] border border-white/6 text-[10px] font-mono text-[#9BA3AF]">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>LYZR</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#111419] border border-white/6 text-[10px] font-mono text-[#9BA3AF]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SAFE AI</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#111419] border border-white/6 text-[10px] font-mono text-[#9BA3AF]">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>AIMS</span>
          </div>
        </div>

        {/* Notifications */}
        <button 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-8 h-8 rounded bg-[#111419] hover:bg-[#151920] border border-white/8 flex items-center justify-center text-[#9BA3AF] hover:text-[#F5F7FA] relative transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/8">
          <div className="w-7 h-7 rounded bg-[#151920] border border-white/10 flex items-center justify-center text-xs font-mono font-semibold text-indigo-300">
            CPO
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-[#F5F7FA] leading-none">Enterprise CPO</div>
            <div className="text-[10px] font-mono text-[#5F6875] leading-none mt-1">Admin Level 4</div>
          </div>
        </div>
      </div>
    </header>
  );
};
