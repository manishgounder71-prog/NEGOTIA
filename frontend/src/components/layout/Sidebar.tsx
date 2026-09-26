import React from 'react';
import { 
  Activity, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Users, 
  BarChart3, 
  Sliders, 
  Radio, 
  FileCode, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  History, 
  CheckCircle2,
  Terminal,
  Zap
} from 'lucide-react';
import { useNegotiation, NavigationTab } from '../../context/NegotiationContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, runDemoMode, isDemoRunning, runSecurityAttackSimulation, isSecurityAttackRunning } = useNegotiation();

  const navGroups = [
    {
      group: 'COMMAND CENTER',
      items: [
        { id: 'COMMAND_CENTER' as NavigationTab, label: 'Live Overview', icon: Activity },
      ],
    },
    {
      group: 'NEGOTIATIONS',
      items: [
        { id: 'ARENA' as NavigationTab, label: 'Negotiation Arena', icon: Radio, badge: 'LIVE' },
        { id: 'MULTI_VENDOR_RFQ' as NavigationTab, label: 'Multi-Vendor RFQ', icon: Layers, badge: 'STRETCH' },
        { id: 'ACTIVE_DEALS' as NavigationTab, label: 'Active Deals', icon: Zap },
        { id: 'HISTORY' as NavigationTab, label: 'Negotiation History', icon: History },
      ],
    },
    {
      group: 'PROCUREMENT',
      items: [
        { id: 'PROCUREMENT_WIZARD' as NavigationTab, label: 'Launch RFQ Wizard', icon: FileCode },
        { id: 'SUPPLIERS' as NavigationTab, label: 'Suppliers Intelligence', icon: Users },
        { id: 'CONTRACT_VAULT' as NavigationTab, label: 'Contracts & Vault', icon: FileText },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'AGENT_INSPECTOR' as NavigationTab, label: 'Lyzr Agent Inspector', icon: Cpu },
        { id: 'SECURITY_TESTS' as NavigationTab, label: 'Security & Attack Lab', icon: ShieldAlert, badge: 'TEST' },
      ],
    },
    {
      group: 'GOVERNANCE',
      items: [
        { id: 'POLICY_CENTER' as NavigationTab, label: 'Policy Center', icon: Sliders },
        { id: 'SAFETY_EVENTS' as NavigationTab, label: 'Safety Events', icon: ShieldCheck },
        { id: 'AUDIT_LEDGER' as NavigationTab, label: 'Audit Ledger (AIMS)', icon: Terminal },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'SYSTEM_STATUS' as NavigationTab, label: 'Lyzr Status & API', icon: CheckCircle2 },
        { id: 'SETTINGS' as NavigationTab, label: 'System Settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#08090B] border-r border-white/8 flex flex-col justify-between shrink-0 h-screen select-none sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              ◈
            </div>
            <div>
              <div className="text-base font-bold tracking-wider text-[#F5F7FA] font-mono">
                NEGOTIA
              </div>
              <div className="text-[10px] tracking-widest text-[#5F6875] font-semibold uppercase">
                Governed AI Procurement
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Demo Triggers */}
        <div className="px-3 pt-3 pb-2 space-y-1.5 border-b border-white/6">
          <button
            onClick={runDemoMode}
            disabled={isDemoRunning}
            className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded flex items-center justify-between border transition-all ${
              isDemoRunning 
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse' 
                : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border-indigo-500/25'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {isDemoRunning ? 'Running Demo Scenario...' : 'Run 3-Min Demo'}
            </span>
            <span className="text-[9px] bg-indigo-500/20 px-1 py-0.5 rounded font-mono">DEMO</span>
          </button>

          <button
            onClick={runSecurityAttackSimulation}
            disabled={isSecurityAttackRunning}
            className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded flex items-center justify-between border transition-all ${
              isSecurityAttackRunning 
                ? 'bg-red-500/15 text-red-300 border-red-500/30 animate-pulse' 
                : 'bg-red-500/5 text-red-300/80 hover:bg-red-500/15 border-red-500/20'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              {isSecurityAttackRunning ? 'Executing Attacks...' : 'Simulate Attack'}
            </span>
            <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-mono">SEC</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.group}>
              <div className="px-2 pb-1.5 text-[10px] font-mono tracking-wider text-[#5F6875] font-semibold uppercase">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#151920] text-[#F5F7FA] border border-white/10 shadow-sm'
                          : 'text-[#9BA3AF] hover:text-[#F5F7FA] hover:bg-white/3'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-[#5F6875]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                          item.badge === 'LIVE' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          item.badge === 'TEST' ? 'bg-red-500/15 text-red-400' :
                          'bg-white/10 text-white/70'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-white/8 bg-[#0D0F13]/60">
        <div className="p-2.5 rounded bg-[#111419] border border-white/6 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse inline-block"></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <div className="space-y-1 text-[10px] font-mono text-[#9BA3AF]">
            <div className="flex justify-between items-center">
              <span className="text-[#5F6875]">LYZR ENGINE</span>
              <span className="text-emerald-400/90 font-medium">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5F6875]">SAFE AI GUARD</span>
              <span className="text-emerald-400/90 font-medium">ACTIVE (100%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5F6875]">AIMS LEDGER</span>
              <span className="text-emerald-400/90 font-medium">ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
