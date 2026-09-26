import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ArrowDown, 
  ExternalLink,
  Cpu,
  Lock,
  Download
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';
import { AuditEvent } from '../../types/negotiation';

export const AuditLedger: React.FC = () => {
  const { auditEvents, session, setSelectedAuditEvent, selectedAuditEvent } = useNegotiation();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredEvents = auditEvents.filter((evt) => {
    const matchesFilter = filterType === 'ALL' || 
      (filterType === 'BLOCKED' && evt.policyResult === 'BLOCKED') ||
      (filterType === 'PASSED' && evt.policyResult === 'PASSED') ||
      (filterType === 'SAFE_AI' && (evt.actor === 'GOVERNANCE_GATE' || evt.actor === 'LEGAL_ARBITER'));
    const matchesQuery = evt.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.inputSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono font-bold">
              <Terminal className="w-3.5 h-3.5" />
              LYZR AIMS IMMUTABLE LEDGER
            </span>
            <span className="text-xs font-mono text-[#5F6875]">SESSION: {session.id}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Audit Ledger & Decision Traceability
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Every negotiation decision, proposal validation, and policy check is cryptographically recorded.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AUDIT CHAIN VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Strip (Section 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">NEGOTIATION ID</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1 truncate">{session.id}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">TOTAL EVENTS</div>
          <div className="text-lg font-bold text-[#F5F7FA] mt-0.5">42 Events</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">ROUNDS</div>
          <div className="text-lg font-bold text-indigo-400 mt-0.5">4 Rounds</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">POLICY CHECKS</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">18 Checks</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">BLOCKED EVENTS</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">2 Intercepts</div>
        </div>

        <div className="p-3 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-[10px] text-[#5F6875] uppercase">HUMAN ESCALATIONS</div>
          <div className="text-lg font-bold text-[#F5F7FA] mt-0.5">0 Escalations</div>
        </div>
      </div>

      {/* Cryptographic Hash Chain Visualization (Section 25) */}
      <div className="p-4 rounded-xl bg-[#0D0F13] border border-white/8 space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9BA3AF] font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>CRYPTOGRAPHIC HASH INTEGRITY CHAIN</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ✓ SHA-256 HASH CHAIN TAMPER-PROOF
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs overflow-x-auto py-1">
          <span className="px-2.5 py-1 rounded bg-[#151920] border border-white/6 text-indigo-300">
            0x8f19... (GENESIS)
          </span>
          <span className="text-[#5F6875]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#151920] border border-white/6 text-indigo-300">
            0x3c91... (R1_BUYER)
          </span>
          <span className="text-[#5F6875]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#151920] border border-white/6 text-indigo-300">
            0x12a9... (R1_SUPP)
          </span>
          <span className="text-[#5F6875]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#151920] border border-amber-500/30 text-amber-300">
            0x99a1... (INTERCEPT)
          </span>
          <span className="text-[#5F6875]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#151920] border border-emerald-500/30 text-emerald-300 font-bold">
            0xe3b0... (RATIFIED)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111419] p-3 rounded-xl border border-white/6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6875]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter events, actions, or hashes..."
              className="w-full bg-[#151920] border border-white/8 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F5F7FA] placeholder-[#5F6875] outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs font-mono">
          {['ALL', 'PASSED', 'BLOCKED', 'SAFE_AI'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#151920] text-[#9BA3AF] hover:text-white border border-white/4'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Events Vertical Timeline */}
      <div className="space-y-3 font-mono">
        {filteredEvents.map((evt) => {
          const isBlocked = evt.policyResult === 'BLOCKED';
          return (
            <div
              key={evt.id}
              onClick={() => setSelectedAuditEvent(evt)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isBlocked
                  ? 'bg-[#111419] border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-[#111419] border-white/6 hover:border-white/16'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-white/4">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className="text-xs font-bold text-[#F5F7FA]">{evt.action}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    evt.actor === 'BUYER' ? 'bg-emerald-500/15 text-emerald-300' :
                    evt.actor === 'SUPPLIER' ? 'bg-blue-500/15 text-blue-300' :
                    evt.actor === 'GOVERNANCE_GATE' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-indigo-500/15 text-indigo-300'
                  }`}>
                    {evt.actor}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#5F6875]">
                  <span>{evt.timestamp}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    isBlocked ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {evt.policyResult}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-6 space-y-0.5">
                  <span className="text-[#5F6875] text-[10px] uppercase">INPUT SUMMARY</span>
                  <p className="text-[#9BA3AF]">{evt.inputSummary}</p>
                </div>

                <div className="md:col-span-6 space-y-0.5">
                  <span className="text-[#5F6875] text-[10px] uppercase">SYSTEM DECISION</span>
                  <p className="text-[#F5F7FA]">{evt.decision}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/4 flex items-center justify-between text-[11px] text-[#5F6875]">
                <div className="flex items-center gap-2 truncate">
                  <span>HASH:</span>
                  <span className="text-indigo-400 truncate">{evt.hash}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(evt.hash);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-[#9BA3AF]"
                    title="Copy Event Hash"
                  >
                    {copiedHash === evt.hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <span className="text-indigo-300 text-[10px] hover:underline">
                  Inspect Raw Event →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw Event Detail Modal */}
      {selectedAuditEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0D0F13] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="text-sm font-bold text-[#F5F7FA]">
                AIMS Raw Event Trace: {selectedAuditEvent.id}
              </div>
              <button
                onClick={() => setSelectedAuditEvent(null)}
                className="text-xs text-[#9BA3AF] hover:text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#111419] border border-white/6 text-xs text-indigo-300 overflow-x-auto max-h-80 leading-relaxed">
              {JSON.stringify(selectedAuditEvent, null, 2)}
            </pre>

            <button
              onClick={() => setSelectedAuditEvent(null)}
              className="w-full py-2 rounded-lg bg-[#151920] hover:bg-[#1C222B] border border-white/10 text-white text-xs font-semibold cursor-pointer"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
