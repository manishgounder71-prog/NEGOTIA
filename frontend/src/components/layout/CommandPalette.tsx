import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Radio, 
  ShieldAlert, 
  FileText, 
  Terminal, 
  Users, 
  PlusCircle, 
  Sparkles, 
  Layers, 
  Sliders,
  ArrowRight
} from 'lucide-react';
import { useNegotiation, NavigationTab } from '../../context/NegotiationContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveTab, 
    runDemoMode, 
    runSecurityAttackSimulation,
    setBlockedProposalModalOpen
  } = useNegotiation();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    {
      group: 'RECENT NAVIGATION',
      items: [
        {
          id: 'open-negotiation',
          title: 'Open Negotiation: NovaTech vs Apex (NEG-2026-00421)',
          subtitle: 'Active 4-round IoT sensor procurement',
          icon: Radio,
          action: () => {
            setActiveTab('ARENA');
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'review-blocked',
          title: 'Review Blocked Proposal ($107,000 Out-of-Bounds)',
          subtitle: 'Safe AI hard guardrail interception audit',
          icon: ShieldAlert,
          action: () => {
            setActiveTab('ARENA');
            setBlockedProposalModalOpen(true);
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'inspect-supplier',
          title: 'Inspect Supplier Intelligence: Apex Components Ltd.',
          subtitle: '98% compliance, 14 negotiations, 8.2% avg concession',
          icon: Users,
          action: () => {
            setActiveTab('SUPPLIERS');
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'view-contract',
          title: 'View Digital Contract: PACT-2026-9842',
          subtitle: 'Compiled PDF, SHA-256 hash & digital signature stamps',
          icon: FileText,
          action: () => {
            setActiveTab('CONTRACT_VAULT');
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'open-audit',
          title: 'Inspect Lyzr AIMS Audit Trail (42 Events)',
          subtitle: 'Cryptographic hash chain and turn-by-turn proofs',
          icon: Terminal,
          action: () => {
            setActiveTab('AUDIT_LEDGER');
            setIsCommandPaletteOpen(false);
          }
        }
      ]
    },
    {
      group: 'EXECUTIVE & GOVERNANCE ACTIONS',
      items: [
        {
          id: 'run-demo',
          title: 'Execute 3-Minute Autonomous Demo Scenario',
          subtitle: 'Auto-step through Rounds 1-4, policy block, and contract generation',
          icon: Sparkles,
          action: () => {
            runDemoMode();
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'run-attack-sim',
          title: 'Simulate Adversarial Governance Attacks (Prompt Injections)',
          subtitle: 'Test BATNA extraction and budget ceiling breach containment',
          icon: ShieldAlert,
          action: () => {
            runSecurityAttackSimulation();
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'create-rfq',
          title: 'Launch New Procurement Wizard',
          subtitle: 'Configure product, budget envelope, and Safe AI thresholds',
          icon: PlusCircle,
          action: () => {
            setActiveTab('PROCUREMENT_WIZARD');
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'multi-vendor',
          title: 'Open Multi-Vendor RFQ Tournament (1 Buyer vs 3 Suppliers)',
          subtitle: 'Simultaneous 3-way Pareto efficiency competition',
          icon: Layers,
          action: () => {
            setActiveTab('MULTI_VENDOR_RFQ');
            setIsCommandPaletteOpen(false);
          }
        },
        {
          id: 'policy-center',
          title: 'Configure Corporate CFO & Legal Policy Envelopes',
          subtitle: 'Manage budget ceilings, SLA minimums, and penalty tiers',
          icon: Sliders,
          action: () => {
            setActiveTab('POLICY_CENTER');
            setIsCommandPaletteOpen(false);
          }
        }
      ]
    }
  ];

  const filteredGroups = quickActions.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
    )
  })).filter((g) => g.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#0D0F13] border border-white/12 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-white/8 flex items-center gap-3 bg-[#111419]">
          <Search className="w-4 h-4 text-[#9BA3AF] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search contracts, or jump to view..."
            autoFocus
            className="w-full bg-transparent border-none outline-none text-sm text-[#F5F7FA] placeholder-[#5F6875] font-sans"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded hover:bg-white/10 text-[#9BA3AF] hover:text-[#F5F7FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 max-h-[60vh]">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F6875]">
              No matching commands or entities found for "{query}"
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group}>
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#5F6875] font-semibold">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#151920] border border-transparent hover:border-white/8 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-[#111419] border border-white/8 flex items-center justify-center text-[#9BA3AF] group-hover:text-indigo-400 group-hover:border-indigo-500/30">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#F5F7FA] group-hover:text-white">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#5F6875]">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#5F6875] opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 px-4 bg-[#08090B] border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-[#5F6875]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-[#111419] border border-white/8 text-[#9BA3AF]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[#111419] border border-white/8 text-[#9BA3AF]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#111419] border border-white/8 text-[#9BA3AF]">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#111419] border border-white/8 text-[#9BA3AF]">ESC</kbd> Close</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LYZR SAFE AI ONLINE
          </div>
        </div>
      </div>
    </div>
  );
};
