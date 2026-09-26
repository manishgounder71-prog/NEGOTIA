import React from 'react';
import { Terminal, ShieldCheck, CheckCircle2, Cpu, ArrowRight, ShieldAlert } from 'lucide-react';

export const AgentActivityStream: React.FC = () => {
  const streamEvents = [
    { id: '1', time: '21:41:08', type: 'AGENT', actor: 'BUYER', text: 'Buyer Agent analyzing supplier proposal on Net 45 terms', status: 'INFO' },
    { id: '2', time: '21:41:06', type: 'SAFE_AI', actor: 'POLICY', text: 'Policy Engine validated price ($100,000 <= $100,000 budget)', status: 'PASS' },
    { id: '3', time: '21:41:04', type: 'AGENT', actor: 'SUPPLIER', text: 'Supplier Agent evaluated delivery concession (accepted 34 days)', status: 'INFO' },
    { id: '4', time: '21:41:02', type: 'SAFE_AI', actor: 'SAFE_AI', text: 'Safe AI validation passed on all 6 commercial invariants', status: 'PASS' },
    { id: '5', time: '21:40:58', type: 'AGENT', actor: 'BUYER', text: 'Buyer generated Round 4 counter-offer ($100,000 / 34d / Net 45)', status: 'INFO' },
    { id: '6', time: '21:40:51', type: 'ARBITER', actor: 'ARBITER', text: 'Legal Arbiter checked SLA uptime (99.5%) & liquidated damages clause', status: 'PASS' },
    { id: '7', time: '21:40:37', type: 'INTERCEPT', actor: 'GUARDRAIL', text: 'Safe AI intercepted out-of-bounds proposal ($107K) — Zero leakage', status: 'BLOCKED' },
    { id: '8', time: '21:40:21', type: 'SAFE_AI', actor: 'POLICY', text: 'Round 1 opening bounds verified and cryptographically locked', status: 'PASS' }
  ];

  return (
    <div className="bg-[#111419] border border-white/8 rounded-xl p-5 space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-[#F5F7FA] tracking-tight">
            Live Agent Activity Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          ● REAL-TIME FEED
        </span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {streamEvents.map((evt) => (
          <div 
            key={evt.id} 
            className="p-2.5 rounded-lg bg-[#151920] border border-white/4 flex items-start justify-between gap-3 text-xs font-mono transition-all hover:bg-[#1C222B]"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">
                {evt.status === 'BLOCKED' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                ) : evt.status === 'PASS' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    evt.actor === 'BUYER' ? 'bg-emerald-500/15 text-emerald-300' :
                    evt.actor === 'SUPPLIER' ? 'bg-blue-500/15 text-blue-300' :
                    evt.actor === 'GUARDRAIL' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-indigo-500/15 text-indigo-300'
                  }`}>
                    {evt.actor}
                  </span>
                  <span className="text-[10px] text-[#5F6875]">{evt.time}</span>
                </div>
                <div className="text-[#F5F7FA] text-[11px] leading-relaxed">
                  {evt.text}
                </div>
              </div>
            </div>

            <span className={`text-[9px] font-bold shrink-0 px-1.5 py-0.5 rounded ${
              evt.status === 'BLOCKED' ? 'text-amber-400 bg-amber-500/10' :
              evt.status === 'PASS' ? 'text-emerald-400 bg-emerald-500/10' :
              'text-[#9BA3AF]'
            }`}>
              {evt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
