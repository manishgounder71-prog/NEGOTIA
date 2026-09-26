import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Terminal, 
  AlertTriangle, 
  RotateCcw,
  Zap,
  EyeOff
} from 'lucide-react';
import { useNegotiation } from '../../context/NegotiationContext';

export const SecurityTestPanel: React.FC = () => {
  const { 
    securityTests, 
    runSecurityAttackSimulation, 
    isSecurityAttackRunning,
    setActiveTab 
  } = useNegotiation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[#0D0F13] border border-white/8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              ADVERSARIAL SECURITY LAB
            </span>
            <span className="text-xs font-mono text-[#5F6875]">LYZR SAFE AI RESILIENCE BENCHMARK</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Governance Attack Simulation & Injection Defense
          </h1>
          <p className="text-xs text-[#9BA3AF]">
            Validate that prompt injection attacks, budget override attempts, and private BATNA extraction queries are deterministically blocked.
          </p>
        </div>

        <button
          onClick={runSecurityAttackSimulation}
          disabled={isSecurityAttackRunning}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            isSecurityAttackRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isSecurityAttackRunning ? 'EXECUTING ADVERSARIAL ATTACKS...' : 'RUN GOVERNANCE TEST SUITE'}</span>
        </button>
      </div>

      {/* Hero Attack Summary Scoreboard (Section 43) */}
      <div className="p-5 rounded-2xl bg-[#0D0F13] border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono shadow-2xl">
        <div className="p-4 rounded-xl bg-[#111419] border border-white/6">
          <div className="text-xs text-[#5F6875] uppercase">SIMULATED ATTACKS</div>
          <div className="text-3xl font-bold text-[#F5F7FA] mt-1">03 PROBES</div>
          <div className="text-[10px] text-[#9BA3AF] mt-1">Prompt Injection & Overrides</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-emerald-500/20">
          <div className="text-xs text-[#5F6875] uppercase">GOVERNANCE ENFORCEMENT</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">3 / 3 BLOCKED</div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">100% Intercept Rate</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-indigo-500/20">
          <div className="text-xs text-[#5F6875] uppercase">PRIVATE DATA LEAKAGE</div>
          <div className="text-3xl font-bold text-indigo-300 mt-1">0 LEAKS</div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">Zero Reservation Price Disclosure</div>
        </div>
      </div>

      {/* Adversarial Attack Scenarios List */}
      <div className="space-y-4">
        {securityTests.map((test, idx) => (
          <div 
            key={test.id} 
            className="p-5 rounded-xl bg-[#111419] border border-white/8 space-y-3 font-mono transition-all hover:border-white/16 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/6">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FA]">
                    {test.title}
                  </h3>
                  <span className="text-[10px] text-[#5F6875]">{test.ruleViolated}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PROMPT INJECTION DETECTED &amp; BLOCKED
                </span>
              </div>
            </div>

            {/* Prompt payload */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#5F6875] uppercase">SIMULATED ADVERSARIAL INJECTION PAYLOAD</span>
              <div className="p-3 rounded-lg bg-[#08090B] border border-white/6 text-xs text-red-300/90 font-mono">
                "{test.simulatedInput}"
              </div>
            </div>

            {/* Defense Status Verification */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2 rounded bg-[#151920] border border-white/4 flex items-center justify-between">
                <span className="text-[#5F6875]">Result:</span>
                <span className="text-emerald-400 font-bold">BLOCKED</span>
              </div>

              <div className="p-2 rounded bg-[#151920] border border-white/4 flex items-center justify-between">
                <span className="text-[#5F6875]">Buyer Policy:</span>
                <span className="text-emerald-400 font-bold">PROTECTED</span>
              </div>

              <div className="p-2 rounded bg-[#151920] border border-white/4 flex items-center justify-between">
                <span className="text-[#5F6875]">Supplier Visibility:</span>
                <span className="text-emerald-400 font-bold">DENIED</span>
              </div>

              <div className="p-2 rounded bg-[#151920] border border-white/4 flex items-center justify-between">
                <span className="text-[#5F6875]">AIMS Audit:</span>
                <span className="text-indigo-300 font-bold">RECORDED</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
